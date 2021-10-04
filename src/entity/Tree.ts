import Container = Phaser.GameObjects.Container;
import GameConfig from 'config/GameConfig';
import Shadows from 'config/Shadows';
import { Depths } from 'enums/Depths';
import GameScene from 'scenes/GameScene';
import Sprite = Phaser.GameObjects.Sprite;
import NumberHelpers from 'helpers/NumberHelpers';
import Vector2 = Phaser.Math.Vector2;
import TransformHelpers from 'helpers/TransformHelpers';
import Image = Phaser.GameObjects.Image;

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


        let moveVec = new Vector2(
            NumberHelpers.randomIntInRange(-5, 5),
            NumberHelpers.randomIntInRange(-5, 5)
        );
        this.scene.add.tween({
            targets: this,
            x: this.x + moveVec.x,
            y: this.y + moveVec.y,
            yoyo: true,
            repeat: Infinity,
            duration: NumberHelpers.randomIntInRange(5000, 8000)
        });

        this.scene.add.tween({
            targets: this.shadow,
            x: this.shadow.x + moveVec.x,
            y: this.shadow.y + moveVec.y,
            yoyo: true,
            repeat: Infinity,
            duration: NumberHelpers.randomIntInRange(5000, 8000)
        });
    }

    update (): void {
        const cleanFunction = (object: Image) => {
            if (object === undefined) return;
            if (object.active && TransformHelpers.getDistanceBetween(this.x, this.y, object.x, object.y) <= 40) {
                this.destroy(true);
            }
        };

        try {
            for (let child of this.scene.worldEnvironment.factoriesGroup.getChildren()) {
                cleanFunction(child as any as Image);
            }

            for (let child of this.scene.worldEnvironment.buildingsGroup.getChildren()) {
                cleanFunction(child as any as Image);
            }

            for (let child of this.scene.worldEnvironment.roadsGroup.getChildren()) {
                cleanFunction(child as any as Image);
            }

            for (let child of this.scene.worldEnvironment.heaterGroup.getChildren()) {
                cleanFunction(child as any as Image);
            }
        } catch (e) {

        }
    }

    private createTree (image: string): void {
        let treeImage = this.scene.add.sprite(0, 0, 'assets', image)
            .setDepth(Depths.BUILDINGS);
        this.add(treeImage);
    }

    private createShadow (image: string): void {
        let shadowFrame = image + '_shadow';

        let shadowCoords = Shadows[image];
        if (shadowCoords === undefined) {
            console.error('no shadow data');
            shadowCoords = {
                x: 0,
                y: 0
            };
        }

        this.shadow = this.scene.add.sprite(this.x + shadowCoords.x, this.y + shadowCoords.y, 'assets', shadowFrame)
            .setDepth(Depths.SHADOW_UNDER)
            .setAlpha(GameConfig.shadowAlpha);
        // this.add(shadow);
    }

    destroy (fromScene?: boolean) {
        super.destroy(fromScene);
        this.shadow.destroy();
    }
}
