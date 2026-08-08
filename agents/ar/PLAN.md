# AR (passthrough MR) for oYmer Type Studio - implementation plan

Task **AR1**. Written 2026-08-08 against `oYmer.extension` at `a32a0cb` and the panel as it
stands (`panel/panel.html`, 146 KB, three **r160**, zero WebXR code).

Nothing here re-opens a decided question. Decided already, carried forward as given:
tethered to the PC (Revit open, LAN) so an approval still writes a real family type ·
Quest 3 only, WebXR `immersive-ar` · FULL parameter control in AR · spatial parameters get
handles ON the object, materials and name-parsed dropdowns get a small wrist panel ·
handles first · wall-mounted families snap to real walls using plane semantic labels
(`WALL_FACE`, `WINDOW_FRAME`, `DOOR_FRAME`) and anchors.

---

## 0. The one architectural call this plan makes

**The headset is a second input device on the existing desktop panel. It is NOT a second
client of Revit.**

Everything else falls out of that:

- The pyRevit routes server is single-threaded HTTP/1.0 and the standing rule is
  **ONE DRIVER AT A TIME** (`HANDOFF.md`: three times in one night my own polling starved
  his panel, and twice a request came back carrying his answer). Put a headset in the room
  and you have literally two drivers. Making the headset a peripheral of the panel removes
  the whole class of bug rather than managing it.
- `/open` mints a **new sandbox document copy** every time. Two openers = two sandboxes, or
  one stealing the other's. One opener = no such question.
- The desktop panel already holds every expensive thing: `learned` (the displacement fields,
  0.00 mm after refinement), `states`, `drives`, `values`, the author's ordered sections, the
  verdict cache. The headset consumes them. Nothing is studied twice, and a 7.4 minute fresh
  study never happens because of AR.
- **Commit still goes through the PC by construction**, not by policy. The headset has no
  path to Revit at all.

So the deliverable is a **new page**, `panel/ar.html`, plus a small local HTTPS server. The
146 KB of hard-won behaviour in `panel.html` is not forked and is edited only to add a
broadcast hook. It has still not been judged by his eye; do not disturb it.

---

## 1. Getting the panel onto the LAN over HTTPS

Today: the ribbon opens `file:///.../panel/panel.html?api=http://127.0.0.1:48884/oymer_typestudio`
(`oYmer.tab/General.panel/TypeStudio.pushbutton/script.py`). Every POST is `text/plain` so the
browser does not preflight it, and the API carries CORS.

That address can never do WebXR: `file:///` is not a secure context, the Quest is a different
machine, and an HTTPS page may not `fetch` `http://127.0.0.1` (mixed content, hard block).

**Answer: one small Node HTTPS server on the PC that is both the static host and a reverse
proxy, so the page and the API share one origin.** New file `tools/ar-serve.js`.

| It does | Why |
|---|---|
| HTTPS on **8444**, self-signed cert, same pattern as `https://<PC-IP>:8443/wm.html` | WebXR needs a secure context; the Quest accepts the cert once. ⛔ Not 8443 - the VR Tour App's `serve.js` already owns that and a port fight is a silent failure |
| Serves `panel/` statically | `ar.html`, `three.min.js`, `ar-*.js` |
| Reverse-proxies `/oymer_typestudio/*` to `http://127.0.0.1:<routes port>/oymer_typestudio/*` | Same origin: no mixed content, no CORS, no preflight |
| Reads the routes port exactly as `script.py` does (`user_config.routes` then `PYREVIT_ROUTES_PORT` then 48884) | Two places guessing a port is one place too many |
| **Serialises everything it proxies through one queue** | The routes server serves one connection at a time. The proxy is the only place that can hold that line once more than one browser exists |
| Serves `/` = the AR page | ⛔ **THE BARE ADDRESS IS THE ONLY ADDRESS.** "i only use 8443 no text no parmetr." No path, no query string. Diagnostics live on a controller button |

The ribbon button gains a second action (or a second button, `Type Studio in AR`) that starts
the server if it is not running and prints `https://<PC-IP>:8444` plus a QR code in the pyRevit
output window. He points the Quest browser at it once and it stays in history.

**Verify phase 1 by:** the Quest browser loads the page over HTTPS, the cert warning is accepted
once, and `/selection` answers with the element he has picked in Revit. Nothing 3D yet.

---

## 2. How the geometry and the learned spans reach the headset

