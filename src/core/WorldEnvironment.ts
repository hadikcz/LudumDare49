import GameScene from 'scenes/GameScene';
import Grid from "core/Grid";
import {Depths} from "enums/Depths";
import Building from "entity/Building";
import TreeSpawner from "core/TreeSpawner";
import TiledObject = Phaser.Types.Tilemaps.TiledObject;
import Editor from "core/editor/Editor";

export default class WorldEnvironment {

    private scene: GameScene;
    private map: Phaser.Tilemaps.Tilemap;
    private riverRectangles: Phaser.Geom.Rectangle[] = [];

    private editor: Editor;

    constructor (scene: GameScene) {
        this.scene = scene;
        this.scene.add.image(0, 0, 'bg')
            .setOrigin(0, 0)
            .setDepth(Depths.BG_TEXTURE);


        this.map = this.scene.make.tilemap({ key: 'map' });
        this.prepareRiverLayer();

        new Grid(this.scene);
        // new Building(this.scene, 600, 600, 'heating_plant');
        new TreeSpawner(this.scene, this);

        this.editor = new Editor(this.scene);

        // this.scene.add.image(100, 109, 'assets', 'road_vertical').setDepth(Depths.ROAD);
    }

    isInRiver(x: number, y: number): boolean {
        for (let rectangle of this.riverRectangles) {
            if (rectangle.contains(x, y)) {
                return true;
            }
        }

        return false;
    }

    private prepareRiverLayer(): void {
        const layer = this.map.getObjectLayer('not_spawn_tree');

        if (layer === undefined || layer.objects.length === 0) {
            throw new Error('river poly not found');
        } else {
            this.riverRectangles = layer.objects.map((object: TiledObject) => {
                const rect = new Phaser.Geom.Rectangle(object.x, object.y, object.width, object.height);
                // console.log(rect.x, rect.y);
                // this.scene.add.rectangle(object.x, object.y, object.width, object.height, 0xFF0000, 1).setDepth(Depths.UI).setOrigin(0);
                return rect;
            });
        }
    }

}
