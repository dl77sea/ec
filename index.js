/*todo: put most of this in Scene*/

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 300000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//geomTile buffer to hold tile geomTile (tile + roads + street grids)
var geomTile = new THREE.BufferGeometry();

//vertices for tile (20x20 miles) (todo: move this to Tile)
var vertsTile = new Float32Array([
  -52000.0, -52000.0, 1.0,
  52000.0, -52000.0, 1.0,
  52000.0, 52000.0, 1.0,
  -52000.0, 52000.0, 1.0,
  -52000.0, -52000.0, 1.0
]);

var vertsGrid32 = new Float32Array([
  -52000.0, -0, 1.0,
  52000.0, 0, 1.0,
  ]);


// add tile vertices to geomTile buffer (this buffer (geomTile) will be consumed by THREE.Line
// so that it can be added as a line to the 3js Three.Scene object (scene))
geomTile.addAttribute('position', new THREE.BufferAttribute(vertsTile, 3));

// road matRoad
var matRoad = new THREE.LineBasicMaterial({
  color: 0x00ffff,
  linewidth: 3
  // linecap: 'round', //ignored by WebGLRenderer
  // linejoin:  'round' //ignored by WebGLRenderer
});

//feed the tile geometry, as a line, to the 3js scen object
var lineTile = new THREE.Line(geomTile, matRoad);
scene.add(lineTile)

//test: build road here
let spawnSeg = { startPt: {x: -52000, y: -52000, z: 0}, endPt: {x: 52000, y: -52000, z: 0} }
let road = new Road(spawnSeg)

let segs = 1500
let newRoadSeg


for (let i = 0; i < segs; i++) {
  newRoadSeg = road.getNewRoadSeg()
  road.addSeg(newRoadSeg)
}

let i=250

console.log(road.vertsRoad[i*3+0])
console.log(road.vertsRoad[i*3+1])
console.log(road.vertsRoad[i*3+2])
console.log(road.vertsRoad[i*3+3])
console.log(road.vertsRoad[i*3+4])
console.log(road.vertsRoad[i*3+5])

spawnSeg2 = {
	startPt:
		{x: road.vertsRoad[i*3+0], y: road.vertsRoad[i*3+1], z: 0},
	endPt:
		{x: road.vertsRoad[i*3+3], y: road.vertsRoad[i*3+4], z: 0}
}

let roadTwo = new Road(spawnSeg2, 90, false)


for (let i = 0; i < segs; i++) {
  newRoadSeg = roadTwo.getNewRoadSeg()
  roadTwo.addSeg(newRoadSeg)
}


let vertsRoad = road.getRoad()
let vertsRoadTwo = roadTwo.getRoad()

//put road verts in a typed array for 3js to consume
let vertsRoad32 = new Float32Array(vertsRoad);
let vertsRoad32roadTwo = new Float32Array(vertsRoadTwo);
console.log(":::",vertsRoad)
console.log(":::",vertsRoadTwo)

//road
var geomRoad = new THREE.BufferGeometry();
geomRoad.addAttribute('position', new THREE.BufferAttribute(vertsRoad32, 3));
let lineRoad = new THREE.Line(geomRoad, matRoad)
scene.add(lineRoad)

//road 2
var geomRoadTwo = new THREE.BufferGeometry();
geomRoadTwo.addAttribute('position', new THREE.BufferAttribute(vertsRoad32roadTwo, 3));
let lineRoadTwo = new THREE.Line(geomRoadTwo, matRoad)
scene.add(lineRoadTwo)

var geomGrid = new THREE.BufferGeometry();
geomGrid.addAttribute('position', new THREE.BufferAttribute(vertsGrid32, 3));
let lineGrid = new THREE.Line(geomGrid, matRoad)
scene.add(lineGrid)


//establish camera location and camera target
let deg = 0.0174533

camera.position.x = 50000;
camera.position.y = 0; // -52000 / 2; //-104000;
camera.position.z = 150000;

camera.rotateX(deg * 0)

function animate() {
  requestAnimationFrame(animate);
  // cube.rotation.x += 0.01; cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

//invoke scene render
animate();
