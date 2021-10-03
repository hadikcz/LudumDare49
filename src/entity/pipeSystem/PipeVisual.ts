import Line = Phaser.GameObjects.Line;
import { InputSocket } from 'entity/pipeSystem/InputSocket';
import { OutputSocket } from 'entity/pipeSystem/OutputSocket';
import { Depths } from 'enums/Depths';
import GameScene from 'scenes/GameScene';

export default class PipeVisual extends Line {

    private inputSocket: InputSocket;
    private outputSocket: OutputSocket;

    constructor (scene: GameScene, x1: number, y1: number, x2: number, y2: number, input: InputSocket, output: OutputSocket) {
        super(scene, 0, 0, x1, y1, x2, y2, 0x6f6f8d, 1);
        scene.add.existing(this);

        this.setLineWidth(2);
        this.setOrigin(0, 0);
        this.inputSocket = input;
        this.outputSocket = output;

        this.setDepth(Depths.PIPES);
    }

    destroy (onlyInput: boolean = false) {
        super.destroy(true);

        this.inputSocket.disconnect(onlyInput);
        this.outputSocket.disconnect(onlyInput);

    }
}
