import { DoubleOutputSocket } from 'entity/pipeSystem/DoubleOutputSocket';
import { InputSocket } from 'entity/pipeSystem/InputSocket';
import GameScene from 'scenes/GameScene';
import Container = Phaser.GameObjects.Container;
import { OutputSocket } from 'entity/pipeSystem/OutputSocket';
import PipeVisual from 'entity/pipeSystem/PipeVisual';
import Vector2 = Phaser.Math.Vector2;
import { Depths } from 'enums/Depths';

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
    private staticOutputText: Phaser.GameObjects.Text;
    private variableOutputText: Phaser.GameObjects.Text;
    private inputText: Phaser.GameObjects.Text;

    constructor (scene: GameScene, x: number, y: number) {
        super(scene, x, y, []);

        scene.add.existing(this);
        this.scene = scene;

        this.setDepth(Depths.PIPES);

        this.image = this.scene.add.image(0, 0, 'assets', 'splitter');
        this.add(this.image);

        this.settingsIcon = this.scene.add.image(0, -20, 'assets', 'ui_settings');
        this.settingsIcon.setInteractive({ useHandCursor: true });
        this.add(this.settingsIcon);

        this.settingsIcon.on('pointerdown', () => {
            let value = prompt('Define how much will pass thru on static output. Rest of income heat will be send into variable output.\n Green input\n blue static ouput (number which you pick here)\n red different between static output and input (rest of heat).', '1');
            if (!value) return;

            let parsed = parseInt(value);

            this.staticPass = parsed;
        });

        const style = { fontFamily: 'arcadeclassic, Arial', fontSize: 65, color: '#417093', align: 'center' };

        this.staticOutputText = this.scene.add.text(
            this.x + -25,
            this.y + -13,
            '0',
            style
        )
            .setScale(0.3)
            .setDepth(Depths.UI);

        const style2 = { fontFamily: 'arcadeclassic, Arial', fontSize: 65, color: '#ae3030', align: 'center' };
        this.variableOutputText = this.scene.add.text(
            this.x + 15,
            this.y -13,
            '0',
            style2
        )
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
            .setDepth(Depths.UI);

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
            pipe.setStrokeStyle(2, 0x417093);
            return;
        }

        if (!this.variableOutput) {
            this.variableOutput = object;
            this.variableOutputPipe = pipe;
            pipe.setStrokeStyle(2, 0xae3030);
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
            this.staticOutputText.setText('0');
            this.variableOutputText.setText('0');
            this.inputText.setText('0');
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
            this.staticOutput.sendHeat(variableHeat); // swap because it work swap not normally
        }
        if (this.variableOutput) {
            this.variableOutput.sendHeat(staticHeat);
        }
        // process heat by split
        console.log('HEAT: splitter -> ' + heatValue);

        this.staticOutputText.setText(variableHeat.toString());
        this.variableOutputText.setText(staticHeat.toString());
        this.inputText.setText(heatValue.toString());
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
