import * as THREE from 'three';
import gsap from 'gsap';

export function setupInteraction(camera, meshes, loop) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let currentIntersect = null; 

    // Отримуємо нормалізовані координати миші (від -1 до 1) [cite: 4806]
    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Обробка кліку [cite: 4825]
    window.addEventListener('click', () => {
        if (currentIntersect) {
            // Якщо клікнули по 3D тексту
            if (meshes.text && currentIntersect.object === meshes.text) {
                // Анімація GSAP: текст підстрибує вгору і крутиться
                gsap.to(meshes.text.position, { duration: 0.5, y: meshes.text.position.y + 1, yoyo: true, repeat: 1 });
                gsap.to(meshes.text.rotation, { duration: 1, y: meshes.text.rotation.y + Math.PI * 2 });
            }
            // Якщо клікнули по собору (перевіряємо, чи належить меш до групи собору) [cite: 4896]
            else if (meshes.cathedral) {
                // GSAP Анімація: Собор робить ефект "серцебиття" (збільшується і зменшується)
                gsap.to(meshes.cathedral.scale, { duration: 0.3, x: 1.05, y: 1.05, z: 1.05, yoyo: true, repeat: 1 });
            }
        }
    });

    // Додаємо Рейкастер до загального циклу оновлення
    const interactionTicker = {
        tick: () => {
            // Оновлюємо промінь відповідно до камери та миші [cite: 4810]
            raycaster.setFromCamera(mouse, camera);

            // Масив об'єктів для перевірки
            const objectsToTest = [];
            if (meshes.text) objectsToTest.push(meshes.text);
            if (meshes.cathedral) objectsToTest.push(meshes.cathedral);

            // Перевіряємо перетини (true - для рекурсивної перевірки всіх деталей собору) [cite: 4896]
            const intersects = raycaster.intersectObjects(objectsToTest, true);

            if (intersects.length) {
                if (!currentIntersect) {
                    // Подія Mouse Enter (змінюємо курсор на "палець")
                    document.body.style.cursor = 'pointer';
                }
                currentIntersect = intersects[0];
            } else {
                if (currentIntersect) {
                    // Подія Mouse Leave (повертаємо звичайний курсор)
                    document.body.style.cursor = 'default';
                }
                currentIntersect = null;
            }
        }
    };

    loop.updatables.push(interactionTicker);
}