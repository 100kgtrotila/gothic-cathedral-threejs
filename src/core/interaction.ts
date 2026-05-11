import * as THREE from 'three';
import { Loop, Updatable } from './loop';
import { ExportedMeshes } from '../components/sceneObjects';

type EmissiveMaterial = THREE.MeshStandardMaterial | THREE.MeshPhongMaterial | THREE.MeshLambertMaterial;

export function setupInteraction(camera: THREE.PerspectiveCamera, meshes: ExportedMeshes, loop: Loop): void {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const originalEmissive = new WeakMap<THREE.Mesh, THREE.Color>();
  const originalEmissiveIntensity = new WeakMap<THREE.Mesh, number>();
  let hoveredMesh: THREE.Mesh | null = null;
  let currentIntersect: THREE.Intersection | null = null;

  const getEmissiveMaterial = (material: THREE.Material | THREE.Material[]): EmissiveMaterial | null => {
    const target = Array.isArray(material) ? material[0] : material;
    if ('emissive' in target && 'emissiveIntensity' in target) {
      return target as EmissiveMaterial;
    }
    return null;
  };

  const restoreHovered = () => {
    if (!hoveredMesh) return;
    const material = getEmissiveMaterial(hoveredMesh.material);
    if (material) {
      const emissive = originalEmissive.get(hoveredMesh);
      if (emissive) material.emissive.copy(emissive);
      material.emissiveIntensity = originalEmissiveIntensity.get(hoveredMesh) ?? 0;
    }
    hoveredMesh = null;
  };

  window.addEventListener('mousemove', (event: MouseEvent) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  window.addEventListener('mouseleave', () => {
    mouse.set(1000, 1000);
    currentIntersect = null;
    restoreHovered();
    document.body.style.cursor = 'default';
  });

  window.addEventListener('click', () => {
    if (!currentIntersect) return;
    const mesh = currentIntersect.object as THREE.Mesh;
    const clickedName = mesh.name || mesh.parent?.name || 'unnamed-cathedral-part';
    const material = getEmissiveMaterial(mesh.material);
    if (material) {
      material.emissive.set('#97b8ff');
      material.emissiveIntensity = 0.65;
    }
    console.info(`[Cathedral] Clicked element: ${clickedName}`, mesh);
  });

  const interactionTicker: Updatable = {
    tick: (_delta: number, elapsedTime: number) => {
      if (!meshes.cathedral) return;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(meshes.cathedral, true);

      if (intersects.length === 0) {
        document.body.style.cursor = 'default';
        currentIntersect = null;
        restoreHovered();
        return;
      }

      document.body.style.cursor = 'pointer';
      currentIntersect = intersects[0];
      const mesh = currentIntersect.object as THREE.Mesh;

      if (hoveredMesh !== mesh) {
        restoreHovered();
        hoveredMesh = mesh;
        const material = getEmissiveMaterial(mesh.material);
        if (material) {
          originalEmissive.set(mesh, material.emissive.clone());
          originalEmissiveIntensity.set(mesh, material.emissiveIntensity);
          material.emissive.set('#6f95ff');
        }
      }

      const hoveredMaterial = hoveredMesh ? getEmissiveMaterial(hoveredMesh.material) : null;
      if (hoveredMaterial) {
        hoveredMaterial.emissiveIntensity = 0.35 + Math.sin(elapsedTime * 6.5) * 0.12;
      }
    },
  };

  loop.updatables.push(interactionTicker);
}
