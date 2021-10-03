import Polygon = Phaser.Geom.Polygon;
import GameScene from 'scenes/GameScene';
import Vector2 = Phaser.Math.Vector2;
import GameConfig from 'config/GameConfig';
import Tree from 'entity/Tree';
import ArrayHelpers from 'helpers/ArrayHelpers';
import NumberHelpers from 'helpers/NumberHelpers';
import Group = Phaser.GameObjects.Group;
import WorldEnvironment from 'core/WorldEnvironment';

export default class TreeSpawner {

    private scene: GameScene;
    private worldEnvironment: WorldEnvironment;
    private group: Group;

    constructor (scene: GameScene, worldEnvironment: WorldEnvironment) {
        this.scene = scene;
        this.worldEnvironment = worldEnvironment;

        this.group = this.scene.add.group();
        this.create();
    }

    update (): void {
        // @ts-ignore
        this.group.getChildren().forEach((tree: Tree) => {
            tree.update();
        });
    }

    private create (): void {
        for (let i = 0; i < 80; i++) {
            let spawnPoint = this.generateSpawnPoint();
            let treeIndex = this.generateTreeSpriteIndex();

            let tree = new Tree(this.scene, spawnPoint.x, spawnPoint.y, treeIndex);
            this.group.add(tree);
        }
    }

    private generateSpawnPoint (): Vector2 {
        let i = 0;
        while (true) {
            if (i >= 50) {
                break;
            }
            i++;

            const randomSpawn = new Vector2(
                NumberHelpers.randomIntInRange(0, GameConfig.World.size.width),
                NumberHelpers.randomIntInRange(0, GameConfig.World.size.height)
            );

            if (!this.worldEnvironment.isInRiver(randomSpawn.x, randomSpawn.y)) {
                return randomSpawn;
            }
        }

        console.info('tree spawn not foudn');
        return new Vector2(-1000, -1000);
    }

    private generateTreeSpriteIndex (): string {
        return ArrayHelpers.getRandomFromArray([
            'tree1',
            'tree2',
            'tree_large1',
            'tree_group'
        ]);
    }
}
