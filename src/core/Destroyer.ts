import WorldEnvironment from 'core/WorldEnvironment';
import GameScene from 'scenes/GameScene';

export default class Destroyer {

    private scene: GameScene;
    private worldEnvironment: WorldEnvironment;

    private destroyMode: boolean = false;

    constructor (scene: GameScene, worldEnvironment: WorldEnvironment) {
        this.scene = scene;
        this.worldEnvironment = worldEnvironment;


        this.scene.input.on('pointerdown', (pointer, obj) => {
            if (!this.isDestroyMode()) return;
            this.finishBuilding(pointer.worldX, pointer.worldY);
        });
    }

    startDestroy (): void {
        if (this.isDestroyMode()) return;

        this.destroyMode = true;

        this.scene.ui.showDestroyMode();
    }

    isDestroyMode (): boolean {
        return this.destroyMode;
    }

    finishBuilding (worldX: number, worldY: number): void {
        if (!this.isDestroyMode()) return;
        this.cancelBuilding();
    }

    cancelBuilding (): void {
        this.destroyMode = false;
        this.scene.ui.hideDestroyMode();
    }
}
