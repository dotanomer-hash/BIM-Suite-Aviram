// white-model/catalog/objects/tv-01.js
// Wall TV / flat panel. Origin at CENTER, screen faces +Z, natural ~50" (1.11 x 0.65 x 0.055 m).
// Designed for FIT-TO-BBOX swap: the swapper scales this to the replaced Revit element's real size,
// so a 50" and a 65" both come out right. White frame (bezel) + recessed glossy black screen.
window.WMOBJ_tv01 = function (THREE) {
  var g = new THREE.Group();
  var W = 1.11, H = 0.65, D = 0.055, bez = 0.028;
  var frameMat = new THREE.MeshStandardMaterial({ color: 0xeaeaee, roughness: 0.35, metalness: 0.2 });
  var screenMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0d, roughness: 0.12, metalness: 0.5 });

  var body = new THREE.Mesh(new THREE.BoxGeometry(W, H, D), frameMat);   // white bezel body
  g.add(body);

  // screen on BOTH faces so it reads right whichever way the swap orients it (the wall-side is hidden)
  [D / 2 - 0.001, -(D / 2 - 0.001)].forEach(function (z) {
    var screen = new THREE.Mesh(new THREE.BoxGeometry(W - 2 * bez, H - 2 * bez, 0.006), screenMat);
    screen.position.z = z; g.add(screen);
  });
  return g;
};
