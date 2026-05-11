import { BufferGeometry, BufferAttribute, PointsMaterial, Points } from 'three';

export function createParticles() {
    const particlesCount = 3000;
    const positions = new Float32Array(particlesCount * 3);

    // Розкидаємо частинки випадковим чином навколо собору [cite: 2829, 2830]
    for(let i = 0; i < particlesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 40; 
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(positions, 3));

    const material = new PointsMaterial({
        color: '#aaaaaa',
        size: 0.07,
        sizeAttenuation: true, // Частинки вдалині будуть меншими [cite: 2818]
        transparent: true,
        opacity: 0.8,
        depthWrite: false // Запобігає багам з перекриттям прозорості [cite: 2869, 2870]
    });

    const particles = new Points(geometry, material);

    // Додаємо анімацію для частинок (буде викликатися у Loop.js) [cite: 2896]
    particles.tick = (delta, elapsedTime) => {
        particles.rotation.y = elapsedTime * 0.02; // Повільно крутяться як вихор
    };

    return particles;
}