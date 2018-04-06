var segs = 1000
var numSegsBtwnSpawn = 250

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

//test: build road here

//road1
// let vertsRoad = buildRoad(spawnSeg)

//road2
// let i=250
// spawnSeg2 = {
// 	startPt:
// 		{x: vertsRoad[i*3+0], y: vertsRoad[i*3+1], z: 0},
// 	endPt:
// 		{x: vertsRoad[i*3+3], y: vertsRoad[i*3+4], z: 0}
// }
// let vertsRoadTwo = buildRoad(spawnSeg2, 90, false)

//build a road
let numRoadsToBuild = 30
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

let spawnSeg = null
let iVertsRoad = Math.floor(segs / 2)
let road = null
let vertsRoad = null
let prevRoadDir = null

// this is a que that accumulates spawnSegs during road generation,
// then shift that road off the que,
// leaving only roads pushed onto que during that road's generation
let spawnSegs = [initialSpawnSeg]

//initial road generation will be to opposite of this value
prevRoadDir = "right"

// while (spawnSegs.length > 0) {
let numSegs = 0

while (numSegs < 4) {
  console.log("prevRoadDir", prevRoadDir)
  console.log(spawnSegs[0])
  let dx = Math.abs(spawnSegs[0].endPt.x - spawnSegs[0].startPt.x)
  let dy = Math.abs(spawnSegs[0].endPt.y - spawnSegs[0].startPt.y)
  console.log("dx, dy: ", dx, dy)
  //determine if new road is generally NS or EW by angle of spawnSeg
  if (prevRoadDir === "left") {
    road = buildRoad(spawnSegs[0], -90, "right")
  } else {
    road = buildRoad(spawnSegs[0], 90, "left")
  }

	// add road to scene
	// prevRoadDir = road.direction
	vertsRoad = road.getRoad()
	numSegs++
	addLine(vertsRoad, matRoad)

  //instead of doing this, you let the number of spawnSegs left in queue itterate the loop
	numRoadsToBuild--
}


/*
while (numRoadsToBuild > 0) {
  //spawn a road
  if (spawnSeg === null) {
    //if no roads yet exist
		console.log("initialSpawnSeg")
    road = buildRoad(initialSpawnSeg, 90, "left")
  } else {
		if(prevRoadDir === "left") {
			console.log("prev was left")
			road = buildRoad(spawnSeg, -90, "right")
		} else {
			console.log("prev was right")
			road = buildRoad(spawnSeg, 90, "left")
		}
  }
	//get a spawn seg from this road
	vertsRoad = road.getRoad()
	spawnSeg = {
		startPt: {
			x: vertsRoad[iVertsRoad*3+0],
			y: vertsRoad[iVertsRoad*3+1],
			z: vertsRoad[iVertsRoad*3+2]
		},
		endPt: {
			x: vertsRoad[iVertsRoad*3+3],
			y: vertsRoad[iVertsRoad*3+4],
			z: vertsRoad[iVertsRoad*3+5]
		}
	}
	prevRoadDir = road.direction
	//add road to scene
	addLine(vertsRoad, matRoad)

	numRoadsToBuild--
}

*/



//build a road
function buildRoad(spawnSeg, rot = 90, direction) {

  let road = new Road(spawnSeg, rot, direction)

  let newRoadSeg
  let numSegsSincePrevSpawn = 0

  for (let i = 0; i < segs; i++) {
    newRoadSeg = road.getNewRoadSeg()
    road.addSeg(newRoadSeg)

    //if we have traversed enough distance, get a spawnSeg and add it to queue
    numSegsSincePrevSpawn++
    if (numSegsSincePrevSpawn === numSegsBtwnSpawn) {
      let vertsRoad = road.getRoad()
      spawnSeg = {
        startPt: {
          x: vertsRoad[i * 3 + 0],
          y: vertsRoad[i * 3 + 1],
          z: vertsRoad[i * 3 + 2]
        },
        endPt: {
          x: vertsRoad[i * 3 + 3],
          y: vertsRoad[i * 3 + 4],
          z: vertsRoad[i * 3 + 5]
        }
      }
      spawnSegs.push(spawnSeg)
      numSegsSincePrevSpawn = 0
      console.log("set to left")
      prevRoadDir = "left"
    }
  }
  //update queue
  spawnSegs.shift()

  //return road object
  return road
}

//road
// addLine(vertsRoad, matRoad)

//road 2
// addLine(vertsRoadTwo, matRoad)

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