### What has to travel

| Payload | Source | Units | Note |
|---|---|---|---|
| `geometry.meshes[]` = `{id, positions[], indices[], color}` | `/open`, `/set` | **mm** (`sandbox.py: FEET_TO_MM`) | divide by 1000 once, at the boundary, never twice |
| `values` | `/open` | **feet** | `MM = 304.8` in the panel |
| controls, in the author's own sections and order | `GetOrderedParameters` | - | including the locked `↓ משוואות - לא לגעת ↓` section |
| `learned[name]` = the displacement field + `guard:[minMm,maxMm]` | panel memory / disk cache | mm | the expensive thing. Per-mesh vertex sample arrays |
| `states[name]` = sampled discrete configurations | panel memory | mm | switches and nested types |
| `drives[name].amounts[]` = how far each mesh travels | panel memory | mm | drives both the highlight and the handle gain |
| `facesFor()` = the axis + the faces that DEFINE a dimension | computed in the panel | - | this is the handle anchor, see section 3 |

### The channel

A **WebSocket on the same HTTPS origin** (`wss://<PC-IP>:8444/bridge`), hosted by `ar-serve.js`.
Both the desktop panel and the AR page connect to it. The server is a dumb relay with exactly
two roles: desktop and headset. If no desktop is connected, the AR page says so and offers
nothing it cannot honour.

Same origin means the cert is already accepted and there is no second trust prompt.

### Three deliveries, in order of when they are needed

1. **On connect: the snapshot.** Base geometry, values, controls, sections, verdicts, and for
   each control only its `guard` span and its handle descriptor. Small. JSON is fine.
2. **While dragging (phase 3): value up, vertices down.** The headset sends
   `{parameter, value}`; the desktop applies it through its own existing path (local field
   first, Revit only when there is no model) and streams back the changed vertex positions as
   a **binary frame of Float32**, one array per changed mesh. LAN Wi-Fi round trip is roughly
   5 to 15 ms, which is fine at Quest frame rates, and it inherits the panel's coalescing rule
   verbatim: never more than one in flight, and when it lands send the LATEST value, not the
   one the drag started with.
3. **Later (phase 5): the field itself, lazily.** The first time a handle is grabbed, the
   desktop ships that control's `learned[name]` for the meshes that actually move
   (`drives[name].amounts[i] >= MOVED_MM`), as Float32, once. From then on the headset runs
   `applyLearned` locally at the same 0.04 ms/step the desktop gets, and the round trip is
   only the release confirmation.

⛔ Do not ship every field on connect. On the window that is 16 controls times 68 meshes of
vertex arrays. Lazy plus per-mesh filtering is what keeps it to a handful of meshes per grab.

### The pure code both pages need

`panel.html` already brackets the extractable part:

    632  /* --8<-- highlight-model --8<-- */
    859  /* --8<-- end highlight-model --8<-- */

That block (`displacements`, `chooseParts`, `meshBounds`, `unionBounds`, `facesFor`) is pure and
node-testable. Phase 2 lifts it into `panel/lib-shape.js`, loaded by both pages via one
`<script src>`. `applyLearned` and `showState` follow in phase 5. **One copy, or the two pages
drift and only one of them is right.**

---

## 3. How a handle maps to a parameter

The panel already computed the hard part on 2026-08-03 for the highlight, and it is exactly what
a handle needs:

    Width  -> meshes 31,32,34,36   the two side panels     "the 2 right and left"
    Height -> meshes 38,39         the top panel            "only the top mesh"
    Depth  -> meshes 24,28,30      the back panel           "only the back one"

`facesFor(samples)` returns the **axis** the control stretches the object along and the mesh
indices of the faces that define it. So:

**Which controls get a handle.** Every control that has a learned model, a non-empty
`facesFor` result, and a verdict that is neither `moves nothing` nor
`structure changes at every step`. The other two verdicts already exist and are cached; they
are a free classifier. Everything they exclude goes to the wrist panel.

**Where the handle sits.** At the centroid of each defining face, pushed out along the axis by
about 40 mm so it is grabbable without fighting the surface. One handle per defining face, so
Width really does get a grip on each side, which is what "pull the desk edge to widen it" means.

**What a drag is worth.** Take the controller's world delta, bring it into the object's local
frame (the object is anchored, so its frame is known), take the component along the control's
axis. **Do not assume a 1:1 or a 2:1 gain.** The samples already say how far that face travels
per unit of the parameter:

    gain = (guard[1] - guard[0]) / drives[name].amounts[faceIndex]

