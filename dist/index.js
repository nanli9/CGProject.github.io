import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';

var bead,maincube,tassels,woodframe,topcube,ring,handler;
let i =2;
let lightMoveSpeed=0.0;
let lanternrotateSpeed=0.0;
let rotateCheck=false;
let lightMove = false;

const planeSize = 20;

const STLloader = new STLLoader();
const textureloader = new THREE.TextureLoader();

const container = document.getElementById("container");
const innerWidth = container.clientWidth;
const innerHeight = container.clientHeight;
console.log(innerWidth,innerHeight);

//antialias
const renderer = new THREE.WebGLRenderer({antialiasing:true});
renderer.setPixelRatio( window.devicePixelRatio * 1.5 );

renderer.setSize( innerWidth, innerHeight );
renderer.shadowMap.enabled = true;
container.appendChild( renderer.domElement );

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, innerWidth / innerHeight, 0.1, 1000 );
const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 1, 2, 8 );
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
var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
light.castShadow = true;
light.position.set(i, 5, 0);
light.target.position.set(0, 0, 0);
scene.add(light);
scene.add(light.target);
scene.add(ambientLight);

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
    const intensity = 0.4;
    const light = new THREE.PointLight(color, intensity);
    light.position.set(0, 3, 1);
    scene.add(light);
}

loadLantern();
//load the mesh
function loadLantern(){
    //mark inner light source
    const cube = new THREE.Mesh( new THREE.BoxGeometry( 0.1, 0.1, 0.1 ), new THREE.MeshBasicMaterial( { color: 0xffff2f } ) );
    cube.position.set(0, 2.5, 1);
    scene.add( cube );
    STLloader.load(
        'assets/lantern/bead.stl',
        function (geometry) {
            const material = new THREE.MeshPhongMaterial( { color:0x76d2aa} );
            bead = new THREE.Mesh(geometry,material);
            bead.rotation.x = -Math.PI / 2;
            //mesh.position.set( 3, 2.5, 1 );
            bead.position.set( 0, 2.5, 1 );
            bead.scale.set(0.02,0.02,0.02);
            bead.castShadow = true;
            scene.add(bead);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.log(error)
        }
    )
    //add main cube
    const texture = textureloader.load( 'https://images.pexels.com/photos/1205301/pexels-photo-1205301.jpeg' );
    const normalMap = textureloader.load( 'assets/normal_map_paper.jpg' );
    maincube=new THREE.Mesh( new THREE.BoxGeometry(32, 32, 60 ), new THREE.MeshPhongMaterial( { normalMap:normalMap} ));
    maincube.rotation.x = -Math.PI / 2;
    maincube.position.set( 0, 2.5, 1 );
    maincube.scale.set(0.02,0.02,0.02);
    maincube.castShadow = true;
    scene.add(maincube) ;
    
    STLloader.load(
        'assets/lantern/tassels.stl',
        function (geometry) {
            const material = new THREE.MeshPhongMaterial( { color:0xd97070} );
            tassels = new THREE.Mesh(geometry,material);
            tassels.rotation.x = -Math.PI / 2;
            //mesh.position.set( 3, 2.5, 1 );
            tassels.position.set( 0, 2.5, 1 );
            tassels.scale.set(0.02,0.02,0.02);
            tassels.castShadow = true;
            scene.add(tassels);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        }
    )
    STLloader.load(
        'assets/lantern/woodframe.stl',
        function (geometry) {
            const material = new THREE.MeshPhongMaterial( { color:0x4c4040} );
            woodframe = new THREE.Mesh(geometry,material);
            woodframe.rotation.x = -Math.PI / 2;
            //mesh.position.set( 3, 2.5, 1 );
            woodframe.position.set( 0, 2.5, 1 );
            woodframe.scale.set(0.02,0.02,0.02);
            woodframe.castShadow = true;
            scene.add(woodframe);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        }
    )
    STLloader.load(
        'assets/lantern/topcube.stl',
        function (geometry) {
            const material = new THREE.MeshPhongMaterial( { color:0xefc090} );
            topcube = new THREE.Mesh(geometry,material);
            topcube.rotation.x = -Math.PI / 2;
            //mesh.position.set( 3, 2.5, 1 );
            topcube.position.set( 0, 2.5, 1 );
            topcube.scale.set(0.02,0.02,0.02);
            topcube.castShadow = true;
            scene.add(topcube);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        }
    )
    STLloader.load(
        'assets/lantern/ring.stl',
        function (geometry) {
            const material = new THREE.MeshStandardMaterial ( { color:0xefc090 ,

                roughness: 0.4,
                metalness: 1,
            
                } );
            ring = new THREE.Mesh(geometry,material);
            ring.rotation.x = -Math.PI / 2;
            //mesh.position.set( 3, 2.5, 1 );
            ring.position.set( 0, 2.5, 1 );
            ring.scale.set(0.02,0.02,0.02);
            ring.castShadow = true;
            scene.add(ring);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        }
    )
    STLloader.load(
        'assets/lantern/handler.stl',
        function (geometry) {
            const material = new THREE.MeshStandardMaterial ( { color:0xefc090 ,
                roughness: 0.4,
                metalness: 1,
                } );
            handler = new THREE.Mesh(geometry,material);
            handler.rotation.x = -Math.PI / 2;
            //mesh.position.set( 3, 2.5, 1 );
            handler.position.set( 0, 2.5, 1 );
            handler.scale.set(0.02,0.02,0.02);
            handler.castShadow = true;
            scene.add(handler);
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


rotateButton();
lightMoveButton();

//animate
function animate() {
	requestAnimationFrame( animate );
    i+=lightMoveSpeed;
    light.position.set(i, 5, 0);
    updateLight(i);
    if(bead&&maincube&&tassels&&topcube&&woodframe&&ring&&handler){
        bead.rotation.z+=lanternrotateSpeed;
        maincube.rotation.z+=lanternrotateSpeed;
        tassels.rotation.z+=lanternrotateSpeed;
        topcube.rotation.z+=lanternrotateSpeed;
        woodframe.rotation.z+=lanternrotateSpeed;
        ring.rotation.z+=lanternrotateSpeed;
        handler.rotation.z+=lanternrotateSpeed;
    }
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