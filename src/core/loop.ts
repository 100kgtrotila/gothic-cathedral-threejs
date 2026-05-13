import { Clock, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

export interface Updatable {
    tick: (delta: number, elapsedTime: number) => void;
}

export class Loop {
    private camera: PerspectiveCamera;
    private scene: Scene;
    private renderer: WebGLRenderer;
    public updatables: Updatable[];
    private clock: Clock;

    constructor(camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.updatables = [];
        this.clock = new Clock();
    }

    public start(): void {
        this.renderer.setAnimationLoop(() => {
            this.tick();
            this.renderer.render(this.scene, this.camera);
        });
    }

    public stop(): void {
        this.renderer.setAnimationLoop(null);
    }

    private tick(): void {
        const delta = this.clock.getDelta();
        const elapsedTime = this.clock.getElapsedTime();

        for (const object of this.updatables) {
            object.tick(delta, elapsedTime);
        }
    }
}