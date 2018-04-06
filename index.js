var segs = 1000


/*todo: put most of this in Scene*/

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 300000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//geomTile buffer to hold tile geomTile (tile + roads + street grids)
var geomTile = new THREE.BufferGeometry();

//vertices for tile (20x20 miles) (todo: move this to Tile)
var vertsTile = new Float32Array([-52000.0, -52000.0, 1.0,
  52000.0, -52000.0, 1.0,
  52000.0, 52000.0, 1.0, -52000.0, 52000.0, 1.0, -52000.0, -52000.0, 1.0
]);

var vertsGrid32 = new Float32Array([-52000.0, -0, 1.0,
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

let initialSpawnSeg = {
  startPt: {
    x: -52000,
    y: -52000,
    z: 0
  },
  endPt: {
    x: 52000,
    y: -52000,
    z: 0
  }
}

let spawnSeg = initialSpawnSeg

let road = null
let vertsRoad = null
let prevRoadDir = "left"
let numRoadsToBuild = 2

while (numRoadsToBuild > 0) {
  //determine if new road is generally NS or EW by angle of spawnSeg
  if (prevRoadDir === "left") {
    road = buildRoad(spawnSeg, -90, "right")
  } else {
    road = buildRoad(spawnSeg, 90, "left")
  }

  // add road to scene
  // prevRoadDir = road.direction
  vertsRoad = road.getRoad()

  addLine(vertsRoad, matRoad)

  //instead of doing this, you let the number of spawnSegs left in queue itterate the loop
  numRoadsToBuild--
}
//build a road
function buildRoad(spawnSeg, rot = 90, direction) {

  let road = new Road(spawnSeg, rot, direction)
  let newRoadSeg

  let boundaryRight = 52000
  let boundaryLeft = -52000

  let boundaryTop = 52000
  let boundaryBottom = -52000

  // for (let i = 0; i < segs; i++) {
  let roadInBounds = true
  while(roadInBounds) {
    newRoadSeg = road.getNewRoadSeg()
    if (
      newRoadSeg.endPt.x > boundaryLeft &&
      newRoadSeg.endPt.x < boundaryRight &&
      newRoadSeg.endPt.y > boundaryBottom &&
      newRoadSeg.endPt.y < boundaryTop) {
        road.addSeg(newRoadSeg)
      } else {
        roadInBounds = false
      }

  }

  //return road object
  prevRoadDir = road.direction
  return road
}

function addLine(verts, mat) {
  let verts32 = new Float32Array(verts);
  let geom = new THREE.BufferGeometry();
  geom.addAttribute('position', new THREE.BufferAttribute(verts32, 3));
  let newGeom = new THREE.Line(geom, mat)
  scene.add(newGeom)
}

// add grid to scene
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
