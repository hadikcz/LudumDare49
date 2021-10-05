import GameConfig from 'config/GameConfig';
import { DoubleOutputSocket } from 'entity/pipeSystem/DoubleOutputSocket';
import { InputSocket } from 'entity/pipeSystem/InputSocket';
import { OutputSocket } from 'entity/pipeSystem/OutputSocket';
import PipeVisual from 'entity/pipeSystem/PipeVisual';
import Steamer from 'entity/Steamer';
import { Depths } from 'enums/Depths';
import { SplitterTarget } from 'enums/SplitterTarget';
import GameScene from 'scenes/GameScene';
import Container = Phaser.GameObjects.Container;
import Vector2 = Phaser.Math.Vector2;
import Rectangle = Phaser.Geom.Rectangle;

export default class Splitter extends Container implements InputSocket, DoubleOutputSocket, OutputSocket {

    public scene: GameScene;
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
    private plusButton: Phaser.GameObjects.Image;
    private minusButton: Phaser.GameObjects.Image;
    private lastVariableOutput = 0;
    private heatUpdateColdown!: NodeJS.Timeout;
    private steamer: Steamer;
    private titleText: Phaser.GameObjects.Text;

    constructor (scene: GameScene, x: number, y: number) {
        super(scene, x, y, []);

        scene.add.existing(this);
        this.scene = scene;

        this.setDepth(Depths.PIPE_BOXES);

        this.steamer = new Steamer(this.scene, this.x, this.y);

        this.image = this.scene.add.image(0, 0, 'assets', 'splitter');
        this.add(this.image);

        this.settingsIcon = this.scene.add.image(this.x + 0, this.y -20, 'assets', 'ui_settings')
            .setDepth(Depths.UI);
        this.settingsIcon.setInteractive({ useHandCursor: true });
        // this.add(this.settingsIcon);

        this.settingsIcon.on('pointerdown', () => {
            let value = prompt('SPLITTER\n\nDefine how much will pass thru on static output. Rest of income heat will be send into variable output.\n Green input\n blue static ouput (number which you pick here)\n red different between static output and input (rest of heat).\n Current static output: ' +this.staticPass + '\nCurrent variable output: ' + this.lastVariableOutput, '1');
            if (!value) return;

            let parsed = parseInt(value);

            this.staticPass = parsed;
        });

        const style = { fontFamily: 'arcadeclassic, Arial', fontSize: 65, color: '#4c83b1', align: 'center' };

        this.staticOutputText = this.scene.add.text(
            this.x + 15,
            this.y + -13,
            '0',
            // @ts-ignore
            style
        )
            .setScale(0.3)
            .setStroke('#235862', 15)
            .setDepth(Depths.UI);

        const style2 = { fontFamily: 'arcadeclassic, Arial', fontSize: 65, color: '#e93737', align: 'center' };
        this.variableOutputText = this.scene.add.text(
            this.x + -25,
            this.y -13,
            '0',
            // @ts-ignore
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
            // @ts-ignore
            style3
        )
            .setScale(0.3)
            .setStroke('#1d671c', 15)
            .setDepth(Depths.UI);

        const style4 = { fontFamily: 'arcadeclassic, Arial', fontSize: 40, color: '#feda09', align: 'center' };
        this.titleText = this.scene.add.text(
            this.x - 25,
            this.y - 45,
            'Splitter',
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
                console.log('HEAT: splitter destroy');
                this.variableOutputPipe?.destroy(true);
                this.staticOutputPipe?.destroy(true);
                console.log(this.inputPipe);
                this.inputPipe?.destroy();
                console.log(this.inputPipe);
            };

            if (this.scene.destroyer.isDestroyMode()) {
                if (confirm('Are you really want to destroy splitter?')) {
                    disconnect();
                    this.disconnect();
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
                this.scene.pipeSystem.completeConnecting(this);

            }

            const splitterTarget = this.getFreeSplitterTargetSocket();
            if (splitterTarget === null) {
                this.scene.ui.showSocketOccupied();
            } else {
                this.scene.pipeSystem.startConnecting(this, splitterTarget);
            }
        });

        this.overlay.on('pointerover', () => {
            this.overlay.setAlpha(1);
            this.showAll();

            this.titleText.setVisible(true);
        });

        this.overlay.on('pointerout', () => {
            this.overlay.setAlpha(0.0001);
            this.hideAll();
            this.titleText.setVisible(false);
        });

