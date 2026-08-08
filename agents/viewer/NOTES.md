# oYmer Viewer - proposed page

Proposal file: `proposal.html` (same folder). Open it directly, it needs nothing.

**Nothing in `omerdotan-site` was touched.** No git was run.

---

## The one sentence

The page today shows *what the Viewer is* (one pair: Revit, arrow, VR). It never says the two
things that actually sell a free tier: **it costs nothing and it opens anywhere**, and **there is a
paid step next door**. The proposal adds those two and leaves the existing pair as the spine.

---

## Section by section

| # | Section | Status | What changes and why |
|---|---|---|---|
| 0 | Header | unchanged | Real markup stays. In the proposal it is a hand-drawn stand-in because base44.css and the remote logo cannot be inlined. |
| 1 | Hero | **changed** | Same violet `hue-c2` box, same 465px, beams still gone. The **חינם sign moves in**, above the title. |
| 2 | The pair (M13) | kept, tightened | Same one pair. Both windows become placeholders, both gain a **"same place" stamp**, and the arrow runs one way only. |
| 3 | נפתח מקישור. בכל מקום. | **new** | Three panels: Quest / browser / phone. The "free" claim is worthless if opening it is work. |
| 4 | מה יש בפנים + תנסו עכשיו | **returns** | The live BIM Viewer page's four-tick list comes back, restyled onto the suite panel, beside the demo block. |
| 5 | רואים חינם. כותבים בתשלום. | **new** | The strategic section. One pair; the right window is DecisionMaker's orange and is a link to its page. |
| 6 | Back to the suite | unchanged | - |
| 7 | Footer | unchanged | - |

### 1. Hero

The חינם sign is **not a new component**. `.oymer-free` already exists and already sits in the hero
above the title on **VR Tours** (`all-mockup.html:1492`) and on the **live BIM Viewer page**
(`BIMViewer.html:226`). Putting it on the suite Viewer page makes the free products agree with each
other. It is also the only orange on the page above the fold, which is on purpose: orange is the
suite's attention colour and free is the thing to attend to.

Sub-line: `מודל ה-BIM בתוך מציאות מדומה.` becomes `מודל ה-BIM שלכם, בתוך VR. בלי התקנה, בלי רישיון.`
Same length class, but it now carries the objection-killer instead of restating the title.

**Does it fit?** The hero is a hard 465px with `overflow:hidden` above 641px, minus 80px padding top
and bottom = 305px of content box. Measured from the stylesheet: suite tag 21.75 + 16 margin, h1
~66.6 at the 64px cap, sub 18 margin + ~28 = **~150px today**. The sign adds 62.4px of box plus its
24px margin = **~237px total**, roughly 68px of headroom left. The `rotate(-5deg)` is a transform, so
it does not reflow; it bleeds about 7px past the box corners, well inside the slack. So it fits on
paper - but see "guesses" below, I did not get eyes on it.

### 2. The pair - M13

Three changes, all small, one of them load-bearing:

1. **Both windows are placeholders now.** The current page ships a real `reel-3.mp4` beside a real
   `viewer-revit.jpg`, and they are not the same place. A convincing wrong pair is worse than an
   honest gap, because the reader believes it and the claim quietly fails. The hatched blocks say
   what is missing and what to shoot.
2. **The "same place" stamp** (`.vw-same`, new, 6 lines of CSS). The identical cyan stamp
   `DIR EL ASAD - LIVING - VP-01` sits on **both** windows, plus a caption line under the pair. The
   whole M13 point is that these are the same room from the same standing point, and a visitor
   cannot verify that by looking. So the page asserts it, in the same place, on both ends. It is
   also a discipline: the moment the two shots stop matching, the stamp is a visible lie.
3. **One arrow, one direction.** Revit out to the headset. Nothing comes back. See below.

Copy: `להיות שם - לראות, להרגיש, להחליט` becomes `אותו חלל בדיוק - פעם במסך, פעם מבפנים`. The old
head promises deciding, which is DecisionMaker's promise, not this page's. Also `HUD` chip
`STAND-IN` on the Viewer window is replaced by `NO INSTALL` + an orange `FREE`.

### 3. נפתח מקישור. בכל מקום. (new)

Straight out of the free/paid memory: *"No PC needed for a client meeting - reading standalone,
writing needs the PC"* and *"a pack is STATIC FILES; host it like the panorama tours."* That is the
Viewer's real differentiator against every desktop BIM viewer, and the page never said it.

Three `.oyl-panel` windows, no connector between them - they are alternatives, not a pipeline, and
putting a bolt between them would read as a sequence. **Icons are inline SVG, so this section costs
zero footage.**

### 4. מה יש בפנים + תנסו עכשיו (returns)

The four ticks are the live BIM Viewer page's own Hebrew, word for word
(`BIMViewer.html`, the `oymer-feat` list) - approved copy, no reason to rewrite it. I added a fifth
tick for the element-info panel, which the suite pair already shows off but the list never mentioned.

The demo block is the conversion action of a free product and is the single most valuable pixel on
this page. It is a placeholder because the hosted pack URL does not exist yet; until it does, the
button stays `בקרוב` exactly as the live page has it.

### 5. רואים חינם. כותבים בתשלום. (new - the strategic one)

This is the section the brief is really asking for. It is one pair:

- left window = the Viewer, chips `READ / WALK / PAINT PREVIEW / FREE`
- the bolt, labelled `WRITE`
- right window = **DecisionMaker, in its own orange**, with a `בתשלום` padlock chip, and the whole
  window is `<a href="suite-decisionmaker.html">`

