import Container = Phaser.GameObjects.Container;
import { DoubleInputSocket } from 'entity/pipeSystem/DoubleInputSocket';
import { InputSocket } from 'entity/pipeSystem/InputSocket';
import { OutputSocket } from 'entity/pipeSystem/OutputSocket';
import PipeVisual from 'entity/pipeSystem/PipeVisual';
import GameScene from 'scenes/GameScene';
import Vector2 = Phaser.Math.Vector2;
import { Depths } from 'enums/Depths';

export default class Combiner extends Container implements OutputSocket, DoubleInputSocket, InputSocket {

    protected scene: GameScene;
    private inputSocketFirst: OutputSocket|null = null;
    private inputSocketSecond: OutputSocket|null = null;
    private inputSocketFirstPipe: PipeVisual|null = null;
    private inputSocketSecondPipe: PipeVisual|null = null;
    private outputSocket: InputSocket|null = null;
    private outputSocketPipe: PipeVisual|null = null;
    private heatUpdateColdown!: NodeJS.Timeout;
    private image: Phaser.GameObjects.Image;
    private overlay: Phaser.GameObjects.Sprite;
    private sendHeatTimeout!: NodeJS.Timeout;
    private heatCapacitor = 0;

    constructor (scene: GameScene, x: number, y: number) {
        super(scene, x, y, []);

        scene.add.existing(this);
        this.scene = scene;
        this.setDepth(Depths.PIPE_BOXES);

        this.image = this.scene.add.image(0, 0, 'assets', 'combiner');
        this.add(this.image);

        this.overlay = this.scene.add.sprite(0, 0, 'assets', 'splitter_overlay').setAlpha(0.00001);
        this.overlay.setInteractive({ useHandCursor: true });
        this.add(this.overlay);

        this.overlay.on('pointerdown', () => {
            if (this.scene.pipeSystem.isDisconnectMode()) {
                this.inputSocketFirstPipe?.destroy();
                this.inputSocketSecondPipe?.destroy();
                return;
            }
            if (this.scene.pipeSystem.isConnectingMode()) {
                if (this.inputSocketFirst && this.inputSocketSecond) {
                    this.scene.ui.showSocketOccupied();
                } else {
                    this.scene.pipeSystem.completeConnecting(this);
                }
            } else {
                this.scene.pipeSystem.startConnecting(this);
            }
        });

        this.overlay.on('pointerover', () => {
            this.overlay.setAlpha(1);
        });

        this.overlay.on('pointerout', () => {
            this.overlay.setAlpha(0.0001);
        });
    }

    getInputSocket (): OutputSocket | null {
        return null;
    }

    setInputSocket (object: OutputSocket, pipe: PipeVisual): void {
        if (!this.inputSocketFirst) {
            console.log('combiner setinput 1');
            this.inputSocketFirst = object;
            this.inputSocketFirstPipe = pipe;
            return;
        }
        if (!this.inputSocketSecond) {
            console.log('combiner setinput 2');
            this.inputSocketSecond = object;
            this.inputSocketSecondPipe = pipe;
            return;
        }
    }

    disconnect (onlyInput: boolean): void {
        setTimeout(() => {
            this.inputSocketFirst = null;
            this.inputSocketSecond = null;
            this.inputSocketFirstPipe = null;
            this.inputSocketSecondPipe = null;

            if (!onlyInput) {
                this.outputSocket = null;
                this.outputSocketPipe = null;
            }
            this.heatValuesZero();
        }, 800);
    }

    getInputSocketFirst (): OutputSocket | null {
        return this.inputSocketFirst;
    }

    getInputSocketSecond (): OutputSocket | null {
        return this.inputSocketSecond;
    }

    getOutputObject (): InputSocket | null {
        return this.outputSocket;
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

    sendHeat (heatValue: number): void {
        this.heatCapacitor += heatValue;
    }

    updateHeat (): void {
        this.outputSocket?.sendHeat(this.heatCapacitor);
        this.heatCapacitor = 0;
    }

    private heatValuesZero (): void {
        // this.inputText.setText('0');
    }

    setInputSocketFirst (object: OutputSocket, pipe: PipeVisual): void {
        this.inputSocketFirst = object;
        this.inputSocketFirstPipe = pipe;
    }

    setInputSocketSecond (object: OutputSocket, pipe: PipeVisual): void {
        this.inputSocketSecond = object;
        this.inputSocketSecondPipe = pipe;
    }

    setOutputObject (object: InputSocket, pipe: PipeVisual): void {
        this.outputSocket = object;
        this.outputSocketPipe = pipe;

        // '#1f8888'
        pipe.setStrokeStyle(2, 0x1F8888);
    }
}