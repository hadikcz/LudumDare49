import GameScene from 'scenes/GameScene';
import Grid from "core/Grid";
import {Depths} from "enums/Depths";
import Building from "entity/Building";
import Polygon = Phaser.Geom.Polygon;
import TreeSpawner from "core/TreeSpawner";

export default class WorldEnvironment {

    private scene: GameScene;
    private map: Phaser.Tilemaps.Tilemap;
    private riverPolygon: Polygon;

    constructor (scene: GameScene) {
        this.scene = scene;
        this.scene.add.image(0, 0, 'bg')
            .setOrigin(0, 0)
            .setDepth(Depths.BG_TEXTURE);


        this.map = this.scene.make.tilemap({ key: 'map' });
        const layer = this.map.getObjectLayer('not_spawn_tree');
        const notSpawnTree = layer.objects[0];
        console.log(notSpawnTree);
        // notSpawnTree.polygon.

        if (notSpawnTree.polygon !== undefined) {
            // @ts-ignore
            this.riverPolygon = new Polygon(notSpawnTree.polygon);
        } else {
            throw new Error('river poly not found');
        }
        new Grid(this.scene);
        new Building(this.scene, 600, 600, 'heating_plant');
        new TreeSpawner(this.scene, this.riverPolygon);
    }

}
