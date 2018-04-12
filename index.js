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

let deg = 0.0174533

camera.position.x = 0;
camera.position.y = 0; // -52000 / 2; //-104000;
camera.position.z = 150000;
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
