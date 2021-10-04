import GameConfig from 'config/GameConfig';
import { BalancerTarget } from 'entity/pipeSystem/BalancerTarget';
import { InputSocket } from 'entity/pipeSystem/InputSocket';
import { OutputSocket } from 'entity/pipeSystem/OutputSocket';
import PipeVisual from 'entity/pipeSystem/PipeVisual';
import Steamer from 'entity/Steamer';
import { Depths } from 'enums/Depths';
import GameScene from 'scenes/GameScene';
import Container = Phaser.GameObjects.Container;
import Vector2 = Phaser.Math.Vector2;
import Rectangle = Phaser.Geom.Rectangle;
import { DoubleStableOutputSocket } from 'entity/pipeSystem/DoubleStableOutputSocket';

export default class Balancer extends Container implements InputSocket, DoubleStableOutputSocket, OutputSocket {

    protected scene: GameScene;
    private inputSocket: OutputSocket|null = null;
    private inputPipe: PipeVisual|null = null;
    private overlay: Phaser.GameObjects.Sprite;
    private image: Phaser.GameObjects.Image;
    private inputText: Phaser.GameObjects.Text;
    private heatUpdateColdown!: NodeJS.Timeout;
    private steamer: Steamer;
    private secondOutputText: Phaser.GameObjects.Text;
    private firstOutput: InputSocket|null = null;
    private firstOutputPipe: PipeVisual|null = null;
    private secondOutput: InputSocket|null = null;
    private secondOutputPipe: PipeVisual|null = null;
    private lastOutput: number = 0;
    private firstOutputText: Phaser.GameObjects.Text;
    private titleText: Phaser.GameObjects.Text;

