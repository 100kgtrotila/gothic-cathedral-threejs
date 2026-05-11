import { AmbientLight, DirectionalLight, Object3D } from 'three';

export interface SceneLights {
  ambientLight: AmbientLight;
  mainLight: DirectionalLight;
  mainLightTarget: Object3D;
}

export function createLights(): SceneLights {
  const ambientLight = new AmbientLight('#4f5f87', 0.45);

  const mainLight = new DirectionalLight('#f5f7ff', 3.1);
  mainLight.position.set(-9, 20, 10);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.set(4096, 4096);
  mainLight.shadow.camera.near = 0.5;
  mainLight.shadow.camera.far = 45;
  mainLight.shadow.camera.left = -12;
  mainLight.shadow.camera.right = 12;
  mainLight.shadow.camera.top = 12;
  mainLight.shadow.camera.bottom = -12;
  mainLight.shadow.bias = -0.00012;
  mainLight.shadow.normalBias = 0.012;
  mainLight.shadow.radius = 2;

  const mainLightTarget = new Object3D();
  mainLightTarget.position.set(0, 0.6, 0);
  mainLight.target = mainLightTarget;

  return { ambientLight, mainLight, mainLightTarget };
}
