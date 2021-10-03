import Polygon = Phaser.Geom.Polygon;
import GameScene from "scenes/GameScene";
import Vector2 = Phaser.Math.Vector2;
import ArrayHelpers from "helpers/ArrayHelpers";
import NumberHelpers from "helpers/NumberHelpers";
import GameConfig from "config/GameConfig";
import Tree from "entity/Tree";
import Group = Phaser.GameObjects.Group;

export default class TreeSpawner {

    private scene: GameScene;
    private notSpawnPolygon: Polygon;
    private group: Group;

    constructor(scene: GameScene, notSpawnPolygon: Polygon) {
        this.scene = scene;
        this.notSpawnPolygon = notSpawnPolygon;

        this.group = this.scene.add.group();
        this.create();
    }

    private create(): void {
        for (let i = 0; i < 100; i++) {
            let spawnPoint = this.generateSpawnPoint();
            let treeIndex = this.generateTreeSpriteIndex();

            let tree = new Tree(this.scene, spawnPoint.x, spawnPoint.y, treeIndex);
            this.group.add(tree);
        }
    }

    private generateSpawnPoint(): Vector2 {
        let i = 0;
        while(true) {
            if (i >= 50) {
                break;
            }
            i++;

            const randomSpawn = new Vector2(
                NumberHelpers.randomIntInRange(0, GameConfig.World.size.width),
                NumberHelpers.randomIntInRange(0, GameConfig.World.size.height)
            );

            console.log(this.notSpawnPolygon);
            console.log(this.notSpawnPolygon.contains(randomSpawn.x, randomSpawn.y));
            if (!this.notSpawnPolygon.contains(randomSpawn.x, randomSpawn.y)) {
                return randomSpawn;
            }
        }

        console.info('tree spawn not foudn');
        return new Vector2(-1000, -1000);
    }

    private generateTreeSpriteIndex(): string {
        return ArrayHelpers.getRandomFromArray([
            'tree1',
            'tree2',
            'tree_large1',
            'tree_group'
        ]);
    }
}
