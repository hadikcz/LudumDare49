import Container = Phaser.GameObjects.Container;
import { InputSocket } from 'entity/pipeSystem/InputSocket';
import { OutputSocket } from 'entity/pipeSystem/OutputSocket';
import GameScene from 'scenes/GameScene';
import Vector2 = Phaser.Math.Vector2;
import PipeVisual from 'entity/pipeSystem/PipeVisual';
import { Depths } from 'enums/Depths';

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

    constructor (scene: GameScene, x, y) {
        super(scene, x, y, []);
        scene.add.existing(this);

        this.setDepth(Depths.PIPE_BOXES);

        this.scene = scene;

        this.image = this.scene.add.image(0, 0, 'assets', 'switch');
        this.add(this.image);

        this.overlay = this.scene.add.sprite(0, 5, 'assets', 'splitter_overlay').setAlpha(0.00001);
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


        this.powerIcon = this.scene.add.image(0, -20, 'assets', 'ui_power_on')
            .setDepth(Depths.UI);
        this.powerIcon.setInteractive({ useHandCursor: true });
        this.add(this.powerIcon);

        this.powerIcon.on('pointerdown', () => {
            this.powerOn = !this.powerOn;

            if (this.powerOn) {
                this.powerIcon.setFrame('ui_power_on');
            } else {
                this.powerIcon.setFrame('ui_power_off');
            }
        });

        const style3 = { fontFamily: 'arcadeclassic, Arial', fontSize: 65, color: '#04ff00', align: 'center' };
        this.inputText = this.scene.add.text(
            this.x - 2,
            this.y + 11,
            '0',
            style3
        )
            .setScale(0.3)
            .setDepth(Depths.UI);
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
        if (!this.powerOn) return;
        if (this.outputSocket) {
            this.outputSocket.sendHeat(heatValue);
        }

        this.inputText.setText(heatValue.toString());
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