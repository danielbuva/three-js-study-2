import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import { LightShadow } from "three/src/lights/LightShadow";
import * as THREE from "three";
import * as dat from "lil-gui";
import "./style.css";

/**
 * textures
 */

const textureLoader = new THREE.TextureLoader();
const bakeShadow = textureLoader.load("/textures/bakedShadow.jpg");
const simpleShadow = textureLoader.load("/textures/simpleShadow.jpg");
console.log(simpleShadow);

/**
 * base
 */
// parameters
const parameters = {
  color: "0xffffff",
};

// canvas
const canvas = document.querySelector("canvas.webgl");

// scene
const scene = new THREE.Scene();

/**
 * lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2);
// pointLight.position.set(1, -0.5, 1);
// scene.add(pointLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight.position.set(2, 2, -1);
scene.add(directionalLight);

directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 512;
directionalLight.shadow.mapSize.height = 512;
directionalLight.shadow.camera.near = 3;
directionalLight.shadow.camera.far = 4.6;
directionalLight.shadow.camera.top = 0.6;
directionalLight.shadow.camera.right = 0.5;
directionalLight.shadow.camera.bottom = -0.5;
directionalLight.shadow.camera.left = -0.5;
directionalLight.shadow.radius = 10;

// directional light shadow helper
const directionalLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
directionalLightShadowHelper.visible = false;
scene.add(directionalLightShadowHelper);

// spotlight
const spotLight = new THREE.SpotLight(0xffffff, 0.3, 10, Math.PI * 3.0);
spotLight.shadow = new LightShadow(new THREE.PerspectiveCamera());
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.fov = 30;
spotLight.shadow.camera.near = 3;
spotLight.shadow.camera.far = 5;

spotLight.position.set(0, 2, 2);
scene.add(spotLight, spotLight.target);
console.log(THREE);

// spotlight shadow helper
const spotLightShadowHelper = new THREE.CameraHelper(spotLight.shadow.camera);
spotLightShadowHelper.visible = false;
scene.add(spotLightShadowHelper);

// point light
const pointLight = new THREE.PointLight(0xffffff, 0.3);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.5;
pointLight.shadow.camera.far = 6;

pointLight.position.set(-1, 1, 0);
scene.add(pointLight);

// point light shadow helper
const pointLightShadowHelper = new THREE.CameraHelper(pointLight.shadow.camera);
pointLightShadowHelper.visible = false;
scene.add(pointLightShadowHelper);

// const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
// scene.add(hemisphereLight);

// const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
// rectAreaLight.position.set(-1.5, 0, 1.5);
// rectAreaLight.lookAt(new THREE.Vector3());
// scene.add(rectAreaLight);

// const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1);
// spotLight.position.set(0, 2, 3);
// spotLight.target.position.x = -0.75;
// scene.add(spotLight, spotLight.target);

/** helpers */
// const hemiLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2);
// const directionalHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
// const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
// const spotLightHelper = new THREE.SpotLightHelper(spotLight);
// window.requestAnimationFrame(() => {
//   spotLightHelper.update();
// });
// const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
// scene.add(hemiLightHelper, directionalHelper, pointLightHelper, spotLightHelper, rectAreaLightHelper);

/**
 * objects
 */
// material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;

// objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
// sphere.position.x = -1.5;
sphere.castShadow = true;

// const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

// const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 32, 64), material);
// torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
plane.receiveShadow = true;

const sphereShadow = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, alphaMap: simpleShadow })
);
sphereShadow.rotation.x = Math.PI * -0.5;
sphereShadow.position.y = plane.position.y + 0.001;

// scene.add(sphere, cube, torus, plane);
scene.add(sphere, plane, sphereShadow);

/**
 * sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * camera
 */
// base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  //   cube.rotation.y = 0.1 * elapsedTime;
  //   torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  //   cube.rotation.x = 0.15 * elapsedTime;
  //   torus.rotation.x = 0.15 * elapsedTime;

  // update sphere
  sphere.position.x = Math.cos(elapsedTime) * 1.5;
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));
  sphere.position.z = Math.sin(elapsedTime) * 1.5;
  sphereShadow.position.x = sphere.position.x;
  sphereShadow.position.z = sphere.position.z;
  sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3;

  // update controls
  controls.update();

  // render
  renderer.render(scene, camera);

  // call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
// debug
// const gui = new dat.GUI({ width: 600 });
// gui.add(ambientLight, "intensity", 0, 1).name("ambient light intensity");
// gui
//   .addColor(parameters, "color")
//   .name("ambient light color")
//   .onChange(() => {
//     ambientLight.color.set(parameters.color);
//   });
// gui.add(pointLight, "intensity", 0, 1).name("point light intensity");
// gui
//   .addColor(parameters, "color")
//   .name("point light color")
//   .onChange(() => {
//     pointLight.color.set(parameters.color);
//   });
// gui.add(directionalLight, "intensity", 0, 1).name("directional light intensity");
// gui.add(directionalLight.position, "x", -10, 10, 0.001);
// gui.add(directionalLight.position, "y", -10, 10, 0.001);
// gui.add(directionalLight.position, "z", -10, 10, 0.001);
// gui
//   .addColor(parameters, "color")
//   .name("directional light color")
//   .onChange(() => {
//     directionalLight.color.set(parameters.color);
//   });
// gui.add(hemisphereLight, "intensity", 0, 1).name("hemisphere light intensity");
// gui
//   .addColor(parameters, "color")
//   .name("hemisphere light color")
//   .onChange(() => {
//     hemisphereLight.color.set(parameters.color);
//   });

// gui.add(material, "metalness", 0, 1, 0.001);
// gui.add(material, "roughness", 0, 1, 0.001);
