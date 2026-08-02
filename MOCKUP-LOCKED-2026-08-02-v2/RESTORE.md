# SUITE MOCKUP + REAL MENU - LOCKED 2026-08-02 (v2)

Omer: **"good. pin and remember"** - after the products menu was wired into the real header.
Supersedes `MOCKUP-LOCKED-2026-08-02/` (that pin was the pairs direction, before the menu).
Do NOT edit inside this folder - work on the live copies in `omerdotan-site/` and re-pin
when he approves again.

## ⛔ THE RULE THAT COST THIS SESSION AN HOUR
**The mockup is LOCAL ONLY. The git site is not touched until Omer says "replace".**
Omer, verbatim: *"i need a mock-up to be save localy! not the git site yet until i say replace"*.

Concretely: the only tracked file that may be dirty is `Lab3D.html` (already dirty from an
earlier session). Everything else the mockup needs is an untracked `*-mockup.*` file.
Check with `git status --porcelain | grep '^ M'` - if anything but `Lab3D.html` shows up,
something leaked into the site.

## ⛔ THE MENU ALREADY EXISTS - DO NOT BUILD ANOTHER ONE
Two scripts, in this order, and BOTH are needed:

| file | role | tracked? |
|---|---|---|
| `oymer.js` | the site's real menu engine - builds **both** header dropdowns (השירותים שלנו + המוצרים שלנו), the mobile hamburger menu, current-page highlighting, FAQ accordion, reveal animations | yes - **site file, do not edit for mockup work** |
| `menu-preview.js` | MOCKUP ONLY. Polls until `oymer.js` has built the dropdown, then rewrites the **products** one (desktop + mobile) to the approved design and points it at the `*-mockup` pages | no |

`oymer.js` also has its own `OYMER_PRODUCTS` flat list - it is a **dead path for the mockup**,
because `menu-preview.js` runs after it and replaces the panel wholesale. Patching it does
nothing visible. Edit `menu-preview.js`.

## Open it
Server is `omerdotan-site` in `.claude/launch.json` (port 8099). Start with `preview_start`.

    http://localhost:8099/all-mockup.html        <- menu + all 8 pages in one scroll
    http://localhost:8099/bimsuite-mockup.html   <- the suite page, click the menu from here

Pages: `bimsuite-mockup` `decisionmaker-mockup` `viewer-mockup` `familycreator-mockup`
`typestudio-mockup` `vrtours-mockup` `lab-mockup` `revitfamilies-mockup` + `menu-mockup`
(the menu spec card) and `menupreview` (the menu inside the real header).

`lab-mockup.html` / `revitfamilies-mockup.html` are copies of `Lab3D.html` /
`RevitFamilies.html`, made so the lab pages join the mockup **without** editing site files.

## The products menu, as approved
- The four suite products sit in **one muted-purple block** (`rgba(139,108,240,.13)` →
  `.05`, violet hairline border). The block reads as one unit.
- The block runs **LTR** - the names are English even though the menu is Hebrew. The indent
  guide-line moved to the **left** with the text. Tours and Labs are LTR too.
- **`oYmer` is the brand prefix**: `max(11.5px,.68em)` - the .68 proportion comes from the
  suite hero title, the 11.5px floor is because .68em of a 14px row is unreadable.
- Orange **Y** (`#ff7a00`), steady - no flash, no tilt.
- **©** trails every product name **on the right**, superscript.
- ⛔ No ⭐ on DecisionMaker, no `בפיתוח` pill on Type Studio - Omer removed both.

## Page rules earned this session
| rule | why |
|---|---|
| Every product hero is **465px**, `height` not `min-height`, above 641px wide | with `min-height` the hero grew on FIRST load and only settled on return - the fallback font is wider than Rubik, the title wrapped to two lines. A fixed height + `overflow:hidden` makes font-swap unable to move the box. |
| VR Tours + 3D Lab heroes stay their own size | Omer excluded them explicitly |
| `.oyc` (the ©) and `.oy` (the prefix) are duplicated **inline** in `vrtours-mockup`, `Lab3D`, `RevitFamilies`, `all-mockup` | an inline `<style>` beats the linked `bimsuite-mockup.css`, so a change to the shared file silently does nothing on those four. Change all five. |
| VR Tours page is ONE dark band | `.oymer-band` wraps hero + AI + the last section; all three are `background:transparent` so a single gradient runs the whole page with no seam |
| `all-mockup.html` inlines its own copies | product pages do NOT propagate into it - edit both |

## Still open
- Omer has not eyeballed the menu in a browser yet - only the measurements are verified.
- The `menu-mockup.html` spec table still points 4 rows at the OLD live pages
  (`BIMViewer.html`, `VRTours.html`, `Lab3D.html`, "מתוך תוכן ה-Lab"). Only the
  BIM VR Suite row was corrected.
- Nothing published. `omerdotan.com` is whatever was last pushed.
