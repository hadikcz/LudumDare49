import Container = Phaser.GameObjects.Container;
import GameScene from "scenes/GameScene";
import {Depths} from "enums/Depths";
import Shadows from "config/Shadows";
import GameConfig from "config/GameConfig";

export default class Building extends Container {

    protected scene: GameScene;
    constructor (scene: GameScene, x: number, y: number, image: string) {
        super(scene, x, y, []);
        scene.add.existing(this);

        this.scene = scene;
        this.setDepth(Depths.BUILDINGS);


        let useTopShadow = false;
        let shadowFrame = '';
        if (image === 'factory1') {
            useTopShadow = true;
            shadowFrame = image + '_shadow_bottom';
        } else {
            shadowFrame = image + '_shadow';
        }

        let shadowCoords = Shadows[image];
        if (shadowCoords === undefined) {
            console.error('no shadow data');
            shadowCoords = {
                x: 0,
                y: 0
            };
        }

        let shadow = this.scene.add.sprite(0 + shadowCoords.x, 0 + shadowCoords.y, 'assets', shadowFrame)
            .setDepth(Depths.SHADOW_UNDER)
            .setAlpha(GameConfig.shadowAlpha);
        this.add(shadow);

        let buildingImage = this.scene.add.sprite(0, 0, 'assets', image)
            .setDepth(Depths.BUILDINGS);
        this.add(buildingImage);

        if (useTopShadow) {
            let shadowCoordsTop = Shadows[image + '_shadow_top'];
            if (shadowCoordsTop === undefined) {
                shadowCoordsTop = {
                    x: 0,
                    y: 0
                };
                console.error('shadow top cords not found');
            }
            let shadow = this.scene.add.sprite(0 + shadowCoordsTop.x, 0 + shadowCoordsTop.y, 'assets', image + '_shadow_top')
                .setDepth(Depths.SHADOW_TOP)
                .setAlpha(GameConfig.shadowAlpha);
            this.add(shadow);
        }

    }
}