Measured, not assumed. Width driven from one side while both sides move is then correct without
anyone reasoning about it, and a control with an odd internal linkage is correct too.

**Where it stops.** Hard clamp to `learned[name].guard`. ⛔ Outside the measured range there is
no field, and guessing past the last sample is how a shape ends up 4.7 m wrong. At each end the
handle stops dead, ticks the controller haptics, and the readout says which end and why. A
handle that keeps sliding while the object does not move is the worst possible lie in a headset.

**What it looks like.** `#ff7a00`. While grabbed, the face the control drives lights orange and
the rest of the object goes white and see-through, matching `HIGHLIGHT-LOOK-LOCKED.md`. Do not
invent a second highlight language.

**The number.** A small label at the handle showing the live mm, because typing a size is what
he does today and the number is the thing he actually approves. Hold a controller button to snap
to 5 mm.

**On release.** Exactly what the desktop does now: one Revit confirmation, and ⛔ only the
LATEST answer may draw. An overtaken answer must not be allowed to speak, or the object snaps
back to two drags ago while he is standing inside it.

---

## 4. The wrist panel

Reuse the July in-VR menu. Source: `WM.ui.makePanel` in
`VR Tour App/white-model/viewer/wm-core.js` (around line 487) and the launcher pattern in
`wm-menu.js`. Copy the two into `panel/ar-ui.js` rather than depending on `wm-core`, which wants
a whole BIM pack to boot.

What comes across, and the rules that come with it:

- **HTML cannot render inside a WebXR session on the Quest.** Every control is a mesh. The panel
  is a `CanvasTexture` on a `PlaneGeometry`, hit-tested by `hitToId(uv)` from a right-trigger
  raycast, firing `onPick(id)`. That whole path was instrumented end to end in the emulator on
  2026-07-14 and works.
- ⛔⛔ **`flatShading` MUST be `true`.** It is true of every lit `MeshStandardMaterial` in the
  scene: the object, the handles, the wall proxy. Get it wrong and it renders black. (Worth
  knowing precisely: the panel plate itself is `MeshBasicMaterial`, unlit, so it cannot go black
  on its own. The rule bites the object and the handles, which is where it matters here.)
- ⛔ The readout gets `depthTest: false` and `renderOrder 9999`, or something in the scene hides
  the panel that is there to debug the scene.
- **Wrist mounted**, not placed at gaze: parented to the LEFT controller at about
  `(0, 0.12, -0.08)`, tilted toward the face. Same geometry as the July menu, different parent.
  Grip toggles it. A small head-locked launcher exists whenever it is hidden, because Quest test
  number 2 was "basically works, but after using a tool there was no way back to the menu".
- **RTL already works** (`ctx.direction = 'rtl'`), which matters because the sections are the
  family author's own Hebrew headers.
- **Contents:** one page per authored section, in the author's own order, the
  `↓ משוואות - לא לגעת ↓` section shown locked. Materials as a swatch grid. Nested family type
  slots as a button grid (19 real choices on his window; picking one really rebuilds it, so it
  is a `states[]` swap or a Revit round trip, never a vertex nudge).
- ⛔ A structure change is **all or nothing**. `showState` refuses a partial application. Keep
  that refusal: a partial application is not a cheap success, it is a wrong shape, and in a
  headset at 1:1 he will believe it.
- Every switch must be reachable in VR ([[feedback_all_ai_switches_in_vr]]). No control exists on
  the desktop panel that is unreachable in the headset.

---

## 5. How a commit still goes through the PC

Unchanged, and unchangeable by construction: the headset has no route to Revit.

1. Wrist panel, `צור טיפוס / Create type`. **Two step**: press, then confirm on a panel that
   names the family, the type name, and every value that differs from the original.
2. The AR page sends `{action:'commit'}` over the bridge.
3. The desktop panel runs its existing `call('commit', {values})`. `startup.py: def commit(doc,
   uiapp, request)` - the one write that needs the API thread, one single undo step.
4. **Revit's answer comes back to the headset.** A refused value surfaces on Create; today that
   lands on a screen he is looking at. In AR it must land on the wrist panel, in words, or the
   person wearing the goggles believes a thing happened that did not.
