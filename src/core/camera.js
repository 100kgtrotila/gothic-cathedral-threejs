import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createCamera(canvas) {
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
    camera.position.set(0, 5, 15); // Відсуваємо камеру назад і вгору, щоб помістився собор

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // Не даємо камері опускатися глибоко під землю

    return { camera, controls };
}