// white-model/catalog/objects/chair-01.js
// Simple dining chair. Origin at floor-center, front toward +Z, real meters (MASTER §C6).
window.WMOBJ_chair01 = function (THREE) {
  var g = new THREE.Group();
  var wood = new THREE.MeshStandardMaterial({ color: 0x8a5a2b, roughness: 0.6, metalness: 0 });
  var seatW = 0.44, seatD = 0.44, seatH = 0.45, seatT = 0.045;
  var seat = new THREE.Mesh(new THREE.BoxGeometry(seatW, seatT, seatD), wood);
  seat.position.y = seatH - seatT / 2; g.add(seat);
  var legR = 0.02;
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (s) {
    var leg = new THREE.Mesh(new THREE.CylinderGeometry(legR, legR * 0.8, seatH - seatT, 10), wood);
    leg.position.set(s[0] * (seatW / 2 - 0.04), (seatH - seatT) / 2, s[1] * (seatD / 2 - 0.04));
    g.add(leg);
  });
  var back = new THREE.Mesh(new THREE.BoxGeometry(seatW, 0.34, 0.035), wood);
  back.position.set(0, seatH + 0.21, -seatD / 2 + 0.02);      // back of the chair = -Z (front faces +Z)
  back.rotation.x = -0.08; g.add(back);
  [[-1], [1]].forEach(function (s) {
    var post = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.02, 0.36, 10), wood);
    post.position.set(s[0] * (seatW / 2 - 0.03), seatH + 0.17, -seatD / 2 + 0.02);
    post.rotation.x = -0.08; g.add(post);
  });
  return g;
};
