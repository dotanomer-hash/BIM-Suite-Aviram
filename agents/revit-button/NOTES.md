# M5 - "works inside Revit" mark. Recommendation.

Compare page: `index.html` (open it, or serve the folder and hit `/index.html`).

Nothing in `omerdotan-site` was read-write touched. This folder is the whole deliverable.

## The three options

| | Name | Idea | 22px |
|---|---|---|---|
| A | **Ribbon Seat** | Our orange tile seated in a generic toolbar row between two grey ghost neighbours, with an active-tab underline. Says "this button lives in someone else's ribbon" by drawing the ribbon, not their brand. | **Partial.** Shape survives, meaning does not. |
| B | **Foam Tile** | The SimLab move: one chamfered near-black app-tile, orange oYmer Y, cyan hairline, orange cut edge. One glyph, nothing else. | **Passes.** |
| C | **Seat and Caption** | Tile plus a two-line mono lockup baked into the SVG, `textLength`-pinned so the box cannot be blown out by an unknown mono. | **Fails.** Tile reads, the type renders at ~7px and ~4.5px. |

## Recommendation: B, Foam Tile - with the caption as HTML, not baked in

Reasoning, in the order that decided it:

1. **22px is the brief, and only B survives it.** A's whole idea is the neighbours, and the
   neighbours are the first thing to die below ~34px; what is left is an orange smudge between two
   grey nubs, which reads as dirt. C's big line lands at about 7px. B has exactly one glyph, so
   there is nothing in it that can degrade - it just gets smaller.
2. **C is the right message with the wrong delivery.** The information C adds is the useful half
   ("Revit"), so take it - but put it in real HTML text next to the tile instead of inside the SVG.
   Then it scales with the page's own type ramp, it is selectable and translatable, it flips
   correctly in the RTL page, screen readers get it for free, and it can be dropped entirely at
   sizes where it would not fit. That is B plus C's payload with none of C's failure mode.
3. **Trademark exposure drops to zero in the graphic.** With the word in HTML, the SVG contains no
   text at all. The word "Revit" in body copy is ordinary nominative use, the same as everywhere
   else on the site, and it is now trivially swappable to Hebrew ("פועל בתוך רויט") or to a
   brand-free phrasing without touching the asset.
4. **It matches the suite's own language without being a screenshot.** 22px chamfer (the exact
   `clip-path` polygon from `oymer-pairs.css`), cyan hairline `rgba(2,242,255,.55)`, `#ff7a00`
   accents, near-black plum fill. The old `dm-button.png` was a photograph of a UI; this is drawn
   in the site's own vocabulary, so it sits under a suite window instead of on top of one.
5. **It survives both grounds because each ground is carried by a different part of the drawing.**
   On `#f7f5fb` the cyan hairline is almost invisible and the near-black fill carries the shape. On
   `#0b0913` the fill nearly matches the ground and the hairline carries it. That is why the fill is
   `#141024` and not the panel's own `#0b0913` - flush would disappear. One asset, no light/dark
   variant needed.

### Honest caveats on the winner

- The per-product hue wash is set at 10%. It is a **whisper** - the four tinted tiles in the compare
  page are nearly identical. That is deliberate (one mark, four windows). If you want the hue to
  actually read, change the hairline to `rgb(var(--c))` and lose the suite cyan.
- The wash is orange-over-plum. `oymer-pairs.css` already warns that DecisionMaker orange over a
  navy mixes to brown; over `#141024` at 10% it is fine, but do not push it past ~14% or the tile
  goes warm-brown.
- The cyan hairline is 2.6/64, so it scales: 0.9px at 22px, 3.9px at 96px. At 96px it reads as a
  deliberate neon edge. If the mark is ever used above ~120px, drop the stroke to 2.0.
- The tile is a brand glyph, not an icon of an action. It only means "Revit" because of the words
  beside it. Do not ship it caption-less.

## Paste-ready snippet

CSS, once per page (into `bimsuite-mockup.css`, and bump the `?v=` in all six HTML files per the
suite-mockup rule):

```css
/* the "works inside Revit" mark at the foot of a suite window.
   the tile picks up --c from .suite .c1-.c4; the Y stays brand orange in all four. */
.oy-revitmark{display:inline-flex;align-items:center;gap:8px;line-height:1;
  color:var(--ink);opacity:.85}
.oy-revitmark svg{display:block;flex:0 0 auto;height:22px;width:22px}
.oy-revitmark b{font-family:"Rubik","Heebo",sans-serif;font-weight:700;font-size:11.5px;
  letter-spacing:.01em;white-space:nowrap}
/* on a dark panel (.oyl-panel and friends) the ink flips; the tile needs no variant */
.oyl-panel .oy-revitmark{color:#e6ecf6;opacity:.9}
@media (max-width:560px){.oy-revitmark b{display:none}}   /* tile alone below 560 */
```

HTML, at the bottom of each suite window:

```html
<span class="oy-revitmark">
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" focusable="false">
    <path d="M15.5 1.5H62.5V48.5L48.5 62.5H1.5V15.5Z" style="fill:#141024"/>
    <path d="M15.5 1.5H62.5V48.5L48.5 62.5H1.5V15.5Z" style="fill:rgb(var(--c,255,122,0));opacity:.10"/>
    <path d="M17 3.4H61" style="stroke:#ffffff;stroke-width:2;opacity:.10"/>
    <path d="M15.5 1.5H62.5V48.5L48.5 62.5H1.5V15.5Z" style="fill:none;stroke:rgba(2,242,255,.55);stroke-width:2.6"/>
    <path d="M16 15L32 35M48 15L32 35M32 35V50" style="fill:none;stroke:#ff7a00;stroke-width:9;stroke-linecap:round;stroke-linejoin:round"/>
    <path d="M60.6 48.9L48.9 60.6" style="stroke:#ff7a00;stroke-width:3;stroke-linecap:round"/>
  </svg>
  <b>פועל בתוך Revit</b>
</span>
```

(Swap `<b>` for `Works inside Revit` on any LTR surface. `aria-hidden` on the SVG is correct here
because the `<b>` already carries the meaning to a screen reader - do not label both.)

## Traps if you wire this up

- ⛔ **`var()` does not work in an SVG presentation attribute.** Every paint above is written as
  `style=""` for that reason. `fill="rgb(var(--c))"` silently renders black.
- ⛔ **No `<defs>`, no gradients, no ids** anywhere in the mark - it is pasted once per window, and
  duplicated ids on one page collide.
- ⛔ **`--c`/`--cd` are declared on `.suite .c1-.c4` only.** A mark placed outside that subtree
  (`#morph`, a sibling `.backsuite`) falls back to the built-in `255,122,0`, which is harmless here
  but is the same trap that has bitten three times elsewhere.
- ⛔ **The suite windows live in three files** - `bimsuite.body.html`, `bimsuite.html`,
  `all-mockup.html`. Patch all three in one script and assert the replacement count, or they drift.
- The old `media/dm-button.png` is now unreferenced. Removing it is a separate call; the animated
  `.oyl-dmbtn` / `dmpress` rules in `oymer-pairs.css` were written for that image and become dead
  once it goes.
