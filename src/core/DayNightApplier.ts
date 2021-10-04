import GameConfig from 'config/GameConfig';
import { Depths } from 'enums/Depths';
import { Events } from 'enums/Events';
import GameScene from 'scenes/GameScene';

export default class DayNightApplier {

    private static readonly MAX_ALPHA = 0.4;
    private static readonly NIGHT_TWEEN_TIME = 10000;

    private scene: GameScene;
    private nightRectangle: Phaser.GameObjects.Rectangle;

    constructor (scene: GameScene) {
        this.scene = scene;

        this.nightRectangle = this.scene.add.rectangle(0, 0, GameConfig.World.size.width, GameConfig.World.size.height, 0x000000, 1)
            .setOrigin(0)
            .setAlpha(0)
            .setDepth(Depths.NIGHT);

        this.scene.events.on(Events.DAY_STARTED, this.dayStarted.bind(this));
        this.scene.events.on(Events.NIGHT_STARTED, this.nightStarted.bind(this));
    }

    private dayStarted (): void {
        this.scene.add.tween({
            targets: this.nightRectangle,
            alpha: 0,
            duration: DayNightApplier.NIGHT_TWEEN_TIME
        });
    }

    private nightStarted (): void {
        this.scene.add.tween({
            targets: this.nightRectangle,
            alpha: DayNightApplier.MAX_ALPHA,
            duration: DayNightApplier.NIGHT_TWEEN_TIME
        });
    }
}
