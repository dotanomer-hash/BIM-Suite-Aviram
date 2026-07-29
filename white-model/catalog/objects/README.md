# Adding an object from a photo (the standing workflow)

1. From the photo + typical dimensions, fix real-world sizes (chair seat ≈ 0.45 m, table ≈ 0.75 m,
   sofa seat ≈ 0.42 m…). Ask Omer only if the object is unusual.
2. Copy `chair-01.js` as `objects/<id>.js`; model with primitives (Box/Cylinder/Lathe/Extrude +
   MeshStandardMaterial). Origin at floor-center, front = +Z, real meters. One `window.WMOBJ_<camelId>` function.
3. Preview in the foundry lab (`Media Assets/object-foundry.html`) next to the 1.70 m silhouette;
   dial proportions until it matches the photo.
4. Append one entry to `objects.json` (id, Hebrew+English names, kind:"builder", src, global,
   footprint [w,d], height, optional revit family mapping).
5. Run `node --test white-model/test/objects-catalog.test.js` (once U-tests exist). Done — the viewer
   picks it up at runtime, no rebuild. Downloaded GLB assets instead: put the .glb in objects/,
   entry kind:"glb", file:"objects/x.glb" (served mode only).

In the viewer (Objects tool): pick a catalog item → ghost follows the floor → trigger places it.
Click a placed object to SELECT it; with a selection, picking another catalog item **SWAPS** the
object in place (sofa instead of chair), and ⟲/⟳/✋/🗑 rotate, move, or remove it.
