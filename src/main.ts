import { Scene, Color } from 'three';
import { createCamera } from './core/camera';
import { createRenderer } from './core/renderer';
import { Loop } from './core/loop';
import { createLights } from './components/lighting';
import { createSceneObjects } from './components/sceneObjects';
import { createParticles } from './components/particles';
import { setupInteraction } from './core/interaction';
import { createDebugPanel } from './ui/debug';

const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;
if (!canvas) throw new Error('Canvas element not found');

const scene = new Scene();
scene.background = new Color('#111111'); 

const { camera, controls } = createCamera(canvas);
const renderer = createRenderer(canvas);
const loop = new Loop(camera, scene, renderer);

loop.updatables.push(controls);

const lights = createLights();
scene.add(lights.ambientLight, lights.mainLight, lights.mainLightTarget);

const meshes = createSceneObjects(scene);

const particles = createParticles();
scene.add(particles);
loop.updatables.push(particles);

setupInteraction(camera, meshes, loop);
createDebugPanel(meshes, lights, particles);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

renderer.setSize(window.innerWidth, window.innerHeight);
loop.start();