So the paid product is literally the next window along in the same row. No pricing table, no
"upgrade", no pitch - the suite's own grammar does the work, because on every other product page a
pair means "and then this happens".

Closing line, centred: `אותה משקפת. אותו מודל. ההבדל היחיד הוא אם ההחלטה נשארת בפגישה או נכנסת לקובץ.`

**Implementation trap already accounted for:** the orange panel carries `--c` / `--cd` **inline**.
Those variables are declared on `.suite .c1-.c4`, and this panel lives inside a `c2` section, so
without the inline values it would come out violet. This is the same scoping bite recorded three
times in `.claude/rules/suite-mockup.md`.

---

## Borrowed from DecisionMaker

The paired window `.oyl-panel`, the electric connector, `oyl-id` / `oyl-hud` / `oyl-kick`, the
`phead` block, the `hue-c2` hero wash, `backsuite`. All of it via `oymer-pairs.css` as-is. **No fork
of that file** - the proposal copies it verbatim only because it must be self-contained.

## Must NOT be copied from DecisionMaker

| Do not copy | Why |
|---|---|
| `.oyl-dmflow` / `.oyl-dmbtn` - the real ribbon button as the connector | That is DecisionMaker's signature: on that page the thing joining the windows *is the click*. The Viewer never clicks anything into Revit. Reusing it would make the two pages the same page. |
| `.dm-approval` - the approval-record callout | It is the signed record, «אושר ב-1:1». A view-only product has nothing to sign. Putting a fake record on the free page cheapens the real one. |
| `.oyl-link` - the diagonal bolt between two stacked pairs | It draws the **round trip**. The Viewer is one way: out of Revit, into the headset, stop. Drawing the return would claim write-back on the free page - exactly the claim the paywall depends on us *not* making. |
| Two stacked pairs | DecisionMaker earns two because it is a loop. One pair here, deliberately. The visual difference between the pages should be "one pair vs a loop", which is the product difference. |
| Orange as the page hue | The Viewer is `c2` violet. Orange appears exactly twice: the חינם sign and the DecisionMaker window in section 5. Both times it means "the other product / the money". |

---

## Media Omer must shoot

Only **two** new shoots, plus one URL. Everything else is reuse.

### 1. `VIEW_01` - the M13 clip (blocking)
14 to 20 s silent loop, in-headset capture of the well-lit baked space, 16:10, walking slowly from
**VP-01**, with the **in-VR controls / wrist menu visible in frame the whole time**. Show looking and
element-info only - no painting, no moving a window; those belong to DecisionMaker.

### 2. `SRC_01` - the matching Revit still (blocking)
One Revit 3D-view screenshot of **the same room from VP-01**, same eye height, same heading, 16:10,
with the oYmer ribbon tab visible at the top.

> **Shooting order matters, and it is the thing that will go wrong.** Set the Revit camera first,
> write down its position and heading, then place the VR start point there and begin the clip
> looking the same way. Shot the other way round the two never match, and the section's whole claim
> dies quietly. Name both files after the viewpoint (`vp01-revit.jpg`, `vp01-vr.mp4`) so a future
> swap cannot break the pairing.

### 3. The live demo - a URL, not footage
A hosted pack address for the `כניסה למודל` button. The poster already exists
(`media/viewer/demo-poster.jpg`). **Nice to have, not blocking:** a 6 s screen recording of clicking
a plain link and landing inside the model - that clip alone proves "no install" better than the
sentence does.

### Needs nothing shot
- Section 3 icons - inline SVG.
- Section 5 left window - `VIEW_01` trimmed to 6 s.
- Section 5 right window - reuse `media/dm-revit-after.jpg`, already on the DecisionMaker page.

---

## Honest about what is a guess

- **I never saw this render.** The preview pane would only take it as a static snapshot and the
  local server was blocked, so every visual statement here is read off the stylesheets, not off a
  screen. Open it and judge it. The tag structure was checked programmatically and is clean.
- **The hero fit is arithmetic, not eyesight.** ~237px of content in a 305px box. It should sit
  comfortably, but the sign is rotated and the real page uses Rubik, which this file cannot load -
  if the title wraps to two lines with the real font the margin drops fast. This is the single most
  likely thing to need a nudge.
- **The חינם sign at that scale on a product-page hero is untested.** It was sized for the VR Tours
  hero, which is 520px and busier. On the calmer 465px suite hero it may read as too loud, and the
  fix if so is `font-size:1.7rem` (the value the mobile breakpoint already uses), not deleting it.
- **The orange window inside a violet section is a guess.** `oymer-pairs.css` says the panel base was
  made hue-neutral precisely so orange would not mix to brown, so it should hold - but orange next
  to violet in the same row is a colour judgement, and I cannot make it for you.
- **The bolt in section 5 runs rather than stopping at a lock.** I chose "the current flows, the
  destination costs" over "the current is blocked", because the brief asks for the paid step to look
  *natural*, and a stopped bolt reads as a wall. If it reads as too permissive by eye, the
  alternative is a padlock over the strike point and the dash animation paused - about 8 lines.
- **Section count.** Six content sections is roughly double today's page. If it feels long, section 4
  is the one to cut down (the ticks could fold into section 2's body text); sections 3 and 5 are the
  reason for the redesign and should not be the ones to go.
- **Copy.** The new Hebrew is short and deliberately plain. It is mine, not yours, and none of it has
  been through your ear.
