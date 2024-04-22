//Import three.js library
import * as Three from "https://cdn.skypack.dev/three@0.129.0/built/three.module.js";

//allow camera to move around the scene
import {OrbitControls} from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

// allow importing the .gltf file
import {GLTFLoader} from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//Create a Three.JS scene
const scene = new Three.Scene();

//create a new camera with positions and anlges
const camera = new Three.PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1,1000);

//Keep the 3d object on a global variable so we can accest it later;
let object;

// Orbit controls allow camera to move around the scene
let controls;

//Set which object to render
let objToRender = "car";

//Intantiate a loader fo the .gltf file
const loader = new GLTFLoader();

//Load the file
loader.load(
    '${objtorender}/scene.gltf',
    function(gltf) {
        //if the file is loaded, add it to the scene
        object = gltf.scene;
        scene.add(object);
    },
    function(xhr){
        //while it is loading, log the progress
        console.log((xhr.loaded  / xhr.total*100) + ' % loaded');
    },
    function (error){
        //if there is an error, log it
        console.error(error);
    }
);

//instantiate a new renderer and set it size
const renderer = new Three.WebGLRenderer({alpha:true});
renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementsByID("3DContainer").appendChild(renderer.domElement);

//set how far the camera will be from the 3D model
camera.posiition.z = objToRender

//Set how far the camera will be from the 3D model
camera.position.z = objToRender === "dino" ? 25 : 500;

//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(500, 500, 500) //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "dino" ? 5 : 1);
scene.add(ambientLight);

//This adds controls to the camera, so we can rotate / zoom it with the mouse
if (objToRender === "dino") {
  controls = new OrbitControls(camera, renderer.domElement);
}

//Render the scene
function animate() {
    requestAnimationFrame(animate);
    //Here we could add some code to update the scene, adding some automatic movement
  
    //Make the eye move
    if (object && objToRender === "car") {
      //I've played with the constants here until it looked good 
      object.rotation.y = -3 + mouseX / window.innerWidth * 3;
      object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
    }
    renderer.render(scene, camera);
  }
  
  //Add a listener to the window, so we can resize the window and the camera
  window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  
  //add mouse position listener, so we can make the eye move
  document.onmousemove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }
  
  //Start the 3D rendering
  animate();