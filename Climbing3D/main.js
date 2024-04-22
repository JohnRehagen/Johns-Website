import * as THREE from "three"
import "./style.css"
import { OrbitControls } from "three/examples/jsm/Addons.js"
//Scene
const scene = new THREE.Scene()

//Create our sphere
const geometry = new THREE.SphereGeometry(3,64,64)
const material = new THREE.MeshStandardMaterial({
  color: '#00ff83',
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

//sizes - get viewport size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

//light
const light = new THREE.PointLight(0xffffff, 70, 100, 1.7)
light.position.set(0,10,10) //x,y,z
scene.add(light)


//Camera
const camera = new THREE.PerspectiveCamera(50,sizes.width/sizes.height,0.1,100)
camera.position.z = 20
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
controls.enableDamping = true;
controls.enablePan = true;
controls.enablezoom = true;

const loop = () => {
  renderer.render(scene,camera)
  window.requestAnimationFrame(loop)
  controls.update
}
loop()