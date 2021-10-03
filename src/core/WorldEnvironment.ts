import Grid from 'core/Grid';
import TreeSpawner from 'core/TreeSpawner';
import { Depths } from 'enums/Depths';
import GameScene from 'scenes/GameScene';
import TiledObject = Phaser.Types.Tilemaps.TiledObject;
import Editor from 'core/editor/Editor';
import Zone from 'core/Zone';
import Group = Phaser.GameObjects.Group;

export default class WorldEnvironment {

    private scene: GameScene;
    private map: Phaser.Tilemaps.Tilemap;
    private riverRectangles: Phaser.Geom.Rectangle[] = [];

    private editor: Editor;
    private zone: Zone;

    public readonly buildingsGroup: Group;
    public readonly factoriesGroup: Group;
    public readonly roadsGroup: Group;
    public readonly heaterGroup: Group;
    public readonly splitters: Group
    private treeSpawner: TreeSpawner;

    constructor (scene: GameScene) {
        this.scene = scene;
        this.scene.add.image(0, 0, 'bg')
            .setOrigin(0, 0)
            .setDepth(Depths.BG_TEXTURE);


        this.map = this.scene.make.tilemap({ key: 'map' });
        this.prepareRiverLayer();

        new Grid(this.scene);
        this.treeSpawner = new TreeSpawner(this.scene, this);

        this.editor = new Editor(this.scene);

        this.buildingsGroup = this.editor.getLayerGroupByName('buildings');
        this.factoriesGroup = this.editor.getLayerGroupByName('factories');
        this.roadsGroup = this.editor.getLayerGroupByName('roads');
        this.heaterGroup = this.editor.getLayerGroupByName('heater');
        this.splitters = this.scene.add.group();

        this.zone = new Zone(this.scene, this);
    }

    update (): void {
        this.treeSpawner.update();
    }

    isInRiver (x: number, y: number): boolean {
        for (let rectangle of this.riverRectangles) {
            if (rectangle.contains(x, y)) {
                return true;
            }
        }

        return false;
    }

    private prepareRiverLayer (): void {
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
