import Container = Phaser.GameObjects.Container;
import { InputSocket } from 'entity/pipeSystem/InputSocket';
import { OutputSocket } from 'entity/pipeSystem/OutputSocket';
import GameScene from 'scenes/GameScene';
import Vector2 = Phaser.Math.Vector2;
import PipeVisual from 'entity/pipeSystem/PipeVisual';

export default class Switch extends Container implements OutputSocket, InputSocket {

    protected scene: GameScene;

    private inputSocket: OutputSocket|null = null;
    private outputSocket: InputSocket|null = null;
    private outputPipe: PipeVisual|null = null;
    private inputPipe: PipeVisual|null = null;
    private image: Phaser.GameObjects.Image;
    private overlay: Phaser.GameObjects.Sprite;

    constructor (scene: GameScene, x, y) {
        super(scene, x, y, []);
        scene.add.existing(this);

        this.scene = scene;

        this.image = this.scene.add.image(0, 0, 'assets', 'switch');
        this.add(this.image);

        this.overlay = this.scene.add.sprite(0, 0, 'assets', 'splitter_overlay').setAlpha(0.00001);
        this.overlay.setInteractive({ useHandCursor: true });
        this.add(this.overlay);

        this.overlay.on('pointerdown', () => {
            if (this.scene.pipeSystem.isDisconnectMode()) {
                console.log('HEAT: switch destroy');
                this.outputPipe?.destroy();
                this.inputPipe?.destroy();
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
        });

        this.overlay.on('pointerover', () => {
            this.overlay.setAlpha(1);
        });

        this.overlay.on('pointerout', () => {
            this.overlay.setAlpha(0.0001);
        });
    }

    disconnect (onlyInput: boolean): void {
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
        if (this.outputSocket) {
            this.outputSocket.sendHeat(heatValue);
        }
    }

    setInputSocket (object: OutputSocket, pipe: PipeVisual): void {
        this.inputSocket = object;
        this.inputPipe = pipe;
    }

    setOutputObject (object: InputSocket, pipe: PipeVisual): void {
        this.outputSocket = object;
        this.outputPipe = pipe;
        pipe.setStrokeStyle(2, 0xeff500);
    }
}
