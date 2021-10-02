import GameScene from "scenes/GameScene";
import GameConfig from "config/GameConfig";
import {Depths} from "enums/Depths";

export default class Grid {

    private scene: GameScene;

    constructor(scene: GameScene) {
        this.scene = scene;

        const width = 50;
        const height = 50;
        const offsetX = -2;
        const offsetY = -2;
        const alpha = 0.2;
        const color = 0x000000;

        for (let x = 0; x < Math.ceil(GameConfig.World.size.width / width); x++) {
            const realX = x * width + offsetX;

            this.scene.add.line(0,0, realX, 0, realX, GameConfig.World.size.height, color, alpha)
                .setDepth(Depths.GRID)
                .setOrigin(0)
                .setAlpha(alpha);
        }

        for (let y = 0; y < Math.ceil(GameConfig.World.size.height / height); y++) {
            const realY = y * height + offsetY;

            this.scene.add.line(0,0, 0, realY, GameConfig.World.size.width, realY, color, alpha)
                .setDepth(Depths.GRID)
                .setOrigin(0)
                .setAlpha(alpha);
        }
    }
}
