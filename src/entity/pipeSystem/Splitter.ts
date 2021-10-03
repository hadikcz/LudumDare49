import { DoubleOutputSocket } from 'entity/pipeSystem/DoubleOutputSocket';
import { InputSocket } from 'entity/pipeSystem/InputSocket';
import GameScene from 'scenes/GameScene';
import Container = Phaser.GameObjects.Container;
import { OutputSocket } from 'entity/pipeSystem/OutputSocket';
import PipeVisual from 'entity/pipeSystem/PipeVisual';
import Vector2 = Phaser.Math.Vector2;

export default class Splitter extends Container implements InputSocket, DoubleOutputSocket, OutputSocket {

    protected scene: GameScene;
    private variableOutputPipe: PipeVisual|null = null;
    private variableOutput: InputSocket|null = null;
    private inputSocket: OutputSocket|null = null;
    private staticOutputPipe: PipeVisual|null = null;
    private staticOutput: InputSocket|null = null;
    private overlay: Phaser.GameObjects.Sprite;
    private image: Phaser.GameObjects.Image;

    constructor (scene: GameScene, x: number, y: number) {
        super(scene, x, y, []);

        scene.add.existing(this);
        this.scene = scene;

        this.image = this.scene.add.image(0, 0, 'assets', 'splitter');
        this.add(this.image);

        this.overlay = this.scene.add.sprite(0, 0, 'assets', 'splitter_overlay').setAlpha(0.00001);
        this.overlay.setInteractive({ useHandCursor: true });
        this.add(this.overlay);

        this.overlay.on('pointerdown', () => {
            // if (this.scene.pipeSystem.isDisconnectMode()) {
            //     this.pipeVisual?.destroy();
            // }
            if (this.scene.pipeSystem.isConnectingMode()) {
                this.scene.pipeSystem.completeConnecting(this);
            }

            if (this.staticOutputPipe && this.variableOutput) {
                this.scene.ui.showSocketOccupied();
            } else {
                this.scene.pipeSystem.startConnecting(this);
            }
        });
    }

    getOutputObject (): InputSocket | null {
        return this.staticOutput;
    }

    setOutputObject (object: InputSocket, pipe: PipeVisual): void {
        if (!this.staticOutput) {
            this.staticOutput = object;
            this.staticOutputPipe = pipe;
            return;
        }

        if (!this.variableOutput) {
            this.variableOutput = object;
            this.variableOutputPipe = pipe;
        }
    }

    disconnect (): void {
        this.variableOutput = null;
        this.variableOutputPipe = null;
        this.staticOutput = null;
        this.staticOutputPipe = null;
        this.inputSocket = null;
    }

    getInputSocket (): OutputSocket | null {
        return this.inputSocket;
    }

    getOutputPower (): number | null {
        return 0;
    }

    getPosition (): Phaser.Math.Vector2 {
        return new Vector2(
            this.x,
            this.y
        );
    }

    getRequiredHeat (): number {
        return 0;
    }

    getStaticOutputObject (): InputSocket | null {
        return this.staticOutput;
    }

    getVariableOutputObject (): InputSocket | null {
        return this.variableOutput;
    }

    sendHeat (heatValue: number): void {
        let split = heatValue / 2;
        if (this.staticOutput) {
            this.staticOutput.sendHeat(split);
        }
        if (this.variableOutput) {
            this.variableOutput.sendHeat(split);
        }
        // process heat by split
        console.log('HEAT: splitter -> ' + heatValue);
    }

    setInputSocket (object: OutputSocket, pipe: PipeVisual): void {
        this.inputSocket = object;
    }

    setStaticOutputObject (object: InputSocket, pipe: PipeVisual): void {
        this.staticOutput = object;
        this.staticOutputPipe = pipe;
    }

    setVariableOutputObject (object: InputSocket, pipe: PipeVisual): void {
        this.variableOutput = object;
        this.variableOutputPipe = pipe;
    }
}
