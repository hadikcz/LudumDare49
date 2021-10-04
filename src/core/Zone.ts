import GameScene from 'scenes/GameScene';
import Vector2 = Phaser.Math.Vector2;
import GameConfig from 'config/GameConfig';
import WorldEnvironment from 'core/WorldEnvironment';
import Building from 'entity/Building';
import { Depths } from 'enums/Depths';
import TransformHelpers from 'helpers/TransformHelpers';
import Image = Phaser.GameObjects.Image;

declare let __DEV__: any;
export default class Zone {

    private static readonly ZONE_CENTER = new Vector2(
        GameConfig.World.size.width / 2,
        GameConfig.World.size.height / 2
    );

    private static readonly BEGIN_RADIUS = 80;
    private visibleCircle = true;

    private scene: GameScene;

    private zoneCircle: Phaser.GameObjects.Arc;

    private radius = Zone.BEGIN_RADIUS;
    private worldEnvironment: WorldEnvironment;
    private interval: NodeJS.Timeout;

    constructor (scene: GameScene, worldEnvironment: WorldEnvironment) {
        this.scene = scene;
        this.worldEnvironment = worldEnvironment;

        if (!__DEV__) {
            this.visibleCircle = false;
        } else {
            // dev - full city
            this.radius = 1000;
            // this.radius = 200;
        }

        this.zoneCircle = this.scene.add.circle(Zone.ZONE_CENTER.x, Zone.ZONE_CENTER.y, this.radius, 0x00FF00, 0.25 )
            .setDepth(Depths.ZONE);

        if (!this.visibleCircle) {
            this.zoneCircle.setVisible(false);
            this.zoneCircle.setActive(false);
        }


        this.updateBuildingsInRadius();
        this.interval = setInterval(() => {
            if (this.scene.pause.isPaused()) return;

            this.radius += 0.01; // real
            // this.radius += 2.5; // dev - test
            this.zoneCircle.setRadius(this.radius);

            this.updateBuildingsInRadius();

            if (this.radius >= 900) {
                clearInterval(this.interval);
                this.zoneCircle.destroy(true);
            }
        }, 100);
    }

    private updateBuildingsInRadius (): void {
        const processBuilding = (building: Building) => {
            try {

                if (TransformHelpers.getDistanceBetween(Zone.ZONE_CENTER.x, Zone.ZONE_CENTER.y, building.x, building.y) > this.radius) {
                    building.disable();
                } else {
                    building.enable();
                }
            } catch (e) {
                console.error(e);
            }
        };

        // @ts-ignore
        this.worldEnvironment.roadsGroup.getChildren().forEach((image: Image) => {
            if (TransformHelpers.getDistanceBetween(Zone.ZONE_CENTER.x, Zone.ZONE_CENTER.y, image.x, image.y) > this.radius) {
                image.setVisible(false);
                image.setActive(false);
            } else {
                image.setVisible(true);
                image.setActive(true);
            }
        });
        // @ts-ignore
        this.worldEnvironment.buildingsGroup.getChildren().forEach(processBuilding);
        // @ts-ignore
        this.worldEnvironment.factoriesGroup.getChildren().forEach(processBuilding);
    }
}