    constructor (scene: GameScene, x: number, y: number) {
        super(scene, x, y, []);

        scene.add.existing(this);
        this.scene = scene;

        this.setDepth(Depths.PIPE_BOXES);

        this.steamer = new Steamer(this.scene, this.x, this.y);

        this.image = this.scene.add.image(0, 0, 'assets', 'balancer');
        this.add(this.image);

        const style = { fontFamily: 'arcadeclassic, Arial', fontSize: 65, color: '#4c83b1', align: 'center' };

        this.firstOutputText = this.scene.add.text(
            this.x + 15,
            this.y + -13,
            '0',
            style
        )
            .setScale(0.3)
            .setStroke('#235862', 15)
            .setDepth(Depths.UI);

        const style2 = { fontFamily: 'arcadeclassic, Arial', fontSize: 65, color: '#e93737', align: 'center' };
        this.secondOutputText = this.scene.add.text(
            this.x + -25,
            this.y -13,
            '0',
            style2
        )
            .setStroke('#771d1d', 15)
            .setScale(0.3)
            .setDepth(Depths.UI);

        const style3 = { fontFamily: 'arcadeclassic, Arial', fontSize: 65, color: '#04ff00', align: 'center' };
        this.inputText = this.scene.add.text(
            this.x - 2,
            this.y + 11,
            '0',
            style3
        )
            .setScale(0.3)
            .setStroke('#1d671c', 15)
            .setDepth(Depths.UI);

        const style4 = { fontFamily: 'arcadeclassic, Arial', fontSize: 40, color: '#feda09', align: 'center' };
        this.titleText = this.scene.add.text(
            this.x - 25,
            this.y - 30,
            'Balancer',
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
                this.firstOutputPipe?.destroy();
                this.secondOutputPipe?.destroy();
                this.inputPipe?.destroy();
            };

            if (this.scene.pipeSystem.isDisconnectMode()) {
                disconnect();
                return;
            }

            if (this.scene.pipeSystem.isConnectingMode()) {
                this.scene.pipeSystem.completeConnecting(this);

            }

            const balancerTarget = this.getFreeBalancerTarget();
            if (balancerTarget === null) {
                this.scene.ui.showSocketOccupied();
            } else {
                this.scene.pipeSystem.startConnecting(this, balancerTarget);
            }

            if (this.scene.destroyer.isDestroyMode()) {
                if (confirm('Are you really want to destroy balancer?')) {
                    disconnect();
                    this.disconnect();
                    setTimeout(() => {
                        this.destroy();
                    }, 300);
                }
            }
        });

        this.overlay.on('pointerover', () => {
            this.overlay.setAlpha(1);
            this.titleText.setVisible(true);
            this.showAll();

        });

        this.overlay.on('pointerout', () => {
            this.overlay.setAlpha(0.0001);
            this.titleText.setVisible(false);
            this.hideAll();
        });
    }

    getFirstOutputObject (): InputSocket | null {
        return this.firstOutput;
    }

    getSecondOutputObject (): InputSocket | null {
        return this.secondOutput;
    }

    getOutputObject (): InputSocket | null {
        return this.firstOutput; // not used
    }

    setOutputObject (object: InputSocket, pipe: PipeVisual): void {
        const target = this.getFreeBalancerTarget();
        if (target === BalancerTarget.FRIST) {
            this.firstOutput = object;
            this.firstOutputPipe = pipe;
            pipe.setStrokeStyle(2, 0x417093);
            return;
        }

        if (target === BalancerTarget.SECOND) {
            this.secondOutput = object;
            this.secondOutputPipe = pipe;
            pipe.setStrokeStyle(2, 0xae3030);
            return;
        }

        if (target === null) {
            console.error('tried set output object but its full!');
        }
    }

    disconnect (onlyInput: boolean = false, balancerTarget: BalancerTarget|null = null): void {
        console.log('disconnect balancer target ' + balancerTarget);
        setTimeout(() => {
            this.inputSocket = null;
            this.inputPipe = null;
            if (!onlyInput) {
                if (balancerTarget === null) {
                    this.firstOutput = null;
                    this.firstOutputPipe?.destroy();
                    this.firstOutputPipe = null;
                    this.secondOutput = null;
                    this.secondOutputPipe?.destroy();
                    this.secondOutputPipe = null;
                } else if (balancerTarget === BalancerTarget.FRIST) {
                    this.firstOutput = null;
                    this.firstOutputPipe?.destroy();
                    this.firstOutputPipe = null;
                } else if (balancerTarget === BalancerTarget.SECOND) {
                    this.secondOutput = null;
                    this.secondOutputPipe?.destroy();
                    this.secondOutputPipe = null;
                }
            }
            this.heatValuesZero();
        }, 800);
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

    // @TODO
    sendHeat (heatValue: number): void {
        this.processSendHeatForSteamer(heatValue);
        clearTimeout(this.heatUpdateColdown);

        let firstOutputHeat = Math.ceil(heatValue / 2);
        let secondOutputHeat = Math.floor(heatValue / 2);
        if (this.firstOutput) {
            this.firstOutput.sendHeat(firstOutputHeat);
        }
        if (this.secondOutput) {
            this.secondOutput.sendHeat(secondOutputHeat);
        }
        // process heat by split

        this.firstOutputText.setText(firstOutputHeat.toString());
        this.secondOutputText.setText(secondOutputHeat.toString());
        this.lastOutput = firstOutputHeat;
        this.inputText.setText(heatValue.toString());

        this.heatUpdateColdown = setTimeout(() => {
            this.heatValuesZero();
        }, GameConfig.heatCycle * 1.5);
    }

    private heatValuesZero (): void {
        if (this.scene.pause.isPaused()) return;
        this.firstOutputText.setText('0');
        this.secondOutputText.setText('0');
        this.inputText.setText('0');
        this.lastOutput = 0;
    }

    setInputSocket (object: OutputSocket, pipe: PipeVisual): void {
        this.inputSocket = object;
        this.inputPipe = pipe;
    }

    destroy (fromScene?: boolean): void {
        super.destroy(fromScene);

        this.titleText.destroy();
        this.steamer.stop();
        delete this.steamer;
        this.firstOutputText.destroy();
        this.secondOutputText.destroy();
        this.inputText.destroy();
    }

    showAll (): void {
        this.firstOutputText.setVisible(true);
        this.secondOutputText.setVisible(true);
        this.inputText.setVisible(true);
        console.log('show all balancer');
    }

    hideAll (): void {
        this.firstOutputText.setVisible(false);
        this.secondOutputText.setVisible(false);
        this.inputText.setVisible(false);
    }

    getImageBounds (): Rectangle {
        return this.image.getBounds();
    }

    private processSendHeatForSteamer (heatValue: number): void {
        if (heatValue <= 0) return;

        if (!this.firstOutput && !this.secondOutput) {
            this.steamer.start();
        } else {
            this.steamer.stop();
        }
    }

    private getFreeBalancerTarget (): BalancerTarget|null {
        if (this.firstOutput === null) {
            return BalancerTarget.FRIST;
        }
        if (this.secondOutput === null) {
            return BalancerTarget.SECOND;
        }
        return null;
    }
}
