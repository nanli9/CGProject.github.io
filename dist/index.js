import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';

var lantern;
const planeSize = 20;
const textureloader = new THREE.TextureLoader();

const container = document.getElementById("container");
const innerWidth = container.clientWidth;
const innerHeight = container.clientHeight;
console.log(innerWidth,innerHeight);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( innerWidth, innerHeight );
renderer.shadowMap.enabled = true;
container.appendChild( renderer.domElement );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, innerWidth / innerHeight, 0.1, 1000 );
const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 1, 1, 9 );
controls.update();

// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

//load background image
// textureloader.load('assets/R.jfif' , function(texture){
//     scene.background = texture;  
// });
scene.background = new THREE.CubeTextureLoader()
	.setPath( 'assets/skybox/' )
	.load( [
        "right.jpg",
        "left.jpg",
        "top.jpg",
        "bottom.jpg",
        "front.jpg",
        "back.jpg"
			] );
//load plane
loadPlane();
function loadPlane(){
    const PlaneTexture = textureloader.load('assets/checker.png');
    PlaneTexture.wrapS = THREE.RepeatWrapping;
    PlaneTexture.wrapT = THREE.RepeatWrapping;
    PlaneTexture.magFilter = THREE.NearestFilter;
    PlaneTexture.colorSpace = THREE.SRGBColorSpace;
    const repeats = planeSize / 2;
    PlaneTexture.repeat.set(repeats, repeats);
    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
    map: PlaneTexture,
    side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    mesh.receiveShadow = true;
    scene.add(mesh);
}

//add light
const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);
light.castShadow = true;
light.position.set(3, 5, 0);
light.target.position.set(0, 0, 0);
scene.add(light);
scene.add(light.target);
const lightPoint = new THREE.Mesh( new THREE.BoxGeometry( 0.1, 0.1, 0.1 ), new THREE.MeshBasicMaterial( { color: 0xffff2f } ) );
markLight();
function markLight(){
    scene.add( lightPoint );
}
function updateLight(i){
    lightPoint.position.set(i, 5, 0)
}
addInnerLightSource();
function addInnerLightSource(){
    const color = 0xFFFFFF;
    const intensity = 0.6;
    const light = new THREE.PointLight(color, intensity);
    light.position.set(0, 3, 1);
    scene.add(light);
}

const STLloader = new STLLoader()
loadLantern();
//load the mesh
function loadLantern(){
    //load texture
    const texture = textureloader.load( 'https://images.pexels.com/photos/1205301/pexels-photo-1205301.jpeg' );
    const material = new THREE.MeshBasicMaterial( { color:0x000000, ambient:0x99CC3B,} );
    STLloader.load(
        'lantern.stl',
        function (geometry) {
            lantern = new THREE.Mesh(geometry,material);
            lantern.rotation.x = -Math.PI / 2;
    
            //mark inner light source
            const cube = new THREE.Mesh( new THREE.BoxGeometry( 0.1, 0.1, 0.1 ), new THREE.MeshBasicMaterial( { color: 0xffff2f } ) );
            cube.position.set(0, 2.5, 1);
            scene.add( cube );
    
            //mesh.position.set( 3, 2.5, 1 );
            lantern.position.set( 0, 2.5, 1 );
            lantern.scale.set(0.02,0.02,0.02);
            lantern.castShadow = true;
            scene.add(lantern);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        }
    )
}

const mtlLoader = new MTLLoader();
const objLoader = new OBJLoader();
mtlLoader.load('assets/Lantern_OBJ.mtl', (mtl) => {
  mtl.preload();
  objLoader.setMaterials(mtl);
  //Lantern_low_Lantern_BaseColor.png
  objLoader.load('assets/Lantern_OBJ.obj', (root) => {
    root.scale.set(0.05,0.05,0.05);
    root.traverse(i=>{
        if(i.type==="Mesh")
            i.castShadow = true;
    })
    //scene.add(root);
  });
});

let i =0;
let lightMoveSpeed=0.0;
let lanternrotateSpeed=0.0;
rotateButton();
lightMoveButton();
let rotateCheck=false;
let lightMove = false;
//animate
function animate() {
	requestAnimationFrame( animate );
    i+=lightMoveSpeed;
    light.position.set(i, 5, 0);
    updateLight(i);
    if(lantern!=undefined)
        lantern.rotation.z+=lanternrotateSpeed;
	controls.update();
	renderer.render( scene, camera );
}

animate();

function rotateButton(){
    const button = document.getElementById("rotate");
    button.addEventListener("click",()=>{
        rotateCheck=!rotateCheck;
        console.log("rotate");
        if(rotateCheck){
            lanternrotateSpeed=0.02;
        }
        else{
            lanternrotateSpeed=0.0;
        }

    })
}
function lightMoveButton(){
    const button = document.getElementById("lightMove");
    button.addEventListener("click",()=>{
        console.log("lightMove");
        lightMove=!lightMove;
        if(lightMove){
            lightMoveSpeed=0.05;
        }
        else{
            lightMoveSpeed=0.0;
        }

    })
}