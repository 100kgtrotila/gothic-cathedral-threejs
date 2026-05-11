import {
  BoxGeometry,
  CanvasTexture,
  EquirectangularReflectionMapping,
  Group,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  RepeatWrapping,
  Scene,
  SRGBColorSpace,
  type Material,
  type Texture,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import helvetikerRegular from 'three/examples/fonts/helvetiker_regular.typeface.json';

export interface ExportedMeshes {
  objectsGroup: Group;
  cathedral?: Group;
  text?: Mesh;
}

function createGroundTextures(): { colorMap: Texture; bumpMap: Texture } {
  const size = 512;

  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const colorCtx = colorCanvas.getContext('2d');
  if (!colorCtx) throw new Error('Cannot create ground color texture context');
  colorCtx.fillStyle = '#2a2f3a';
  colorCtx.fillRect(0, 0, size, size);

  for (let i = 0; i < 35000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const alpha = 0.05 + Math.random() * 0.18;
    const tone = 35 + Math.floor(Math.random() * 40);
    colorCtx.fillStyle = `rgba(${tone}, ${tone + 4}, ${tone + 10}, ${alpha.toFixed(3)})`;
    colorCtx.fillRect(x, y, 2, 2);
  }

  for (let i = 0; i < 120; i++) {
    const x1 = Math.random() * size;
    const y1 = Math.random() * size;
    const x2 = x1 + (Math.random() - 0.5) * 80;
    const y2 = y1 + (Math.random() - 0.5) * 80;
    colorCtx.strokeStyle = `rgba(18, 20, 25, ${(0.12 + Math.random() * 0.22).toFixed(3)})`;
    colorCtx.lineWidth = 1 + Math.random() * 1.5;
    colorCtx.beginPath();
    colorCtx.moveTo(x1, y1);
    colorCtx.lineTo(x2, y2);
    colorCtx.stroke();
  }

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bumpCtx = bumpCanvas.getContext('2d');
  if (!bumpCtx) throw new Error('Cannot create ground bump texture context');
  bumpCtx.fillStyle = 'rgb(128, 128, 128)';
  bumpCtx.fillRect(0, 0, size, size);

  for (let i = 0; i < 45000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const shade = 90 + Math.floor(Math.random() * 90);
    bumpCtx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
    bumpCtx.fillRect(x, y, 1, 1);
  }

  const colorMap = new CanvasTexture(colorCanvas);
  colorMap.colorSpace = SRGBColorSpace;
  colorMap.wrapS = RepeatWrapping;
  colorMap.wrapT = RepeatWrapping;
  colorMap.repeat.set(36, 36);

  const bumpMap = new CanvasTexture(bumpCanvas);
  bumpMap.wrapS = RepeatWrapping;
  bumpMap.wrapT = RepeatWrapping;
  bumpMap.repeat.set(36, 36);

  return { colorMap, bumpMap };
}

function configureModelShading(root: Group): void {
  const tuneMaterial = (material: Material): void => {
    if (material instanceof MeshStandardMaterial) {
      material.envMapIntensity = 1.1;
      if (material.roughness < 0.05) material.roughness = 0.25;
      if (material.metalness > 0.95) material.metalness = 0.85;
    }
  };

  root.traverse((child) => {
    if (child instanceof Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      if (Array.isArray(child.material)) {
        child.material.forEach(tuneMaterial);
      } else {
        tuneMaterial(child.material);
      }
    }
  });
}

export function createSceneObjects(scene: Scene): ExportedMeshes {
  const objectsGroup = new Group();
  scene.add(objectsGroup);

  const exportedMeshes: ExportedMeshes = { objectsGroup };

  const rgbeLoader = new RGBELoader();
  rgbeLoader.load('/textures/kloppenheim_02_puresky_4k.hdr', (environmentMap) => {
    environmentMap.mapping = EquirectangularReflectionMapping;
    scene.environment = environmentMap;
    scene.background = environmentMap;
    scene.environmentIntensity = 0.55;
  });

  const { colorMap, bumpMap } = createGroundTextures();
  const floor = new Mesh(
    new PlaneGeometry(260, 260),
    new MeshStandardMaterial({
      color: '#3b404b',
      map: colorMap,
      bumpMap,
      bumpScale: 0.18,
      roughness: 0.95,
      metalness: 0.02,
    }),
  );
  floor.rotation.x = -Math.PI * 0.5;
  floor.position.y = -2.3;
  floor.receiveShadow = true;
  scene.add(floor);

  const gltfLoader = new GLTFLoader();

  gltfLoader.load('/models/gothic_cathedral.glb', (gltf) => {
    const cathedral = gltf.scene;
    cathedral.scale.set(1, 1, 1);
    cathedral.position.set(0, 0.3, -1.2);
    cathedral.rotation.set(0, 0, 0);
    configureModelShading(cathedral);
    objectsGroup.add(cathedral);
    exportedMeshes.cathedral = cathedral;
  });

  gltfLoader.load('/models/gargoyle__8.5k_tris.glb', (gltf) => {
    const gargoyleLeft = gltf.scene;
    configureModelShading(gargoyleLeft);
    gargoyleLeft.scale.set(1.7, 1.7, 1.7);
    gargoyleLeft.position.set(-4.9, -3.0, 5.4);
    gargoyleLeft.rotation.y = Math.PI * 0.28;
    objectsGroup.add(gargoyleLeft);

    const gargoyleRight = gltf.scene.clone(true);
    configureModelShading(gargoyleRight);
    gargoyleRight.scale.set(1.7, 1.7, 1.7);
    gargoyleRight.position.set(4.9, -3.0, 5.35);
    gargoyleRight.rotation.y = -Math.PI * 0.28;
    objectsGroup.add(gargoyleRight);
  });

  gltfLoader.load('/models/street_lamp.glb', (gltf) => {
    const lampLeft = gltf.scene;
    configureModelShading(lampLeft);
    lampLeft.scale.set(0.01, 0.01, 0.01);
    lampLeft.position.set(-9.5, -2.25, 9.2);
    lampLeft.rotation.y = Math.PI * 0.08;
    objectsGroup.add(lampLeft);

    const lampRight = gltf.scene.clone(true);
    configureModelShading(lampRight);
    lampRight.scale.set(0.01, 0.01, 0.01);
    lampRight.position.set(9.5, -2.25, 9.15);
    lampRight.rotation.y = -Math.PI * 0.08;
    objectsGroup.add(lampRight);
  });

  const font = new FontLoader().parse(helvetikerRegular);
  const textGeometry = new TextGeometry('Bloodborne', {
    font,
    size: 1.05,
    depth: 0.3,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.03,
    bevelSegments: 5,
  });
  textGeometry.center();

  const textMaterial = new MeshStandardMaterial({ color: '#ffffff', metalness: 0.6, roughness: 0.18 });
  const textMesh = new Mesh(textGeometry, textMaterial);
  textMesh.position.set(0, 6.4, 5.6);
  textMesh.castShadow = true;
  textMesh.receiveShadow = true;

  const crossesGroup = new Group();
  const verticalGeometry = new BoxGeometry(0.2, 1.5, 0.2);
  const horizontalGeometry = new BoxGeometry(0.85, 0.18, 0.2);
  const crossMaterial = new MeshStandardMaterial({ color: '#3b3f4a', roughness: 0.9, metalness: 0.05 });

  for (let i = 0; i < 8; i++) {
    const cross = new Group();
    const vertical = new Mesh(verticalGeometry, crossMaterial);
    const horizontal = new Mesh(horizontalGeometry, crossMaterial);
    horizontal.position.y = 0.34;
    vertical.castShadow = true;
    vertical.receiveShadow = true;
    horizontal.castShadow = true;
    horizontal.receiveShadow = true;
    cross.add(vertical, horizontal);

    const side = i % 2 === 0 ? -1 : 1;
    const index = Math.floor(i / 2);
    cross.position.set(side * (7.3 + index * 0.45), -1.58, -4.5 + index * 2.7);
    cross.rotation.y = side > 0 ? Math.PI * 0.15 : -Math.PI * 0.15;
    crossesGroup.add(cross);
  }

  objectsGroup.add(textMesh);
  objectsGroup.add(crossesGroup);
  exportedMeshes.text = textMesh;

  return exportedMeshes;
}
