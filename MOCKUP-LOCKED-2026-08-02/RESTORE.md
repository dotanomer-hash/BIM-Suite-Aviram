# SUITE MOCKUP - LOCKED 2026-08-02

Omer: *"still a lot of fixes but in general is good"* - **this is the winning direction.**
Pinned so a new session starts from here instead of re-deriving it. Do NOT edit inside this
folder - work on the live copies in `omerdotan-site/` and re-pin when he approves again.

## Open it
Server already exists in `.claude/launch.json` as **`omerdotan-site`** (port 8099).
Start it with `preview_start` (never Bash), then:

    http://localhost:8099/all-mockup.html      <- the entry: menu + every page in one scroll

Individual pages: `familycreator-mockup.html` `typestudio-mockup.html` `viewer-mockup.html`
`decisionmaker-mockup.html` `vrtours-mockup.html` `bimsuite-mockup.html` `Lab3D.html`
`RevitFamilies.html`

## The design, in one line
**Paired windows with an electric arrow between them.** Two dark chamfered panels - the thing in
Revit on one side, the same thing in the lab/viewer on the other - joined by an orange plasma arc
that strikes a wall and sparks. It came out of the 3D Lab page and Omer approved it there first.

- `oymer-pairs.css` is the ONE source for the component. Change the arrow there and every page
  follows. Wrap a block in `.oylp`, then `.oyl-pairs > .oyl-pair > (panel, .oyl-flow, panel)`.
- `.oyl-pairs--rev` flips a row so the lab object sits on the right and Revit on the left.
- `.oyl-stack` + `.oyl-down` is the one-column variant (arrow rotated 90deg) used by DecisionMaker.

## What each page holds
| Page | Layout | Media |
|---|---|---|
| **Family Generator** | 3 pairs | all real: kitchen (Omer's Revit recording ↔ lab), desk, barrier |
| **Type Studio** | 3 pairs | desk pair real; door + window pairs are marked placeholders |
| **Viewer** | 3 pairs: View model · View Family (the cabinet) · Apply materials | stand-ins from existing clips |
| **DecisionMaker** | ONE column, 3 windows, current running downward | export model → decide in VR 1:1 → write back |
| **VR Tours** | as it was + "AI Design Inside VR" block | `media/lab/ai-reel.mp4`, fitted `contain` (its captions run edge to edge) |
| **3D Lab** | 3 pairs - wand, AI, hotspots | real, except the wand-in-tour tile (stand-in) |
| **Revit Families** | 3 pairs - kitchen, desk, barrier | real |

## Decisions already taken - don't re-litigate
- The suite hub section (four product windows) is the REFERENCE design and was deliberately NOT
  converted to pairs. The product pages keep the blueprint background plus their per-product hue
  (`.c1` orange DecisionMaker, `.c2` violet Viewer, `.c3` azure Family, `.c4` teal Type Studio).
  Omer was asked whether to drop the hue; unanswered as of the pin.
- The 3D Lab page was split into two: `Lab3D.html` (VR objects) and `RevitFamilies.html`
  (kitchen/desk/barrier), cross-linked.
- No fifth card was added to "המוצרים שלנו" - the product-line restructure is live in another session.
- Lab clips are ping-pong loops (forward then back) so they never jump at the seam.

## Still open
- Omer's own words: "still a lot of fixes" - he has NOT listed them yet. Ask.
- Wand-in-tour tile: waiting on a headset recording (nothing in the project shows the wand in a tour).
- Type Studio: two placeholder pairs need real captures.
- Viewer: all three pairs are stand-ins.
- Nothing here is published - local only.

## Rebuilding a lab clip
Use the **`oymer-lab-clip`** skill. It carries the capture harness (drive the lab's own sliders,
composite its panel into the frame, ping-pong the loop) and the trap list.
