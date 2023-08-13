import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';

var mesh;

const container = document.getElementById("container");
const innerWidth = container.clientWidth;
const innerHeight = container.clientHeight;
console.log(innerWidth,innerHeight);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( innerWidth, innerHeight );
container.appendChild( renderer.domElement );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, innerWidth / innerHeight, 0.1, 1000 );
const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 100, -180, 90 );
controls.update();

// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

//load background image
const textureloader = new THREE.TextureLoader();
textureloader.load('assets/R.jfif' , function(texture){
    scene.background = texture;  
});
//add light
const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(0, 10, 0);
light.target.position.set(-5, 0, 0);
scene.add(light);
scene.add(light.target);
//load texture
const texture = textureloader.load( 'https://images.pexels.com/photos/1205301/pexels-photo-1205301.jpeg' );
const material = new THREE.MeshBasicMaterial( { map: texture, } );
//load the mesh
const STLloader = new STLLoader()
STLloader.load(
    'lantern.stl',
    function (geometry) {
        mesh = new THREE.Mesh(geometry,material)
        //scene.add(mesh)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)
const mtlLoader = new MTLLoader();
const objLoader = new OBJLoader();
mtlLoader.load('assets/Lantern_OBJ.mtl', (mtl) => {
  mtl.preload();
  objLoader.setMaterials(mtl);
  objLoader.load('assets/Lantern_OBJ.obj', (root) => {
    scene.add(root);
  });
});


//animate
function animate() {
	requestAnimationFrame( animate );

	controls.update();
	renderer.render( scene, camera );
}

animate();