5. Guards before the button is even offered:
   - no desktop connected -> no Create button at all, and the readout says why. Do not offer it
     and fail at the end.
   - `/selection` says the active document changed -> refuse. Two documents open and the routes
     acting on the ACTIVE one already cost ten minutes once.
   - a control with a partial field -> refuse to draw locally and let Revit answer; never commit
     from a shape that was locally predicted past its measured span.

---

## 6. Walls, anchors, and the design check

- Plane detection returns semantic labels. **Which vocabulary the Quest browser actually hands
  over is what the spike answers**: Meta's OpenXR spelling (`WALL_FACE`, `WINDOW_FRAME`,
  `DOOR_FRAME`) or the WebXR spec's lowercase set (`wall`, `window`, `door`). `spike.html` prints
  the raw string verbatim and matches case-insensitively on both. Do not hard-code one until the
  headset has said which.
- A wall-hosted family snaps its host face flat to the plane using the plane's own pose
  quaternion. The plane's local Y is its normal; build the object thin along that axis and push
  out by half its thickness. No guessing at an up vector.
- `anchors` stops the drift. Create the anchor at placement, then drive the object from
  `frame.getPose(anchor.anchorSpace, refSpace)` every frame.
- ⛔⛔⛔ **Anything posed from a reference space lives under the `rig`, never under the `scene`.**
  three computes `camera.matrixWorld = parent.matrixWorld * poseInRefSpace`. Put it in the scene
  and it drifts by `rig.position` the moment anyone stick-moves. Amber's tell was "the light in
  the kitchen is flickering" - the occluders had walked across the room.
- **The design check:** warn when the object's footprint crosses a window or door plane. That is
  a real planning answer no configurator gives, and it comes free with the labels.
- ⛔ **Never paint the room.** Planes are read, never drawn, except a green diagnostic wireframe
  behind a controller button.
- ⛔ **Coarse is the ceiling, and coarse is fine here.** Amber proved you cannot tune your way
  past a silhouette the scanner never captured. A 5 cm scan error is right for judging a cabinet
  against a wall and useless for a survey. Say that on the readout so nobody spends a round on it.

### Explicitly out of scope: occlusion

Amber spent nine rounds and landed on "the feather was never the problem, the silhouette is". A
Type Studio object stands free on the floor or flat on a wall; it does not need the room to cut
it. **Do not build occlusion for AR1.** If it is ever wanted, read
`Amber VR/memory/reference_mr_occlusion_saga.md` first and start from the verdict, not from the
top.

---

## 7. Phases

Each one is small enough to verify on its own, and each one names the thing that proves it.

| # | Phase | Proof it worked |
|---|---|---|
| **0** | **The spike** (`spike.html`, built). 30 minutes on the Quest, no Type Studio code | The readout names each granted feature, a plane count, and every plane's raw `semanticLabel` and size. A 1 m box lands on a floor hit-test and a second box lands flat on a wall plane |
| **1** | **HTTPS on the LAN** - `tools/ar-serve.js`, static host plus reverse proxy on 8444, bare address, ribbon prints the address and a QR | The Quest browser loads the page over HTTPS and `/selection` answers with the element he picked in Revit |
| **2** | **The bridge** - `wss://.../bridge`, desktop panel broadcasts its snapshot, `ar.html` renders the object at 1:1 on a floor hit-test. **View only** | His actual window standing at true size in his salon. Judged by eye, not by a vertex count |
| **3** | **One handle, one parameter** (Width). Grab, drag along the axis, clamp to the learned span, value up, vertices down | The mm in AR and the mm on the desktop panel agree to 0.00, on five releases in a row - the same bar Width had to clear on 2026-08-04 |
| **4** | **Every spatial handle** - all controls with an axis and a defining face, excluded ones routed to the wrist panel | The handle set in AR equals `facesFor` on the desktop, control for control, and the two excluded verdicts produce no handle |
| **5** | **The drag goes local** - lazily ship `learned[name]` for the moving meshes only; `applyLearned` runs in the headset | Measured ms/step in AR, and a 1 mm agreement check against Revit on every release |
| **6** | **The wrist panel** - authored sections in the author's order, materials, nested type slots, the locked section | Every control reachable on the desktop is reachable in AR. A nested type swap really rebuilds the object, or refuses cleanly |
| **7** | **Wall snap** - semantic label match, flat placement, anchors, plus the window/door crossing warning | A cabinet hangs flat on his real wall and does not drift over a minute of walking. A run pushed across a window says so |
| **8** | **Create type from AR** - two step, confirm screen, Revit's answer surfaced in the headset | A new type appears in his project, made without taking the headset off. A deliberately impossible value produces a readable refusal in AR |
| **9** | **The entry** - ribbon button, QR, short address, nothing new underneath | He picks an element in Revit, puts the headset on, and is standing next to it. No typing |

