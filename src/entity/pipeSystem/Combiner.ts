import Container = Phaser.GameObjects.Container;
import { DoubleInputSocket } from 'entity/pipeSystem/DoubleInputSocket';
import { InputSocket } from 'entity/pipeSystem/InputSocket';
import { OutputSocket } from 'entity/pipeSystem/OutputSocket';
import PipeVisual from 'entity/pipeSystem/PipeVisual';
import GameScene from 'scenes/GameScene';
import Vector2 = Phaser.Math.Vector2;
import Steamer from 'entity/Steamer';
import { Depths } from 'enums/Depths';
import Rectangle = Phaser.Geom.Rectangle;

export default class Combiner extends Container implements OutputSocket, DoubleInputSocket, InputSocket {

    public scene: GameScene;
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
    private steamer: Steamer;
    private outputText: Phaser.GameObjects.Text;
    private titleText: Phaser.GameObjects.Text;

    constructor (scene: GameScene, x: number, y: number) {
        super(scene, x, y, []);

        scene.add.existing(this);
        this.scene = scene;
        this.setDepth(Depths.PIPE_BOXES);

        this.steamer = new Steamer(this.scene, this.x, this.y);

        this.image = this.scene.add.image(0, 0, 'assets', 'combiner');
        this.add(this.image);



        const style3 = { fontFamily: 'arcadeclassic, Arial', fontSize: 65, color: '#04ff00', align: 'center' };
        this.outputText = this.scene.add.text(
            this.x - 5,
            this.y + 11,
            '0',
            // @ts-ignore
            style3
        )
            .setScale(0.3)
            .setStroke('#1d671c', 15)
            .setDepth(Depths.UI);

        const style4 = { fontFamily: 'arcadeclassic, Arial', fontSize: 40, color: '#feda09', align: 'center' };
        this.titleText = this.scene.add.text(
            this.x - 25,
            this.y - 30,
            'Combiner',
            // @ts-ignore
            style4
        )
            .setScale(0.3)
            .setStroke('#7c6e1b', 15)
            .setDepth(Depths.UI)
            .setVisible(false);

        this.overlay = this.scene.add.sprite(0, 0, 'assets', 'splitter_overlay').setAlpha(0.00001);
        this.overlay.setInteractive({ useHandCursor: true });
        this.add(this.overlay);

        this.overlay.on('pointerdown', () => {
            const disconnect = (): void => {
                this.inputSocketFirstPipe?.destroy(true, true);
                this.inputSocketSecondPipe?.destroy(true, true);
                this.outputSocketPipe?.destroy(true, false);
            };

            if (this.scene.destroyer.isDestroyMode()) {
                if (confirm('Are you really want to destroy combiner?')) {
                    disconnect();
                    this.disconnect(true, true);
                    setTimeout(() => {
                        this.destroy();
                    }, 300);
                }
                return;
            }
            if (this.scene.pipeSystem.isDisconnectMode()) {
                disconnect();
                return;
            }
            if (this.scene.pipeSystem.isConnectingMode()) {
                if (this.inputSocketFirst && this.inputSocketSecond) {
                    this.scene.ui.showSocketOccupied();
                } else {
                    this.scene.pipeSystem.completeConnecting(this);
                }
            } else {
                if (this.outputSocket === null) {
                    this.scene.pipeSystem.startConnecting(this);
                } else {
                    this.scene.ui.showSocketOccupied();
                }
            }
        });

        this.overlay.on('pointerover', () => {
            this.overlay.setAlpha(1);
            this.showAll();
            this.titleText.setVisible(true);
        });

        this.overlay.on('pointerout', () => {
            this.overlay.setAlpha(0.0001);
            this.titleText.setVisible(false);
            this.hideAll();
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

    disconnect (input: boolean, output: boolean): void {
        setTimeout(() => {

            if (input) {
                // this.inputSocketFirstPipe?.destroy(false, true);
                this.inputSocketFirst = null;
                this.inputSocketSecond = null;
                this.inputSocketFirstPipe = null;
                // this.inputSocketSecondPipe?.destroy(false, true);
                this.inputSocketSecondPipe = null;
            }

            if (output) {
                // this.outputSocketPipe?.destroy(true);
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
        this.processSendHeatForSteamer(heatValue);
    }

    updateHeat (): void {
        this.outputSocket?.sendHeat(this.heatCapacitor);
        this.outputText.setText(this.heatCapacitor.toString());
        this.heatCapacitor = 0;
    }

    private heatValuesZero (): void {
        if (this.scene.pause.isPaused()) return;
        this.outputText.setText('0');
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

        pipe.setStrokeStyle(2, 0x6ee700);
    }

    destroy (fromScene?: boolean): void {
        super.destroy(fromScene);
        this.steamer.stop();
        this.titleText.destroy();
        this.outputText.destroy();
        delete this.steamer;
    }

    showAll (): void {
        this.outputText.setVisible(true);
    }

    hideAll (): void {
        this.outputText.setVisible(false);
    }

    getImageBounds (): Rectangle {
        return this.image.getBounds();
    }

    private processSendHeatForSteamer (heatValue: number): void {
        if (heatValue <= 0) return;

        if (!this.outputSocket) {
            this.steamer.start();
        } else {
            this.steamer.stop();
        }
    }
}
