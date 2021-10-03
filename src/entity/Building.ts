import Container = Phaser.GameObjects.Container;
import GameScene from "scenes/GameScene";
import {Depths} from "enums/Depths";
import Shadows from "config/Shadows";
import GameConfig from "config/GameConfig";
import ArrayHelpers from "helpers/ArrayHelpers";
import Vector2 = Phaser.Math.Vector2;
import SmokeSource from "config/SmokeSource";

export default class Building extends Container {

    private static readonly INDUSTRIAL = [
        'factory1',
        'factory2',
        'factory3',
        'heating_plant',
    ]

    protected scene: GameScene;
    private frameName: string;

    private smokeSources: Vector2[] = [];

    constructor (scene: GameScene, x: number, y: number, image: string) {
        super(scene, x, y, []);
        scene.add.existing(this);

        this.scene = scene;
        this.frameName = image;
        this.setDepth(Depths.BUILDINGS);


        let useTopShadow = false;
        let shadowFrame = '';
        if (image === 'factory1' || image === 'factory3') {
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

        this.handleSmoke();
    }

    getFrameName(): string {
        return this.frameName;
    }


    private handleSmoke(): void {
        if (!this.isIndustrial()) return;

        if (this.smokeSources.length === 0) {
            let smokeSources = SmokeSource[this.frameName];
            if (smokeSources === undefined) {
                console.error('smoke soruces not found');
                return;
            }
            this.smokeSources = smokeSources;
        }

        setInterval(() => {
            for (let smokeSource of this.smokeSources) {
                this.scene.effectManager.launchSmoke(
                    this.x + smokeSource.x,
                    this.y + smokeSource.y
                );
            }
        }, 100);
    }

    private isIndustrial(): boolean {
        return ArrayHelpers.inArray(Building.INDUSTRIAL, this.frameName);
    }
}
