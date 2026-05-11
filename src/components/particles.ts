import { BufferGeometry, BufferAttribute, PointsMaterial, Points } from 'three';
import { Updatable } from '../core/loop';

export type UpdatablePoints = Points<BufferGeometry, PointsMaterial> & Updatable;

export function createParticles(): UpdatablePoints {
  const particlesCount = 1800;
  const positions = new Float32Array(particlesCount * 3);
  const baseY = new Float32Array(particlesCount);

  for (let i = 0; i < particlesCount; i++) {
    const i3 = i * 3;
    const radius = Math.random() * 24;
    const angle = Math.random() * Math.PI * 2;
    positions[i3] = Math.cos(angle) * radius;
    positions[i3 + 1] = Math.random() * 11 - 1.5;
    positions[i3 + 2] = Math.sin(angle) * radius;
    baseY[i] = positions[i3 + 1];
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));

  const material = new PointsMaterial({
    color: '#f3e8c8',
    size: 0.045,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
  });

  const particles = new Points(geometry, material) as UpdatablePoints;

  particles.tick = (delta: number, elapsedTime: number) => {
    particles.rotation.y += delta * 0.025;
    const positionAttribute = particles.geometry.getAttribute('position') as BufferAttribute;
    for (let i = 0; i < particlesCount; i++) {
      positionAttribute.array[i * 3 + 1] = baseY[i] + Math.sin(elapsedTime * 0.35 + i * 0.1) * 0.15;
    }
    positionAttribute.needsUpdate = true;
  };

  return particles;
}
