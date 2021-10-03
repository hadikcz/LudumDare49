import GameScene from 'scenes/GameScene';
import Vector2 = Phaser.Math.Vector2;
import GameConfig from 'config/GameConfig';
import { Depths } from 'enums/Depths';

export default class Zone {

    private static readonly ZONE_CENTER = new Vector2(
        GameConfig.World.size.width / 2,
        GameConfig.World.size.height / 2
    );

private scene: GameScene;

    private zoneCircle: Phaser.GameObjects.Arc;

    constructor (scene: GameScene) {
        this.scene = scene;

        this.zoneCircle = this.scene.add.circle(Zone.ZONE_CENTER.x, Zone.ZONE_CENTER.y, 360, 0x00FF00, 0.25)
            .setDepth(Depths.ZONE);
    }
}
