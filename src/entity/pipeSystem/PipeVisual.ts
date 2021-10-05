import { BalancerTarget } from 'entity/pipeSystem/BalancerTarget';
import { InputSocket } from 'entity/pipeSystem/InputSocket';
import { OutputSocket } from 'entity/pipeSystem/OutputSocket';
import { Depths } from 'enums/Depths';
import { SplitterTarget } from 'enums/SplitterTarget';
import GameScene from 'scenes/GameScene';
import Container = Phaser.GameObjects.Container;
import Vector2 = Phaser.Math.Vector2;

export default class PipeVisual extends Container {

    private inputSocket: InputSocket;
    private outputSocket: OutputSocket;
    private splitterBalancerTarget: SplitterTarget|BalancerTarget|null = null;
    public scene: GameScene;

    private lines: Phaser.GameObjects.Line[] = [];

    constructor (scene: GameScene, position: Vector2[], input: InputSocket, output: OutputSocket, splitterBalancerTarget: SplitterTarget|BalancerTarget|null = null) {
        super(scene, -100, -100, []);
        scene.add.existing(this);

        this.scene = scene;
        for (let i = 0; i < position.length; i++) {
            if (position[i + 1] === undefined) break;
            const x1 = position[i].x;
            const y1 = position[i].y;
            const x2 = position[i + 1].x;
            const y2 = position[i + 1].y;
            const line = this.scene.add.line(0, 0, x1, y1, x2, y2, 0x6f6f8d, 1);

            line.setLineWidth(2);
            line.setOrigin(0, 0);
            line.setDepth(Depths.PIPES);
            this.lines.push(line);
        }

        this.splitterBalancerTarget = splitterBalancerTarget;
        this.inputSocket = input;
        this.outputSocket = output;

    }

    setStrokeStyle (width: number, color: number): void {
        for (let line of this.lines) {
            line.setStrokeStyle(width, color);
        }
    }

    destroy (destroyInput: boolean = false, destroyOutput: boolean = false): void {
        if (destroyInput) {
            this.inputSocket.disconnect(true, destroyOutput);
        }
        if (destroyOutput) {
            this.outputSocket.disconnect(false, true, this.splitterBalancerTarget);
        }

        for (let line of this.lines) {
            line.destroy();
        }
        super.destroy(true);
    }
}
