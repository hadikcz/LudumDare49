import Container = Phaser.GameObjects.Container;
import GameScene from "scenes/GameScene";
import {Depths} from "enums/Depths";
import Shadows from "config/Shadows";
import GameConfig from "config/GameConfig";
import Sprite = Phaser.GameObjects.Sprite;

export default class Tree extends Container {

    protected scene: GameScene;
    private shadow!: Sprite;

    constructor (scene: GameScene, x: number, y: number, image: string) {
        super(scene, x, y, []);
        scene.add.existing(this);

        this.scene = scene;
        this.setDepth(Depths.TREE);

        this.createShadow(image);
        this.createTree(image);
    }

    private createTree(image: string): void {
        let treeImage = this.scene.add.sprite(0, 0, 'assets', image)
            .setDepth(Depths.BUILDINGS);
        this.add(treeImage);
    }

    private createShadow(image: string): void {
        let shadowFrame = image + '_shadow';

        let shadowCoords = Shadows[image];
        if (shadowCoords === undefined) {
            console.error('no shadow data');
            shadowCoords = {
                x: 0,
                y: 0
            };
        }

        let shadow = this.scene.add.sprite(this.x + shadowCoords.x, this.y + shadowCoords.y, 'assets', shadowFrame)
            .setDepth(Depths.SHADOW_UNDER)
            .setAlpha(GameConfig.shadowAlpha);
        // this.add(shadow);
    }

    destroy(fromScene?: boolean) {
        super.destroy(fromScene);
        this.shadow.destroy();
    }
}