Handles are phases 3 to 5 and they come before the wrist panel on purpose: they are the demo and
they are the harder unknown.

---

## 8. Risks, each with a mitigation

| # | Risk | Mitigation |
|---|---|---|
| **1** | **A stale room scan looks exactly like a code bug.** The Quest never re-scans itself; WebXR serves whatever Space Setup last stored. On Amber this went unasked through nine rounds | The question is a banner on the page and the first line of the in-VR readout, in `spike.html` already. Before debugging any wall behaviour, ask when he last scanned. A green wireframe of the scan on a controller button lets him compare scan against room in one look |
| **2** | **Two drivers on a single-threaded Revit.** The routes server serves one connection at a time; the panel already starves itself when anything else polls | The headset never talks to Revit. It is a peripheral of the desktop panel, which keeps its existing one-in-flight chain. The HTTPS proxy also serialises, as a belt on the braces |
| **3** | **A silent throw that kills one thing while the page keeps running.** This project's most expensive bug shape - three headset trips lost on Amber to `getReferenceSpaceType`, which r160 does not have | The bundled three is **r160**, confirmed. ⛔ Grep the bundled `three.min.js` before calling any XR API. Every page traps `error` and `unhandledrejection` straight onto the in-VR readout (already in `spike.html`). No diagnostic may live in the DOM only |
| 4 | Payload size: every learned field for every control is far too big to ship on connect | Ship the base geometry once; ship a field lazily on first grab, for the moving meshes only, as binary Float32 |
| 5 | Dragging past the learned span produces a confidently wrong shape | Hard clamp to `guard`, haptic tick at the ends, and the readout names the end. No extrapolation, ever |
| 6 | A partial field draws a shape that is 160 mm wrong (measured, after a window type swap) | Keep the existing refusal. A partial field is kept for the highlight and refused for drawing; fall back to Revit until the re-measure lands |
| 7 | A structure change (nested type, count) invalidates every field and every mesh index at once | Keep `showState`'s all-or-nothing rule, and re-send the snapshot on `onStructureChanged` rather than patching the headset's copy |
| 8 | Self-signed cert friction on the Quest, plus a port fight with the VR Tour App's 8443 | Port 8444. Accept the cert once. The ribbon prints a QR so he never types an address |
| 9 | Mixed content: an HTTPS page cannot reach `http://127.0.0.1:48884` | Same-origin reverse proxy. This is the whole reason `ar-serve.js` exists rather than just a static host |
| 10 | Reference-space poses placed under `scene` drift on locomotion | Everything posed from XR goes under the `rig`. Written into `spike.html` as the pattern to copy |
| 11 | A commit fires from AR while the active Revit document is not the one he thinks | Check `/selection` before offering Create, and refuse rather than guess. Two documents open already cost ten minutes once |
| 12 | Drift between two copies of the shape code in two pages | Lift the `--8<-- highlight-model --8<--` block into one shared `lib-shape.js` with its node tests, and never copy-paste it again |
| 13 | Positioning drift: Type Studio is "a day to day office job made easier", not a meeting product | This demo is client-facing on purpose - "show the client the type you just made". Frame it that way in anything written about it, or the office tool turns into a demo toy |
| 14 | The occlusion rabbit hole re-opens | It is out of scope, in writing, in section 6, with the reason and the memory to read first |

---

## Files

    spike.html      the phase 0 test page, self-contained, three.min.js beside it
    three.min.js    copied from oYmer.extension/panel/ (three r160, the same build the panel uses)

Planned, not written:

    tools/ar-serve.js      HTTPS static host + reverse proxy + wss bridge, port 8444
    panel/ar.html          the AR page
    panel/ar-ui.js         makePanel and the launcher, lifted from wm-core.js / wm-menu.js
    panel/ar-handles.js    handles, gain from drives[], clamp to guard
    panel/lib-shape.js     the extracted --8<-- highlight-model --8<-- block, shared by both pages
