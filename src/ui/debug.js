import GUI from 'lil-gui';

export function createDebugPanel(meshes, lights, particles) {
    const gui = new GUI({ title: 'Готичний Собор - Налаштування' });

    const params = {
        textColor: '#88aaff',
        spinText: () => {
            // Ручна анімація через кнопку
            if (meshes.text) meshes.text.rotation.y += Math.PI;
        }
    };

    // 1. Зміна кольору тексту (Обов'язкова умова)
    gui.addColor(params, 'textColor').name('Колір Тексту').onChange((value) => {
        if (meshes.text) meshes.text.material.color.set(value);
    });

    // 2. Інтенсивність головного світла (місяця)
    if (lights.length > 1) {
        gui.add(lights[1], 'intensity').min(0).max(10).step(0.1).name('Яскравість Місяця');
    }

    // Якщо ми додали частинки (туман/світлячки)
    if (particles) {
        // 3. Розмір частинок
        gui.add(particles.material, 'size').min(0.01).max(0.2).step(0.01).name('Розмір частинок');
        // 4. Перемикач видимості
        gui.add(particles, 'visible').name('Показувати туман');
    }

    // 5. Кнопка для обертання
    gui.add(params, 'spinText').name('Обернути текст');

    return gui;
}