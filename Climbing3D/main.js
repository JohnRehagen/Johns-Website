import * as THREE from "three"
import "./style.css"
import { OrbitControls } from "three/examples/jsm/Addons.js"
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import TWEEN from '@tweenjs/tween.js';

//Scene
const scene = new THREE.Scene()

const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  side: THREE.DoubleSide
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.castShadow = false;
groundMesh.receiveShadow = true;
scene.add(groundMesh);

const spotLight = new THREE.SpotLight(0xffffff, 3000, 100, 0.22, 1);
spotLight.position.set(0, 25, 0);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);

//light
const light = new THREE.PointLight(0xffffff, 70)
light.position.set(0,-1,-0.5) //x,y,z
scene.add(light)

//light2
const light2 = new THREE.PointLight(0xffffff, 70)
light.position.set(-1.65,4.07,4) //x,y,z
scene.add(light2)

//light2
const light3 = new THREE.PointLight(0xffffff, 70)
light.position.set(-1.65,4.07,0) //x,y,z
scene.add(light3)

const light4 = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light4 )

// Load GLB File
const loader = new GLTFLoader();

loader.load('https://s3.us-east-2.amazonaws.com/www.johnrehagen.com/Scaniverse+2024-04-10+220614.glb', (gltf) => {
  console.log('loading model');
  const mesh = gltf.scene;

  mesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  mesh.position.set(0, 1.05, -1);
  scene.add(mesh);

  document.getElementById('progress-container').style.display = 'none';
}, (xhr) => {
  console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
}, (error) => {
  console.error(error);
});

//sizes - get viewport size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

//Camera
const camera = new THREE.PerspectiveCamera(50,sizes.width/sizes.height,0.1,100)
camera.position.set(13, 5.4, -1);
scene.add(camera)

//Renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width,sizes.height)
renderer.render(scene,camera)

//Resize
window.addEventListener("resize", () => {
  // Update sizes object with new dimensions
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update renderer size to match new dimensions
  renderer.setSize(sizes.width, sizes.height);

  // Update camera aspect ratio to match new dimensions
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
});

//Controls
const controls = new OrbitControls(camera,canvas)
controls.enablePan = true;
//controls.minDistance = 5;
//controls.maxDistance = 20;
//controls.minPolarAngle = 0.5;
//controls.maxPolarAngle = 1.5;
//controls.autoRotate = false;
//controls.target = new THREE.Vector3(0, 1, 0);

// Create a div element to display camera position
var positionDiv = document.createElement('div');
positionDiv.style.position = 'absolute';
positionDiv.style.top = '10px';
positionDiv.style.left = '10px';
positionDiv.style.color = 'white';
document.body.appendChild(positionDiv);

var vector = new THREE.Vector3(); // create once and reuse it!
//console.log(camera.getWorldDirection( vector ));

// Function to update camera position display
function updateCameraPosition() {
  const cameraDirection = camera.getWorldDirection( vector )
  positionDiv.innerHTML = 'Camera Position: x: ' + camera.position.x.toFixed(2) +
                           ', y: ' + camera.position.y.toFixed(2) +
                           ', z: ' + camera.position.z.toFixed(2) +
                           ' Camera Direction: x ' + cameraDirection.x.toFixed(2) + 
                           ', y: ' + cameraDirection.y.toFixed(2) +
                           ', z: ' + cameraDirection.z.toFixed(2);
}

//****************BOTTOM MENU*************
const helpButton = document.getElementById('helpButton');
const routesButton = document.getElementById('routesButton');
const helpOverlay = document.getElementById('helpOverlay');
const closeButton = document.getElementById('closeButton');
const routesOverlay = document.getElementById('routesOverlay');
const menuButtonsContainer = document.getElementById('menuButtonsContainer');
const closeRoutesButton = document.getElementById('closeRoutesButton');

helpButton.addEventListener('click', () => {
  helpOverlay.style.display = 'flex';
  console.log("help menu opened")
});

closeButton.addEventListener('click', () => {
  helpOverlay.style.display = 'none';
  console.log("help menu closed")
});

routesButton.addEventListener('click', () => {
  showRoutesMenu();
  console.log("routes menu opened")
});

