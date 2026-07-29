// white-model/catalog/objects/sofa-01.js
// Two-seat fabric sofa. Origin at floor-center, front toward +Z, real meters (MASTER §C6).
window.WMOBJ_sofa01 = function (THREE) {
  var g = new THREE.Group();
  var fabric = new THREE.MeshStandardMaterial({ color: 0x5e6e7e, roughness: 0.95, metalness: 0 });
  var fabricDark = new THREE.MeshStandardMaterial({ color: 0x4c5a68, roughness: 0.95, metalness: 0 });
  var woodLeg = new THREE.MeshStandardMaterial({ color: 0x3d2b1a, roughness: 0.5, metalness: 0 });
  var W = 1.6, D = 0.85, baseH = 0.22, legH = 0.07, armW = 0.16;

  var base = new THREE.Mesh(new THREE.BoxGeometry(W, baseH, D), fabricDark);
  base.position.y = legH + baseH / 2; g.add(base);

  var innerW = W - 2 * armW;
  [-1, 1].forEach(function (s) {                                    // seat cushions
    var c = new THREE.Mesh(new THREE.BoxGeometry(innerW / 2 - 0.02, 0.14, D - 0.24), fabric);
    c.position.set(s * (innerW / 4), legH + baseH + 0.07, 0.05); g.add(c);
  });
  [-1, 1].forEach(function (s) {                                    // back cushions (lean back a bit)
    var b = new THREE.Mesh(new THREE.BoxGeometry(innerW / 2 - 0.02, 0.36, 0.13), fabric);
    b.position.set(s * (innerW / 4), legH + baseH + 0.30, -D / 2 + 0.14);
    b.rotation.x = -0.13; g.add(b);
  });
  var backBoard = new THREE.Mesh(new THREE.BoxGeometry(W, 0.42, 0.1), fabricDark);
  backBoard.position.set(0, legH + baseH + 0.30, -D / 2 + 0.05); g.add(backBoard);
  [-1, 1].forEach(function (s) {                                    // armrests
    var a = new THREE.Mesh(new THREE.BoxGeometry(armW, 0.32, D - 0.06), fabricDark);
    a.position.set(s * (W / 2 - armW / 2), legH + baseH + 0.16, 0); g.add(a);
  });
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (s) {       // stubby wood legs
    var leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.02, legH, 10), woodLeg);
    leg.position.set(s[0] * (W / 2 - 0.08), legH / 2, s[1] * (D / 2 - 0.08)); g.add(leg);
  });
  return g;
};
