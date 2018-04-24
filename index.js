var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 300000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//
// function addLine(verts, mat) {
//   let verts32 = new Float32Array(verts);
//   let geom = new THREE.BufferGeometry();
//   geom.addAttribute('position', new THREE.BufferAttribute(verts32, 3));
//   let newGeom = new THREE.Line(geom, mat)
//   scene.add(newGeom)
// }

//add grid to scene
let grid = new Grid()
// console.log( grid.getGrid() )
let gridLines = grid.getGrid()

for(line of gridLines) {
  scene.add(line)
}
//direction, gridCellX, gridCellY, edge
// let road1 = new Road("right", -10, 7)
// scene.add(road1.getRoad())
// let road2 = new Road("right", -10, 0)
// scene.add(road2.getRoad())
// let road3 = new Road("right", -10, -7)
// scene.add(road3.getRoad())
//
// let road4 = new Road("left", 10, 7)
// scene.add(road4.getRoad())
// let road5 = new Road("left", 10, 0)
// scene.add(road5.getRoad())
// let road6 = new Road("left", 10, -7)
// scene.add(road6.getRoad())
//
// let road7 = new Road("right", -7, -10)
// scene.add(road7.getRoad())
// let road8 = new Road("left", -0, -10)
// scene.add(road8.getRoad())

let road9 = new Road("left", 7, -10)
scene.add(road9.getRoad())


//  build grid (80x80) array to help track transitions in hw network
//  store highway segment directions as:
//  vertical segment    (right edge): 0
//  horizontal segment  (bottom edge): 1
//  45  degree segment: 2
//  135 degree segment: 3
// console.log("road9.verts",road9.verts)
let testVertsRoad1 = [
  -20,-40,0,
  -20,-20,0,
  -20,0,0,
  0,20,0,
  20,40,0
]
let testVertsRoad2 = [
  40,-40,0,
  20,-20,0,
  0,0,0,
  -20,20,0,
  -40,40,0
]
let testVertsRoad3 = [
  0,-40,0,
  -20,-20,0,
  -20,0,0,
  0,20,0,
  20,20,0,
  40,20,0
]
let testVertsRoad4 = [
  40,-40,0,
  20,-20,0,
  20,0,0,
  0,20,0,
  0,40,0
]

let testVertsRoad01 = [
  0,-40,0,
  0,-20,0,
  0,0,0,
  0,20,0,
  0,40,0
]
let testVertsRoad02 = [
  -40,0,0,
  -20,0,0,
  0,0,0,
  20,0,0,
  40,0,0
]
let testVertsRoad03 = [
  -40,-40,0,
  -20,-20,0,
  0,0,0,
  20,20,0,
  40,40,0
]

let testVertsRoad04 = [
  40,-40,0,
  20,-20,0,
  0,0,0,
  -20,20,0,
  -40,40,0
]


// grid.addRoad(road9.verts)

scene.add(road9.getRoad(testVertsRoad01))
scene.add(road9.getRoad(testVertsRoad02))
grid.addRoad(testVertsRoad01)
grid.addRoad(testVertsRoad02)
let gridMap = grid.testMap

console.log(gridMap)

grid.testPlotTiles(gridMap)

let deg = 0.0174533

camera.position.x = 0;
camera.position.y = 0; // -52000 / 2; //-104000;
camera.position.z = 150;
camera.rotateX(deg * 0)

// camera.position.x = 0;
// camera.position.y = 0; // -52000 / 2; //-104000;
// camera.position.z = 2000;
// camera.rotateX(deg * 90)

function animate() {
  requestAnimationFrame(animate);
  // cube.rotation.x += 0.01; cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

//invoke scene render
animate();
