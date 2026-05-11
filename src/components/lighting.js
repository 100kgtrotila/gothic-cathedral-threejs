import { AmbientLight, DirectionalLight } from 'three';

export function createLights() {
    // Дуже слабке фонове світло холодного відтінку
    const ambientLight = new AmbientLight('#445588', 0.2); 

    // Головне "місячне" світло, що відкидає тіні [cite: 421, 426]
    const moonLight = new DirectionalLight('#88aaff', 2.0);
    moonLight.position.set(-10, 15, 10);
    
    // Налаштування тіней [cite: 430, 448]
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 2048; // Висока роздільна здатність тіней
    moonLight.shadow.mapSize.height = 2048;
    moonLight.shadow.camera.near = 0.5;
    moonLight.shadow.camera.far = 50;
    moonLight.shadow.camera.left = -15;
    moonLight.shadow.camera.right = 15;
    moonLight.shadow.camera.top = 15;
    moonLight.shadow.camera.bottom = -15;
    moonLight.shadow.bias = -0.001; // Запобігає артефактам "shadow acne" [cite: 504, 508]

    return [ambientLight, moonLight];
}