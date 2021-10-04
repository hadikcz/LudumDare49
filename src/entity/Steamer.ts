import GameScene from 'scenes/GameScene';

export default class Steamer {

    private scene: GameScene;
    private steamInterval: NodeJS.Timeout|null = null;
    private x: number;
    private y: number;

    constructor (scene: GameScene, x: number, y: number) {
        this.scene = scene;
        this.x = x;
        this.y = y;
    }

    start (): void {
        if (this.steamInterval) return;

        this.steamInterval = setInterval(() => {
            this.scene.effectManager.launchSmoke(
                this.x,
                this.y,
                false,
                true,
                5
            );
        }, 250);
    }

    stop (): void {
        if (!this.steamInterval) return;
        clearInterval(this.steamInterval);
        this.steamInterval = null;
    }
}
