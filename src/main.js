import './style.css'; 
import { Scene, Color } from 'three';
import { createCamera } from './core/camera.js';
import { createRenderer } from './core/render.js';
import { Loop } from './core/loop.js';
import { createLights } from './components/lighting.js';
import { createObjects } from './components/objects.js';
import { createParticles } from './components/particles.js';
import { setupInteraction } from './core/interaction.js'; // Імпорт рейкастера
import { createDebugPanel } from './ui/debug.js'; // Імпорт панелі

const canvas = document.querySelector('canvas.webgl');
const scene = new Scene();
scene.background = new Color('#111111'); 

// Ініціалізація інфраструктури
const { camera, controls } = createCamera(canvas);
const renderer = createRenderer(canvas);
const loop = new Loop(camera, scene, renderer);

controls.tick = () => controls.update();
loop.updatables.push(controls);

// Створення світла
const lights = createLights();
scene.add(...lights);

// Завантаження Собору, EXR карти та Тексту
const meshes = createObjects(scene);

// Додавання частинок (Туман)
const particles = createParticles();
scene.add(particles);
loop.updatables.push(particles);

// Активуємо Рейкастер (наведення та кліки миші)
setupInteraction(camera, meshes, loop);

// Активуємо Debug UI
createDebugPanel(meshes, lights, particles);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

renderer.setSize(window.innerWidth, window.innerHeight);
loop.start();