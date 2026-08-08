# "Works inside Revit" mark - attempt 2. Recommendation.

Compare page: `index.html` in this folder. Nothing in `omerdotan-site` was touched, no git was run.

## What changed from attempt one

Attempt one was three rounded squares with a letter in them. The note it earned was right: those were UI
chips, not pictures. Every option here is a **drawn object** - isometric geometry, three lit face values, a
cast shadow, a ground plane, a wireframe half turning into a solid one. None of them is a tile, and none of
them contains a letter.

## The four options

| | Name | What it is | True 22px |
|---|---|---|---|
| A | **Foam Section** | An iso building fragment in white foam, sliced, the cut face solid orange with floor levels ruled across it (architect's section poche), one dark window void, standing on a dashed ground plane with a cast shadow. | **Survives.** Clearest of the four. |
| B | **Wall Strike** | The suite's electric bolt doing work: a violet wireframe wall with a window, a bolt landing on it out of the top-right, and the third it has already reached turned into solid lit foam. The seam glows. | **Partial.** The bolt survives, the wall is a smear. |
| C | **Half Cube** | One model cube mid-conversion: far half open BIM wireframe, near half white foam with lit and shaded faces, the front vertical edge between them a live orange bolt with a flash at the floor. | **Survives.** The hexagon and the seam hold; the wireframe does not read *as* wireframe below about 30px. |
| D | **Seated Inside** | A big hollow wireframe cage with cyan corner ticks (their model) and our small orange-outlined foam block sitting on its floor, two orange rings spreading where it landed. | **Fails.** The cage dissolves and only an orange nugget is left. |

The 22px column is measured, not estimated: each mark was rendered at a true 22/32/40 px and that raster was
blown up six times with nearest-neighbour so the real pixels could be judged. C failed that test on its first
pass and its weights were corrected (ink outline 1.8 to 2.4, violet outline 1.6 to 2.0, wireframe fills roughly
doubled, bolt 2.6 to 3.0, shadow .14 to .18). The drawing did not change, only the weights.

## Recommendation: C, Half Cube

**A is more legible at 22px and it is still not the one to ship.** Three reasons, in the order that decided it:

1. **A puts a large flat orange plane in a mark that repeats four times on one page.** That plane is roughly a
   quarter of the mark's area in `#ff7a00`. The suite page already gives each window its own hue and one of
   those hues *is* the DecisionMaker orange, so four orange planes at the four window feet fight the thing they
   are supposed to be quietly endorsing. C's orange is a 3-unit seam - an accent, not a field.
2. **At 22px A reads as a parcel.** A small box with a bright label on one side is a shipping carton before it
   is a building section. Look at it at true size on the compare page and it is hard to unsee. C's split face
   plus the bolt down the middle cannot be mistaken for a package.
3. **C is the only one that draws both halves of the sentence in one object.** Their model on the left, ours on
   the right, joined by the suite's own electric motif - the same "this connects to that" language used for
   the paired windows and the diagonal link bolt. A draws our output only; D draws a relationship but needs two
   objects to do it, which is exactly why it dies small.

B is the most on-message of all four and the least usable. If the mark ever gets a large slot on a product
page - a hero band, a deck slide, 160px and up - B is the picture to use there. It is not a 22px mark.

## Honest caveats on the winner

- **It is generic geometry.** A cube says "a model became a foam model". It only says "Revit" because of the
  words next to it. Do not ship it caption-less, same conclusion as attempt one.
- **It is the palest of the four.** On the light suite ground the shape is carried entirely by the `#241b3c`
  outline and the cast shadow. If anyone thins that outline the mark disappears on white.
- **Below about 30px the wireframe half stops reading as wireframe** and becomes just a darker half. The split
  still reads, which is why it passes, but the "BIM to foam" idea only fully lands at 40px and up.
- **The 16x16 Revit ribbon slot needs a stripped variant** - silhouette, split, bolt, no grid lines, no shadow.
  Nothing in this set survives 16px as drawn. The 32x32 large-button slot is fine.
- **It does not animate.** The suite's bolts all move; this one is deliberately still, because it is pasted at
  least four times on the hub and four animating bolts under four already-pulsing ribbons is noise.

## Paste-ready

CSS, once per page (into `bimsuite-mockup.css`, then bump the `?v=` in all six HTML files per the suite rule):

```css
/* the "works inside Revit" mark at the foot of a suite window.
   deliberately NOT tinted per product - it is one mark under four windows. */
.oy-revitmark{display:inline-flex;align-items:center;gap:9px;line-height:1;color:var(--ink);opacity:.9}
.oy-revitmark svg{display:block;flex:0 0 auto;width:24px;height:24px}
.oy-revitmark b{font-family:"Rubik","Heebo",sans-serif;font-weight:700;font-size:12.5px;
  letter-spacing:.01em;white-space:nowrap}
.oyl-panel .oy-revitmark{color:#e6ecf6}     /* dark panel: ink flips, the graphic needs no variant */
@media (max-width:560px){.oy-revitmark b{display:none}}
```

HTML, at the foot of each suite window (the SVG is `aria-hidden` because the `<b>` already carries the meaning
to a screen reader - do not label both):

```html
<span class="oy-revitmark">
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <path d="M8 48L28 40L48 48L28 56Z" style="fill:#241b3c;opacity:.18"/>
    <path d="M32 8L52 18V42L32 52L12 42V18Z" style="fill:none;stroke:rgba(2,242,255,.45);stroke-width:3.2;stroke-linejoin:round"/>
    <path d="M32 8L12 18L32 28Z" style="fill:#8b7fc0;opacity:.24"/>
    <path d="M12 18L32 28V52L12 42Z" style="fill:#8b7fc0;opacity:.18"/>
    <path d="M32 8L52 18L32 28Z" style="fill:#ffffff"/>
    <path d="M32 28L52 18V42L32 52Z" style="fill:#c0b7db"/>
    <path d="M25.3 11.3V24.7M18.7 14.7V21.3" style="fill:none;stroke:#8175b4;stroke-width:1.15"/>
    <path d="M18.7 21.3V45.3M25.3 24.7V48.7" style="fill:none;stroke:#8175b4;stroke-width:1.15"/>
    <path d="M12 26L32 36M12 34L32 44" style="fill:none;stroke:#8175b4;stroke-width:1.15"/>
    <path d="M32 8L12 18V42L32 52" style="fill:none;stroke:#7a6cae;stroke-width:2;stroke-linejoin:round"/>
    <path d="M32 8L52 18V42L32 52" style="fill:none;stroke:#241b3c;stroke-width:2.4;stroke-linejoin:round"/>
    <path d="M12 18L32 28L52 18" style="fill:none;stroke:#241b3c;stroke-width:1.5;opacity:.7"/>
    <path d="M32 8V26" style="fill:none;stroke:#241b3c;stroke-width:1.1;opacity:.45"/>
    <path d="M32 25L28.4 33L34.4 37.4L30.6 46L33.2 53" style="fill:none;stroke:#ff7a00;stroke-width:6.4;opacity:.3;stroke-linecap:round;stroke-linejoin:round"/>
    <path d="M32 25L28.4 33L34.4 37.4L30.6 46L33.2 53" style="fill:none;stroke:#ff8c1a;stroke-width:3;stroke-linecap:round;stroke-linejoin:round"/>
    <path d="M32 25L28.4 33L34.4 37.4L30.6 46L33.2 53" style="fill:none;stroke:#fff6e8;stroke-width:1;stroke-linecap:round;stroke-linejoin:round"/>
    <circle cx="33.2" cy="53" r="4.8" style="fill:none;stroke:#ff8c1a;stroke-width:1.2;opacity:.55"/>
    <circle cx="33.2" cy="53" r="2.4" style="fill:#fff6e8"/>
  </svg>
  <b>פועל בתוך Revit</b>
</span>
```

For the Revit ribbon the same file exports straight to a 32x32 PNG at 4x and downsampled, no changes.

## Traps if this gets wired up

- **`var()` does not resolve in an SVG presentation attribute.** Every paint above is a `style=""` declaration.
  This set goes further than attempt one and uses no custom properties in the SVG at all, so there is nothing
  that can silently render black - and no per-product tint to go wrong.
- **No `<defs>`, no ids, no gradients, no filters.** The depth is flat facets at three values and the glow is
  stacked strokes, so the markup can be duplicated as many times as there are windows.
- **The suite windows live in three files** - `bimsuite.body.html`, `bimsuite.html`, `all-mockup.html`. Patch all
  three in one script and assert the replacement count, or they drift.
- **Do not tint the mark with `--c`.** It would only resolve inside `.suite .c1-.c4` anyway, and one mark that
  changes colour four times is four marks.
- `media/dm-button.png` becomes unreferenced once this lands, and the `.oyl-dmbtn` / `dmpress` rules in
  `oymer-pairs.css` were written for that image. Removing either is a separate call.
