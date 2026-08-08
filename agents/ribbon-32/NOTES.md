# oYmer Revit ribbon icons - round 3. Verdict and recommendation.

Preview: `index.html` in this folder (open it directly, or serve the folder).
Nothing in `oYmer.extension` was modified. Nothing in the website repo was touched. No git was run.

---

## VERDICT

> **Yes - but narrowly, and only for one of the three.**
>
> **C-chip beats the shipping four at 32 px.** The margin is real and measured, and it is modest:
> an upgrade, not a transformation. At 16 px the margin is large, because the shipping set has no
> 16 px artwork at all.
>
> **A-bleed also beats them on legibility** and is the bigger jump, but it trades away the thing
> the shipping set does best.
>
> **B-plate loses. Do not ship it.**
>
> If the answer has to be one line: **ship C-chip.** If C-chip does not visibly excite you when you
> look at section 1 of the preview page, then leave the existing four alone - the gap is not big
> enough to justify a change nobody asked for.

---

## How this was judged

Every claim below comes from looking at a real raster, not a vector.

- Each design was drawn in a 32-unit coordinate space on a 512 px master and downsampled with
  LANCZOS to a **true 32x32 and a true 16x16 PNG**, transparent background.
- The 16 px files are **separately drawn simplified variants**, not shrinks of the 32. Weights are
  snapped so edges land on whole pixels at 16.
- Those rasters were then blown up 8x (32 px) and 12x (16 px) with nearest-neighbour and laid
  beside the four shipping icons at identical magnification on identical `#e8e8e8`, and again on
  Revit's dark theme `#3c3c3c`. Contact sheets: `_sheet_32_at_8x.png`, `_sheet_32_dark_at_8x.png`,
  `_sheet_16_at_12x.png`.
- Three drawings were changed *because* of what the raster showed, not before it:
  the knockout eye closed to a ring at 16 px, the knockout cube's 1 px face gaps broke into petals,
  and the plate glyphs were soft until they were drawn at scale instead of rescaled as pixels.

## What round 1 and round 2 got wrong, and what changed

Round 1 was flat tiles with a letter - a UI chip, not a graphic. Round 2 was isometric scenes -
too much drawing for 32 px. Both also produced **no PNGs at all**, only SVG, so neither was ever
actually judged at the size it was meant for. That is the single biggest change here: everything
in this folder is a real file at the real size.

## The three candidates

| | Name | What it is | 32 px | 16 px |
|---|---|---|---|---|
| A | **Bleed** | No container. The glyph is the whole 32 px box, in the product hue, two flat values plus a 1 px cast edge. | Passes, boldest | Passes, sharpest |
| B | **Plate** | Near-black plum chamfered plate, cyan hairline on the top edge, hue glyph inside. | Passes, weakest | Type Studio fails |
| C | **Chip** | Product-hue chamfered chip, one lit top edge, one dark bottom band, white glyph knocked out at 75% of the box. | Passes, best | Passes |

Glyphs, one clear idea each: **check** (approve), **eye** (view), **cube** (a family/object),
**window** (Type Studio's actual first family - it replaces the shipping set's meaningless 2x2 grid).
No Autodesk or Revit logo, wordmark, or colour is used anywhere.

### C - Chip. Recommended.

It keeps the shipping set's own mechanism, which is the right mechanism: **a saturated hue block
with a white glyph knocked out of it.** What it changes:

1. **The glyph gets about 40% more area** - 24 of 32 units instead of roughly 16. That is the whole
   legibility gain, and it is visible in the 8x sheet.
2. **Flat instead of glossy.** The bevel-and-highlight look dates the set to about 2010. Flat fill
   plus white knockout is also **already the language of his own oYmer tab** - all 14 buttons there
   are flat orange circles with white glyphs. So C unifies the extension; it does not add a third
   style to it.
3. **The suite chamfer instead of the rounded corner**, so the ribbon and the website speak the
   same shape.
4. **Type Studio finally means something.** A 2x2 grid is a table icon. A window with a mullion and
   a dimension underline is the product.

Costs, stated plainly:

- It does **not** fix the shipping set's real structural weakness: all four still share one
  identical square silhouette, so hue is still doing all the work of telling them apart. Only A
  fixes that.
- The cube has to be shaded in three whites rather than separated by knockout gaps, because 1 px
  gaps break into petals at 16 px. It is therefore the softest of the four glyphs.
- **Nobody will notice it on day one.** It is a quiet improvement.

### A - Bleed. The real alternative, if you want a bigger jump.

Biggest glyph of the three, four genuinely different silhouettes (diagonal, lens, hexagon, square),
sharpest at 16 px, and it looks native inside Revit because containerless is what Autodesk's own
ribbon does. What it costs: the four stop reading as one product family, there is no coloured block
for the eye to land on in a crowded ribbon, and it is the odd language out inside his own extension.

**This is a taste call, not a legibility call.** A is better at "which button is which". C is better
at "these four are one suite and they belong to oYmer".

### B - Plate. Tested and rejected.

Kept in the folder as evidence. Four dark plates in a row read as four identical dark blobs - the
hue is demoted to a small glyph inside, which destroys exactly the colour recognition the current
set gets right. The plate also eats the glyph, so the drawing ends up no bigger than what ships
today: all of the cost, none of the gain. On Revit's dark theme the plum plate sits close to
`#3c3c3c` and the shape softens. Type Studio at 16 px is the worst cell on the whole page.

---

## The honest caveat that should decide this

**The 16 px argument may not apply to him.** The Suite panel's `bundle.yaml` lists four buttons in
one panel, which pyRevit renders as large 32 px buttons. If those buttons are never shown small,
the large 16 px win is theoretical and the decision rests entirely on the 32 px margin - which is
modest. Check the ribbon at a narrow window width before treating the 16 px column as a reason.

Two other things found while measuring, neither in scope here:

- Four icons on the **oYmer tab** are **192x192**, not 32x32: `AnalyzeGroups`, `ColorGroups`,
  `IsolateAnnotations`, `SuggestGroups`. Revit downscales them at draw time, so they render softer
  than their 32 px neighbours. That is a bigger visible defect than anything in the Suite panel.
- The extension names every icon **`icon.png.png`**, not `icon.png`. Whatever ships, match that
  name exactly - do not "fix" it without testing, since the whole ribbon currently depends on it.

---

## Files

```
agent-ribbon32/
  index.html                     the preview page - true size, 8x, 12x, light and dark
  make_icons.py                  the generator; re-run it to change any weight
  A-bleed/    <Product>_32.png   <Product>_16.png     x4 products
  B-plate/    <Product>_32.png   <Product>_16.png     x4 products
  C-chip/     <Product>_32.png   <Product>_16.png     x4 products
  existing/                      untouched copies of the four shipping icons, plus their
                                 32->16 downscale, which is what Revit shows small today
  _sheet_32_at_8x.png            all four rows, 32 px at 8x, on ribbon grey
  _sheet_32_dark_at_8x.png       the same on Revit dark
  _sheet_16_at_12x.png           all four rows, 16 px at 12x
  _general_panel_at_6x.png       his oYmer tab's existing 14 icons, for language reference
```

Products are `DecisionMaker`, `BIMViewer`, `FamilyCreator`, `TypeStudio` - the same folder names as
the pushbuttons.

### To install (only if he says yes)

Back up the four current files first, then for each product copy
`C-chip/<Product>_32.png` over
`...\oYmer.extension\BIMVR.tab\Suite.panel\<Product>.pushbutton\icon.png.png`
and reload pyRevit. The 16 px files have nowhere to go under the current naming and are for
judging only unless small buttons are actually used.
