var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 300000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// var geometry = new THREE.BoxGeometry(1, 1, 1);
// var material = new THREE.MeshBasicMaterial({
//   color: 0x00ff00
// });

var geometry = new THREE.BufferGeometry();
// create a simple square shape. We duplicate the top left and bottom right
// vertices because each vertex needs to appear once per triangle.
var vertices = new Float32Array( [
	-104000.0, -104000.0,  1.0,
	 104000.0, -104000.0,  1.0,
	 //  1.0,  1.0,  1.0,

	 104000.0,  104000.0,  1.0,
	-104000.0,  104000.0,  1.0,
	-104000.0, -104000.0,  1.0
] );

// itemSize = 3 because there are 3 values (components) per vertex
geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
// var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
// var mesh = new THREE.Mesh( geometry, material );

var material = new THREE.LineBasicMaterial( {
	color: 0x00ffff,
	linewidth: 3
	// linecap: 'round', //ignored by WebGLRenderer
	// linejoin:  'round' //ignored by WebGLRenderer
} );

// material.wireframe = true;
// var cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

var line = new THREE.Line( geometry, material );
scene.add(line)
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 10000;
camera.lookAt( new THREE.Vector3( 0, 1, 10000 ) );


var blockTypLong = 600
var blockTypeShort = 250

//major range between 3 and 4 long blocks, 7 and 16 short blocks


function animate() {
  requestAnimationFrame(animate);
  // cube.rotation.x += 0.01; cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
