import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EquirectangularReflectionMapping, Group } from 'three';

export function createSceneObjects(scene) {
    const objectsGroup = new Group();
    scene.add(objectsGroup);

    // 1. Завантаження Карти оточення (HDR) для реалістичного відбиття 
    const rgbeLoader = new RGBELoader(); 
    rgbeLoader.load('/textures/environment/night_sky.hdr', (environmentMap) => {
        environmentMap.mapping = EquirectangularReflectionMapping; // [cite: 123]
        scene.environment = environmentMap; // [cite: 123]
        scene.background = environmentMap; // [cite: 123]
        scene.environmentIntensity = 0.3; // Робимо похмурий вечірній вайб [cite: 67]
    });

    // 2. Завантаження Моделі Собору 
    const gltfLoader = new GLTFLoader(); 
    let cathedralModel = null;

    gltfLoader.load('/models/cathedral/scene.glb', (gltf) => {
        cathedralModel = gltf.scene;
        
        // Масштабуємо модель (можливо, доведеться змінити значення залежно від твоєї моделі)
        cathedralModel.scale.set(1, 1, 1);
        cathedralModel.position.y = -2;

        // Вмикаємо тіні для кожного елемента моделі 
        cathedralModel.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true; 
                child.receiveShadow = true; 
            }
        });

        objectsGroup.add(cathedralModel);
    });

    // Повертаємо об'єкт для доступу з інших файлів (наприклад, для Raycaster)
    return { objectsGroup };
}