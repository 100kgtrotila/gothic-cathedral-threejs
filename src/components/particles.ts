import { BufferGeometry, BufferAttribute, PointsMaterial, Points } from 'three';
import { Updatable } from '../core/loop';

export type UpdatablePoints = Points<BufferGeometry, PointsMaterial> & Updatable;

export function createParticles(): UpdatablePoints {
  const particlesCount = 3000;
  const positions = new Float32Array(particlesCount * 3);
  const fallSpeeds = new Float32Array(particlesCount);
  const minY = -2.2;
  const maxY = 18;
  const areaSize = 90;

  for (let i = 0; i < particlesCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * areaSize;
    positions[i3 + 1] = Math.random() * (maxY - minY) + minY;
    positions[i3 + 2] = (Math.random() - 0.5) * areaSize;
    fallSpeeds[i] = 8 + Math.random() * 9;
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));

  const material = new PointsMaterial({
    color: '#a8c5ff',
    size: 0.03,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
  });

  const particles = new Points(geometry, material) as UpdatablePoints;

  particles.tick = (delta: number, elapsedTime: number) => {
    const positionAttribute = particles.geometry.getAttribute('position') as BufferAttribute;

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      const sway = Math.sin(elapsedTime * 1.1 + i * 0.17) * 0.25;
      positionAttribute.array[i3] += sway * delta;
      positionAttribute.array[i3 + 1] -= fallSpeeds[i] * delta;

      if (positionAttribute.array[i3 + 1] < minY) {
        positionAttribute.array[i3 + 1] = maxY;
        positionAttribute.array[i3] = (Math.random() - 0.5) * areaSize;
        positionAttribute.array[i3 + 2] = (Math.random() - 0.5) * areaSize;
      }
    }

    positionAttribute.needsUpdate = true;
  };

  return particles;
}
