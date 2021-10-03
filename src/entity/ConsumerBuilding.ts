import Building from 'entity/Building';
import { InputSocket } from 'entity/pipeSystem/InputSocket';
import { OutputSocket } from 'entity/pipeSystem/OutputSocket';
import { PipeSystemObject } from 'entity/pipeSystem/PipeSystemObject';
import GameScene from 'scenes/GameScene';
import Vector2 = Phaser.Math.Vector2;
import PipeVisual from 'entity/pipeSystem/PipeVisual';
import { Depths } from 'enums/Depths';

export default class ConsumerBuilding extends Building implements InputSocket, PipeSystemObject {

    private inputSocket: OutputSocket | null = null;
    private heatDeposit = 0;
    private lowLimit: number;
    private highLimit: number;
    private overlay: Phaser.GameObjects.Sprite;
    private heatText: Phaser.GameObjects.Text;
    private pipeVisual: PipeVisual|null = null;

    constructor (scene: GameScene, x: number, y: number, image: string) {
        super(scene, x, y, image);

        this.lowLimit = -5;
        this.highLimit = this.getRequiredHeat() * 5;

        const style = { fontFamily: 'arcadeclassic, Arial', fontSize: 65, color: '#feda09', align: 'center' };
        const modifyTextX = -15;
        const modifyTextY = -35;

        this.heatText = this.scene.add.text(this.x + modifyTextX, this.y + modifyTextY, '', style)
            .setScale(0.2)
            .setStroke('#7c6e1b', 30)
            .setDepth(Depths.UI);
        // .setVisible(false);

        this.overlay = this.scene.add.sprite(0, 0, 'assets', image + '_overlay').setAlpha(0.00001);
        this.overlay.setInteractive({ useHandCursor: true });
        this.add(this.overlay);

        this.overlay.on('pointerdown', () => {
            if (this.scene.pipeSystem.isDisconnectMode()) {
                this.pipeVisual?.destroy();
            }
            if (this.scene.pipeSystem.isConnectingMode()) {
                console.log('connect');
                this.scene.pipeSystem.completeConnecting(this);
            }
        });

        this.overlay.on('pointerover', () => {
            // this.heatText.setVisible(true);
            if (!this.scene.pipeSystem.isConnectingMode()) return;
            this.overlay.setAlpha(1);
        });
        //
        this.overlay.on('pointerout', () => {
            // this.heatText.setVisible(false);
            this.overlay.setAlpha(0.00001);
        });
    }

    updateHeat (): void {
        console.log('HEAT: coinsumer update heat');
        if (this.heatDeposit < 0) {
            console.log('Building is freezing');
        } else if (this.heatDeposit > this.highLimit) {
            console.log('house is too hot');
            if (this.steamInterval === undefined) {
                this.handleSteam();
            }
        } else {
            if (this.steamInterval !== undefined) {
                this.stopSteam();
            }
        }
        this.heatDeposit--;

        this.heatText.setText(this.heatDeposit.toString());
    }

    getInputSocket (): OutputSocket | null {
        return this.inputSocket;
    }

    getRequiredHeat (): number {
        return 1;
    }

    sendHeat (heatValue: number): void {
        console.log('HEAT: building recieve heat ' + heatValue);
        this.heatDeposit += heatValue;
    }

    setInputSocket (object: OutputSocket, pipe: PipeVisual): void {
        this.inputSocket = object;
        this.pipeVisual = pipe;
    }

    getPosition (): Phaser.Math.Vector2 {
        return new Vector2(
            this.x,
            this.y
        );
    }

    disconnect (): void {
        console.log('HEAT: disconnect');
        this.inputSocket = null;
    }

}
