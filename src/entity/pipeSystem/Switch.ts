import Container = Phaser.GameObjects.Container;
import { InputSocket } from 'entity/pipeSystem/InputSocket';
import { OutputSocket } from 'entity/pipeSystem/OutputSocket';
import GameScene from 'scenes/GameScene';
import Vector2 = Phaser.Math.Vector2;
import GameConfig from 'config/GameConfig';
import PipeVisual from 'entity/pipeSystem/PipeVisual';
import Steamer from 'entity/Steamer';
import { Depths } from 'enums/Depths';
import Rectangle = Phaser.Geom.Rectangle;

export default class Switch extends Container implements OutputSocket, InputSocket {

    protected scene: GameScene;

    private inputSocket: OutputSocket|null = null;
    private outputSocket: InputSocket|null = null;
    private outputPipe: PipeVisual|null = null;
    private inputPipe: PipeVisual|null = null;
    private image: Phaser.GameObjects.Image;
    private overlay: Phaser.GameObjects.Sprite;
    private powerIcon: Phaser.GameObjects.Image;

    private powerOn = true;
    private inputText: Phaser.GameObjects.Text;
    private heatUpdateColdown!: NodeJS.Timeout;

    private steamer!: Steamer;

    constructor (scene: GameScene, x, y) {
        super(scene, x, y, []);
        scene.add.existing(this);

        this.setDepth(Depths.PIPE_BOXES);

        this.scene = scene;

        this.image = this.scene.add.image(0, 0, 'assets', 'switch');
        this.add(this.image);

        const style3 = { fontFamily: 'arcadeclassic, Arial', fontSize: 65, color: '#04ff00', align: 'center' };
        this.inputText = this.scene.add.text(
            this.x - 5,
            this.y + 11,
            '0',
            style3
        )
            .setScale(0.3)
            .setStroke('#1d671c', 15)
            .setDepth(Depths.UI);

        this.overlay = this.scene.add.sprite(0, 5, 'assets', 'splitter_overlay').setAlpha(0.00001);
        this.overlay.setInteractive({ useHandCursor: true });
        this.add(this.overlay);

        this.overlay.on('pointerdown', () => {

            const disconnect = (): void => {
                console.log('HEAT: switch destroy');
                this.outputPipe?.destroy();
                this.inputPipe?.destroy();
            };

            if (this.scene.pipeSystem.isDisconnectMode()) {
                disconnect();
                return;
            }
            if (this.scene.pipeSystem.isConnectingMode()) {
                this.scene.pipeSystem.completeConnecting(this);

            }
            if (this.outputPipe) {
                this.scene.ui.showSocketOccupied();
            } else {
                this.scene.pipeSystem.startConnecting(this);
            }

            if (this.scene.destroyer.isDestroyMode()) {
                if (confirm('Are you really want to destroy switch?')) {
                    disconnect();
                    this.disconnect(false);
                    setTimeout(() => {
                        this.destroy();
                    }, 300);
                }
            }
        });

        this.overlay.on('pointerover', () => {
            this.overlay.setAlpha(1);
            this.showAll();
        });

        this.overlay.on('pointerout', () => {
            this.overlay.setAlpha(0.0001);
            this.hideAll();
        });

        this.hideAll();


        this.powerIcon = this.scene.add.image(this.x + 0, this.y -20, 'assets', 'ui_power_on')
            .setDepth(Depths.UI);
        this.powerIcon.setInteractive({ useHandCursor: true });

        this.powerIcon.on('pointerdown', () => {
            this.powerOn = !this.powerOn;

            if (this.powerOn) {
                this.powerIcon.setFrame('ui_power_on');
            } else {
                this.powerIcon.setFrame('ui_power_off');
            }
        });

        this.steamer = new Steamer(this.scene, this.x, this.y);
    }

    disconnect (onlyInput: boolean): void {
        setTimeout(() => {

            this.steamer.stop();
            this.inputSocket = null;
            this.inputPipe = null;
            if (!onlyInput) {
                this.outputPipe = null;
                this.outputSocket = null;
            }
            this.heatValuesZero();
        }, 800);
    }

    getInputSocket (): OutputSocket | null {
        return this.inputSocket;
    }

    getOutputObject (): InputSocket | null {
        return this.outputSocket;
    }

    getOutputPower (): number | null {
        return null;
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
        clearTimeout(this.heatUpdateColdown);

        this.processSendHeatForSteamer(heatValue);
        if (!this.powerOn) return;
        if (this.outputSocket) {
            this.outputSocket.sendHeat(heatValue);
        }

        this.inputText.setText(heatValue.toString());
        this.heatUpdateColdown = setTimeout(() => {
            this.heatValuesZero();
        }, GameConfig.heatCycle * 1.5);
    }

    private heatValuesZero (): void {
        this.inputText.setText('0');
    }

    setInputSocket (object: OutputSocket, pipe: PipeVisual): void {
        this.inputSocket = object;
        this.inputPipe = pipe;
    }

    setOutputObject (object: InputSocket, pipe: PipeVisual): void {
        this.outputSocket = object;
        this.outputPipe = pipe;
        // '#b1b508'
        pipe.setStrokeStyle(2, 0xb1b508);
    }

    destroy (fromScene?: boolean): void {
        super.destroy(fromScene);

        this.powerIcon.destroy();
        this.inputText.destroy();
        this.steamer.stop();
        delete this.steamer;
    }

    showAll (): void {
        this.inputText.setVisible(true);
    }

    hideAll (): void {
        this.inputText.setVisible(false);
    }

    getImageBounds (): Rectangle {
        return this.image.getBounds();
    }

    private processSendHeatForSteamer (heatValue: number): void {
        if (heatValue <= 0) return;

        if (!this.powerOn || this.outputSocket === null) {
            this.steamer.start();
        } else {
            this.steamer.stop();
        }
    }
}
