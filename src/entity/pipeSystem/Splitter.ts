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
    private inputPipe: PipeVisual|null = null;
    private overlay: Phaser.GameObjects.Sprite;
    private image: Phaser.GameObjects.Image;
    private settingsIcon: Phaser.GameObjects.Image;
    private staticPass = 1;

    constructor (scene: GameScene, x: number, y: number) {
        super(scene, x, y, []);

        scene.add.existing(this);
        this.scene = scene;

        this.image = this.scene.add.image(0, 0, 'assets', 'splitter');
        this.add(this.image);

        this.settingsIcon = this.scene.add.image(20, 0, 'assets', 'ui_settings');
        this.settingsIcon.setInteractive({ useHandCursor: true });
        this.add(this.settingsIcon);

        this.settingsIcon.on('pointerdown', () => {
            let value = prompt('Define how much will pass thru on static output. Rest of income heat will be send into variable output', '1');
            if (!value) return;

            let parsed = parseInt(value);

            this.staticPass = parsed;
        });

        this.overlay = this.scene.add.sprite(0, 0, 'assets', 'splitter_overlay').setAlpha(0.00001);
        this.overlay.setInteractive({ useHandCursor: true });
        this.add(this.overlay);

        this.overlay.on('pointerdown', () => {
            if (this.scene.pipeSystem.isDisconnectMode()) {
                console.log('HEAT: splitter destroy');
                this.variableOutputPipe?.destroy();
                this.staticOutputPipe?.destroy();
                this.inputPipe?.destroy();
                return;
            }
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

    disconnect (onlyInput: boolean = false): void {
        setTimeout(() => {

            this.inputSocket = null;
            this.inputPipe = null;
            if (!onlyInput) {
                this.variableOutput = null;
                this.variableOutputPipe = null;
                this.staticOutput = null;
                this.staticOutputPipe = null;
            }
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

    getStaticOutputObject (): InputSocket | null {
        return this.staticOutput;
    }

    getVariableOutputObject (): InputSocket | null {
        return this.variableOutput;
    }

    sendHeat (heatValue: number): void {
        let staticHeat = 0;

        if (heatValue <= this.staticPass) {
            staticHeat = Math.abs(heatValue);
        } else {
            staticHeat = heatValue - this.staticPass;
        }

        let variableHeat = Math.abs(heatValue - staticHeat);


        if (this.staticOutput) {
            this.staticOutput.sendHeat(staticHeat);
        }
        if (this.variableOutput) {
            this.variableOutput.sendHeat(variableHeat);
        }
        // process heat by split
        console.log('HEAT: splitter -> ' + heatValue);
    }

    setInputSocket (object: OutputSocket, pipe: PipeVisual): void {
        this.inputSocket = object;
        this.inputPipe = pipe;
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
