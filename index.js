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
let road = new Road()
// road.addSeg()
// road.addSeg()
// road.addSeg()

/*
let segmentToOrigin = this.translateSegToOrigin(startPt, endPt)
let degrees = 15

determine bend in road
let rotatedEndPt = this.determineBend(segmentToOrigin.endPt)

let rotatedEndPt = segmentToOrigin.endPt
let rotatedEndPt = this.rotateAboutOrigin(segmentToOrigin.endPt, degrees)

put endPt back into world space
rotatedEndPt is point to translate, startPt is offset by which to translate rotatedEndPt
let translatedEndPt = this.translatePtToWorld(rotatedEndPt, startPt)

add transformed end point to vertsRoad
this.vertsRoad.push(translatedEndPt.x)
this.vertsRoad.push(translatedEndPt.y)
this.vertsRoad.push(translatedEndPt.z)
*/

let segs = 1500
let newRoadSeg
let transformedRoadSeg

// for (let i = 0; i < segs; i++) {
//   newRoadSeg = road.getNewRoadSeg()
//   road.addSeg(newRoadSeg)
// }

road.vertsRoad.push(0)
road.vertsRoad.push(-52000)
road.vertsRoad.push(0)

road.vertsRoad.push(0)
road.vertsRoad.push(-51900)
road.vertsRoad.push(0)

road.vertsRoad.push(0)
road.vertsRoad.push(-51900)
road.vertsRoad.push(0)

road.vertsRoad.push(5)
road.vertsRoad.push(-51897)
road.vertsRoad.push(0)


//result of this origin translated
let newSegEndPt = road.getUnitVector({startPt: {x: 0, y: -51900, z: 0}, endPt: {x: 5, y: -51897, z: 0}})
console.log(newSegEndPt)

//rotate unit vector
let newSegEndPtRotated = road.rotateAboutOrigin({x: newSegEndPt.x, y: newSegEndPt.y, z: 0}, 90)

//build a unit vector seg to get mid point (will be from origin)
let newSegFromOrigin = {startPt: {x: 0, y: 0, z: 0}, endPt: {x: newSegEndPtRotated.x , y: newSegEndPtRotated.y, z: 0}}
let midPt = road.getSegMidPt({
	startPt: {
		x: 0,
		y: -51900,
		z: 0
	},
	endPt: {
		x: 5,
		y: -51897,
		z: 0
	}
})
console.log(midPt)
//move unit vector to world
//first arg is point to translate, startPt is offset by which to translate first arg)
// newSegEndPt ,{x: 5, y: -51897, z: 0}
let newSegToWorld = road.translatePtToWorld({x: newSegEndPtRotated.x, y: newSegEndPtRotated.y, z: 0},  {x: midPt.x, y: midPt.y, z: 0} ) //{x: 5, y: -51897, z: 0}) //{x: midPt.x, y: midPt.y, z: 0}


// turn this into new road
let vertsNewRoad = []
vertsNewRoad.push(midPt.x)
vertsNewRoad.push(midPt.y)
vertsNewRoad.push(0)

vertsNewRoad.push(newSegToWorld.x)
vertsNewRoad.push(newSegToWorld.y)
vertsNewRoad.push(0)






// let newSegToOrigin = road.translateSegToOrigin({x: 0, y: -51900, z: 0},newSegEndPt)
// console.log(newSegToOrigin)
//
// let rotatedNewSegEndPt = road.rotateAboutOrigin(newSegToOrigin.endPt, 90)
// console.log(rotatedNewSegEndPt)
//
// //first arg is point to translate, startPt is offset by which to translate first arg)
// // newSegEndPt ,{x: 5, y: -51897, z: 0}
// let newSegToWorld = road.translatePtToWorld(rotatedNewSegEndPt, {x: 5, y: -51897, z: 0})
// road.vertsRoad.push(5)
// road.vertsRoad.push(-51897)
// road.vertsRoad.push(0)
//
// road.vertsRoad.push(newSegToWorld.x)
// road.vertsRoad.push(newSegToWorld.y)
// road.vertsRoad.push(0)



// road.addSeg({endPt: {x: 0, y: -51900, z: 0}, startPt: {x: 0, y: -52000, z: 0}})
// road.addSeg({endPt: {x: 0, y: -51900, z: 0}, startPt: {x: 100, y: -50800, z: 0}})


let vertsRoad = road.getRoad()

let vertsNewRoad32 = new Float32Array(vertsNewRoad)


//put road vets in a typed array for 3js to consumed
let vertsRoad32 = new Float32Array(vertsRoad);

var geomNewRoad = new THREE.BufferGeometry();
geomNewRoad.addAttribute('position', new THREE.BufferAttribute(vertsNewRoad32, 3));
let lineNewRoad = new THREE.Line(geomNewRoad, matRoad)
scene.add(lineNewRoad)



var geomRoad = new THREE.BufferGeometry();
geomRoad.addAttribute('position', new THREE.BufferAttribute(vertsRoad32, 3));
let lineRoad = new THREE.Line(geomRoad, matRoad)
scene.add(lineRoad)
console.log(road.totalSegs)

var geomGrid = new THREE.BufferGeometry();
geomGrid.addAttribute('position', new THREE.BufferAttribute(vertsGrid32, 3));
let lineGrid = new THREE.Line(geomGrid, matRoad)
scene.add(lineGrid)


//establish camera location and camera target
let deg = 0.0174533
// camera.position.x = 0;
// camera.position.y = -52000; //-104000;
// camera.position.z = 500;

// camera.position.x = 0;
// camera.position.y = 0; // -52000 / 2; //-104000;
// camera.position.z = 150000;

camera.position.x = 0;
camera.position.y = -51900; // -52000 / 2; //-104000;
camera.position.z = 10;


camera.rotateX(deg * 0)
// camera.lookAt( new THREE.Vector3( 0, 1, 10000 ) );
// camera.lookAt( new THREE.Vector3( 0, 0, 10 ) );

function animate() {
  requestAnimationFrame(animate);
  // cube.rotation.x += 0.01; cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

//invoke scene render
animate();



// scene = new Scene()
//
// //while road seg not intersecting tile boundary, add segs
// while(scene.updateRoad) {
//   scene.updateRoad
// }
// var blockTyp
// var blockTypeShort = 250
//major range between 3 and 4 long blocks, 7 and 16 short blocks
