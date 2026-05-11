import { MOUSE, PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Updatable } from './loop';

// Описуємо структуру того, що повертає функція
export interface CameraRig {
  camera: PerspectiveCamera;
  controls: OrbitControls & Updatable;
}

export function createCamera(canvas: HTMLCanvasElement): CameraRig {
  const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
  camera.position.set(0, 6.5, 18);

  const controls = new OrbitControls(camera, canvas) as CameraRig['controls'];
  controls.enableDamping = true;
  controls.autoRotate = false;
  controls.enableZoom = true;
  controls.zoomSpeed = 1.2;
  controls.enablePan = true;
  controls.panSpeed = 1.1;
  controls.screenSpacePanning = true;
  controls.mouseButtons = {
    LEFT: MOUSE.ROTATE,
    MIDDLE: MOUSE.DOLLY,
    RIGHT: MOUSE.PAN,
  };
  controls.maxPolarAngle = Math.PI / 2 + 0.1;
  controls.minDistance = 4;
  controls.maxDistance = 80;
  controls.target.set(0, 2, -1.2);
  controls.tick = () => controls.update();

  return { camera, controls };
}
