import Line = Phaser.GameObjects.Line;
import { InputSocket } from 'entity/pipeSystem/InputSocket';
import { OutputSocket } from 'entity/pipeSystem/OutputSocket';
import { Depths } from 'enums/Depths';
import { SplitterTarget } from 'enums/SplitterTarget';
import GameScene from 'scenes/GameScene';

export default class PipeVisual extends Line {

    private inputSocket: InputSocket;
    private outputSocket: OutputSocket;
    private splitterTarget: SplitterTarget|null = null;

    constructor (scene: GameScene, x1: number, y1: number, x2: number, y2: number, input: InputSocket, output: OutputSocket, splitterTarget: SplitterTarget|null = null) {
        super(scene, 0, 0, x1, y1, x2, y2, 0x6f6f8d, 1);
        scene.add.existing(this);

        this.splitterTarget = splitterTarget;
        this.setLineWidth(2);
        this.setOrigin(0, 0);
        this.inputSocket = input;
        this.outputSocket = output;

        this.setDepth(Depths.PIPES);
    }

    destroy (onlyInput: boolean = false) {
        this.inputSocket.disconnect(onlyInput);
        this.outputSocket.disconnect(onlyInput, this.splitterTarget);
        super.destroy(true);
    }
}