function showRoutesMenu() {
  const routesContent = document.querySelector('.routes-content');
  routesContent.classList.add('open');
  routesOverlay.style.display = 'flex';
  routesOverlay.style.bottom = '0';
  fetch('routes.json')
    .then(response => response.json())
    .then(data => {
      menuButtonsContainer.innerHTML = ''; // Clear existing buttons
      const buttonCount = data.menuItems.length;
      menuButtonsContainer.style.setProperty('--button-count', buttonCount);
      data.menuItems.forEach(item => {
        const menuButton = document.createElement('button');
        menuButton.textContent = item.title;
        menuButton.addEventListener('click', () => {
          const { x, y, z } = item.cameraPosition;
          const { x: dirX, y: dirY, z: dirZ } = item.cameraDirection;
          animateCamera(new THREE.Vector3(x, y, z), new THREE.Vector3(dirX, dirY, dirZ), 750);
        });
        menuButtonsContainer.appendChild(menuButton);
      });
    })
    .catch(error => console.error('Error fetching menu data:', error));

  routesOverlay.addEventListener('touchstart', handleTouchStart, { passive: true });
  routesOverlay.addEventListener('touchmove', handleTouchMove, { passive: false });
  routesOverlay.addEventListener('touchend', handleTouchEnd);

  closeRoutesButton.addEventListener('click', hideRoutesMenu);
}

function hideRoutesMenu() {
  const routesContent = document.querySelector('.routes-content');
  const routesOverlay = document.getElementById('routesOverlay');

  routesContent.classList.remove('open');
  routesOverlay.style.display = 'none';
}

let isDragging = false;
let startY;

function handleTouchStart(e) {
  if (e.target === routesOverlay) {
    isDragging = true;
    startY = e.touches[0].pageY;
  }
}

function handleTouchMove(e) {
  if (isDragging && Math.abs(e.touches[0].pageY - startY) > 50) {
    e.preventDefault();
    const currentY = e.touches[0].pageY;
    const offsetY = currentY - startY;
    const maxOffset = window.innerHeight * 0.7;
    const clampedOffset = Math.max(Math.min(offsetY, maxOffset), 0);
    routesOverlay.style.bottom = `calc(-70% + ${clampedOffset}px)`;
  }
}

function handleTouchEnd() {
  isDragging = false;
  const currentBottom = parseInt(routesOverlay.style.bottom, 10);
  if (currentBottom < -(window.innerHeight * 0.3)) {
    // Close the routes menu
    hideRoutesMenu();
  } else {
    // Slide the routes menu back to the bottom
    routesOverlay.style.bottom = '0';
  }
}

fetch('routes.json')
    .then(response => response.json())
    .then(data => {
      menuButtonsContainer.innerHTML = ''; // Clear existing buttons
      data.menuItems.forEach(item => {
        const menuButton = document.createElement('button');
        menuButton.textContent = item.title;
        menuButton.addEventListener('click', () => {
          const { x, y, z } = item.cameraPosition;
          const { x: dirX, y: dirY, z: dirZ } = item.cameraDirection;
          animateCamera(new THREE.Vector3(x, y, z), new THREE.Vector3(dirX, dirY, dirZ), 750);
          hideRoutesMenu();
        });
        menuButtonsContainer.appendChild(menuButton);
      });
    })
    .catch(error => console.error('Error fetching menu data:', error));

function animateCamera( targetPosition, targetDirection, duration )
{
		new TWEEN.Tween( camera.position )
			.to( targetPosition, duration )
			.easing( TWEEN.Easing.Sinusoidal.InOut )
			.start( );
	
		new TWEEN.Tween( camera.getWorldDirection( new THREE.Vector3 ) )
			.to( targetDirection, duration )
			.easing( TWEEN.Easing.Sinusoidal.InOut )
			.onUpdate( (direction)=>{
					direction.add( camera.position );
					camera.lookAt( direction );
			} )
			.start( );
}

//*******Constant loop ***************

//constant loop
const loop = () => {
  renderer.render(scene,camera)
  window.requestAnimationFrame(loop)
  controls.update
  updateCameraPosition()
  TWEEN.update( );
}
loop()