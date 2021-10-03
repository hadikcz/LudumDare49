import Line = Phaser.GameObjects.Line;
import GameScene from 'scenes/GameScene';

export default class PipeVisual extends Line {
    constructor (scene: GameScene, x1: number, y1: number, x2: number, y2: number) {
        super(scene, 0, 0, x1, y1, x2, y2);
    }
}
