import GameScene from 'scenes/GameScene';
import Vector2 = Phaser.Math.Vector2;
import GameConfig from 'config/GameConfig';
import WorldEnvironment from 'core/WorldEnvironment';
import Building from 'entity/Building';
import { Depths } from 'enums/Depths';
import TransformHelpers from 'helpers/TransformHelpers';
import GameObject = Phaser.GameObjects.GameObject;
import Image = Phaser.GameObjects.Image;

declare let __DEV__: any;
export default class Zone {

    private static readonly ZONE_CENTER = new Vector2(
        GameConfig.World.size.width / 2,
        GameConfig.World.size.height / 2
    );

    private static readonly BEGIN_RADIUS = 80;
    private visibleCircle = false;

    private scene: GameScene;

    private zoneCircle: Phaser.GameObjects.Arc;

    private radius = Zone.BEGIN_RADIUS;
    private worldEnvironment: WorldEnvironment;

    constructor (scene: GameScene, worldEnvironment: WorldEnvironment) {
        this.scene = scene;
        this.worldEnvironment = worldEnvironment;

        if (!__DEV__) {
            this.visibleCircle = false;
        }

        this.zoneCircle = this.scene.add.circle(Zone.ZONE_CENTER.x, Zone.ZONE_CENTER.y, this.radius, 0x00FF00, 0.25 )
            .setDepth(Depths.ZONE);

        if (!this.visibleCircle) {
            this.zoneCircle.setVisible(false);
            this.zoneCircle.setActive(false);
        }


        this.updateBuildingsInRadius();
        setInterval(() => {
            this.radius += 10;
            this.zoneCircle.setRadius(this.radius);

            this.updateBuildingsInRadius();
        }, 1000);
    }

    private updateBuildingsInRadius (): void {
        const processBuilding = (building: Building) => {
            if (TransformHelpers.getDistanceBetween(Zone.ZONE_CENTER.x, Zone.ZONE_CENTER.y, building.x, building.y) > this.radius) {
                building.disable();
            } else {
                building.enable();
            }
        };

        this.worldEnvironment.roadsGroup.getChildren().forEach((image: Image) => {

            if (TransformHelpers.getDistanceBetween(Zone.ZONE_CENTER.x, Zone.ZONE_CENTER.y, image.x, image.y) > this.radius) {
                image.setVisible(false);
                image.setActive(false);
            } else {
                image.setVisible(true);
                image.setActive(true);
            }
        });
        this.worldEnvironment.buildingsGroup.getChildren().forEach(processBuilding);
        this.worldEnvironment.factoriesGroup.getChildren().forEach(processBuilding);
    }
}
