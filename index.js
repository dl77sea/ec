/*todo: put most of this in Scene*/

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 300000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//geomTile buffer to hold tile geomTile (tile + roads + street grids)
var geomTile = new THREE.BufferGeometry();

//vertices for tile (20x20 miles) (todo: move this to Tile)
var vertsTile = new Float32Array( [
	-52000.0, -52000.0,  1.0,
	 52000.0, -52000.0,  1.0,
	 52000.0,  52000.0,  1.0,
	-52000.0,  52000.0,  1.0,
	-52000.0, -52000.0,  1.0
] );

// add tile vertices to geomTile buffer (this buffer (geomTile) will be consumed by THREE.Line
// so that it can be added as a line to the 3js Three.Scene object (scene))
geomTile.addAttribute( 'position', new THREE.BufferAttribute( vertsTile, 3 ) );

// road matRoad
var matRoad = new THREE.LineBasicMaterial( {
	color: 0x00ffff,
	linewidth: 3
	// linecap: 'round', //ignored by WebGLRenderer
	// linejoin:  'round' //ignored by WebGLRenderer
} );

//feed the tile geometry, as a line, to the 3js scen object
var lineTile = new THREE.Line( geomTile, matRoad );
scene.add(lineTile)

//test: build road here
let road = new Road()
let segs = 10;
for(let i=0; i < segs; i++) {
  road.addSeg()
}
let vertsRoad = road.getRoad()
console.log("vertsRoad: ", vertsRoad)

//put road vets in a typed array for 3js to consumed
let vertsRoad32 = new Float32Array( vertsRoad );
for(let i=0; i <= vertsRoad32.length; i++) {
  console.log("vert: ", vertsRoad32[i+0],vertsRoad32[i+1],vertsRoad32[i+2] )
  i+=2;
}

var geomRoad = new THREE.BufferGeometry();
geomRoad.addAttribute( 'position', new THREE.BufferAttribute( vertsRoad32, 3 ) );
let lineRoad = new THREE.Line(geomRoad, matRoad)
scene.add(lineRoad)

//establish camera location and camera target
let deg = 0.0174533
camera.position.x = 0;
camera.position.y = 0; //-104000;
camera.position.z = 150000;
camera.rotateX(deg*0)
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