        // plus
        this.plusButton = this.scene.add.image(
            this.x + 20,
            this.y - 20,
            'assets',
            'ui_plus'
        )
            .setDepth(Depths.UI)
            .setInteractive({ useHandCursor: true });

        // minus
        this.minusButton = this.scene.add.image(
            this.x - 20,
            this.y - 20,
            'assets',
            'ui_minus'
        )
            .setDepth(Depths.UI)
            .setInteractive({ useHandCursor: true });

        this.plusButton.on('pointerdown', () => {
            this.staticPass++;
        });

        this.minusButton.on('pointerdown', () => {
            if (this.staticPass <= 0) return;
            this.staticPass--;
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

    disconnect (onlyInput: boolean = false, splitterTarget: SplitterTarget|null = null): void {
        console.log('disconnect splitter target ' + splitterTarget);
        setTimeout(() => {
            let notDisconnectInput = false;
            if (!onlyInput) {
                if (splitterTarget === null) {
                    this.staticOutput = null;
                    this.staticOutputPipe?.destroy(true);
                    this.staticOutputPipe = null;
                    this.variableOutput = null;
                    this.variableOutputPipe?.destroy(true);
                    this.variableOutputPipe = null;
                } else if (splitterTarget === SplitterTarget.STATIC) {
                    this.staticOutput = null;
                    this.staticOutputPipe?.destroy(true);
                    this.staticOutputPipe = null;
                    notDisconnectInput = true;
                } else if (splitterTarget === SplitterTarget.VARIABLE) {
                    this.variableOutput = null;
                    this.variableOutputPipe?.destroy(true);
                    this.variableOutputPipe = null;
                    notDisconnectInput = true;
                }
            }

            if (!notDisconnectInput) {
                this.inputSocket = null;
                this.inputPipe?.destroy(true);
                this.inputPipe = null;
            }
            this.heatValuesZero();
        }, 10);
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
        this.processSendHeatForSteamer(heatValue);
        clearTimeout(this.heatUpdateColdown);
        let staticHeat = 0;

        if (heatValue <= this.staticPass) {
            staticHeat = heatValue;
        } else {
            staticHeat = this.staticPass;
        }

        let variableHeat = heatValue - this.staticPass;
        if (variableHeat < 0) {
            variableHeat = 0;
        }

        if (this.staticOutput) {
            this.staticOutput.sendHeat(staticHeat); // swap because it work swap not normally
        }
        if (this.variableOutput) {
            this.variableOutput.sendHeat(variableHeat);
        }
        // process heat by split

        this.staticOutputText.setText(staticHeat.toString());
        this.variableOutputText.setText(variableHeat.toString());
        this.lastVariableOutput = variableHeat;
        this.inputText.setText(heatValue.toString());

        this.heatUpdateColdown = setTimeout(() => {
            this.heatValuesZero();
        }, GameConfig.heatCycle * 1.5);
    }

    private heatValuesZero (): void {
        if (this.scene.pause.isPaused()) return;
        this.staticOutputText.setText('0');
        this.variableOutputText.setText('0');
        this.inputText.setText('0');
        this.lastVariableOutput = 0;
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

    destroy (fromScene?: boolean): void {
        super.destroy(fromScene);


        this.titleText.destroy();
        this.steamer.stop();
        delete this.steamer;
        this.variableOutputText.destroy();
        this.staticOutputText.destroy();
        this.inputText.destroy();
        this.settingsIcon.destroy();
        this.plusButton.destroy();
        this.minusButton.destroy();
    }

    showAll (): void {
        this.variableOutputText.setVisible(true);
        this.staticOutputText.setVisible(true);
        this.inputText.setVisible(true);
    }

    hideAll (): void {
        this.variableOutputText.setVisible(false);
        this.staticOutputText.setVisible(false);
        this.inputText.setVisible(false);
    }

    getImageBounds (): Rectangle {
        return this.image.getBounds();
    }

    private processSendHeatForSteamer (heatValue: number): void {
        if (heatValue <= 0) return;

        if (!this.staticOutput && !this.variableOutput) {
            this.steamer.start();
        } else {
            this.steamer.stop();
        }
    }

    private getFreeSplitterTargetSocket (): SplitterTarget|null {
        if (this.staticOutput === null) {
            return SplitterTarget.STATIC;
        }
        if (this.variableOutput === null) {
            return SplitterTarget.VARIABLE;
        }
        return null;
    }
}
