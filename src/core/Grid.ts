import GameScene from "scenes/GameScene";
import GameConfig from "config/GameConfig";
import {Depths} from "enums/Depths";

export default class Grid {

    private scene: GameScene;
    private static readonly settings = {
        width: 50,
        height: 50,
        offsetX: -2,
        offsetY: -2,
        alpha: 0.25,
        alpha2: 0.1,
        color: 0x000000,
        color2: 0x000000
    }

    constructor(scene: GameScene) {
        this.scene = scene;

        for (let x = 0; x < Math.ceil(GameConfig.World.size.width / Grid.settings.width); x++) {
            const realX = x * Grid.settings.width + Grid.settings.offsetX;

            this.scene.add.line(0,0, realX, 0, realX, GameConfig.World.size.height, Grid.settings.color, Grid.settings.alpha)
                .setDepth(Depths.GRID)
                .setOrigin(0)
                .setAlpha(Grid.settings.alpha);
        }

        for (let y = 0; y < Math.ceil(GameConfig.World.size.height / Grid.settings.height); y++) {
            const realY = y * Grid.settings.height + Grid.settings.offsetY;

            this.scene.add.line(0,0, 0, realY, GameConfig.World.size.width, realY, Grid.settings.color, Grid.settings.alpha)
                .setDepth(Depths.GRID)
                .setOrigin(0)
                .setAlpha(Grid.settings.alpha);
        }

        this.smallGrid();
    }

    private smallGrid(): void {
        for (let x = 0; x < Math.ceil(GameConfig.World.size.width / (Grid.settings.width / 2)); x++) {
            if (x % 2 === 0) continue;
            const realX = x * (Grid.settings.width / 2) + Grid.settings.offsetX;

            this.scene.add.line(0,0, realX, 0, realX, GameConfig.World.size.height, Grid.settings.color2, Grid.settings.alpha2)
                .setDepth(Depths.GRID)
                .setOrigin(0, 0)
                .setAlpha(Grid.settings.alpha);
        }

        for (let y = 0; y < Math.ceil(GameConfig.World.size.height / (Grid.settings.height / 2)); y++) {
            if (y % 2 === 0) continue;
            const realY = y * (Grid.settings.height / 2) + Grid.settings.offsetY;

            this.scene.add.line(0,0, 0, realY, (GameConfig.World.size.width ), realY, Grid.settings.color2, Grid.settings.alpha2)
                .setDepth(Depths.GRID)
                .setOrigin(0, 0)
                .setAlpha(Grid.settings.alpha);
        }
    }
}
