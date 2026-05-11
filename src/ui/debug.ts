import GUI from 'lil-gui';
import { ExportedMeshes } from '../components/sceneObjects';
import { UpdatablePoints } from '../components/particles';
import { MeshStandardMaterial } from 'three';
import { SceneLights } from '../components/lighting';

export function createDebugPanel(meshes: ExportedMeshes, lights: SceneLights, particles: UpdatablePoints): GUI {
  const gui = new GUI({ title: 'Gothic Cathedral - Debug' });

  const params = {
    textColor: '#88aaff',
    modelX: 0,
    modelY: -2.1,
    modelZ: -1.2,
    spinText: () => {
      if (meshes.text) meshes.text.rotation.y += Math.PI;
    },
  };

  gui.addColor(params, 'textColor').name('Text color').onChange((value: string) => {
    if (meshes.text) (meshes.text.material as MeshStandardMaterial).color.set(value);
  });

  gui.add(lights.mainLight, 'intensity').min(0).max(8).step(0.1).name('Light intensity');
  gui.add(lights.mainLight.position, 'x').min(-30).max(30).step(0.1).name('Light X');
  gui.add(lights.mainLight.position, 'y').min(1).max(40).step(0.1).name('Light Y');
  gui.add(lights.mainLight.position, 'z').min(-30).max(30).step(0.1).name('Light Z');
  gui.add(lights.mainLight.shadow, 'bias').min(-0.002).max(0.002).step(0.00001).name('Shadow bias');
  gui.add(lights.mainLight.shadow, 'normalBias').min(0).max(0.08).step(0.0005).name('Shadow normalBias');
  gui.add(lights.mainLight.shadow, 'radius').min(0).max(8).step(0.1).name('Shadow softness');

  const updateModelPosition = () => {
    if (!meshes.cathedral) return;
    meshes.cathedral.position.set(params.modelX, params.modelY, params.modelZ);
  };
  const modelFolder = gui.addFolder('Model position');
  modelFolder.add(params, 'modelX').min(-10).max(10).step(0.1).onChange(updateModelPosition);
  modelFolder.add(params, 'modelY').min(-8).max(8).step(0.1).onChange(updateModelPosition);
  modelFolder.add(params, 'modelZ').min(-10).max(10).step(0.1).onChange(updateModelPosition);

  gui.add(particles.material, 'size').min(0.01).max(0.15).step(0.005).name('Particle size');
  gui.add(particles, 'visible').name('Show particles');
  gui.add(params, 'spinText').name('Spin text');

  return gui;
}
