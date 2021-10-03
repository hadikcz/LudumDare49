import Building from 'entity/Building';
import { InputSocket } from 'entity/pipeSystem/InputSocket';
import { OutputSocket } from 'entity/pipeSystem/OutputSocket';
import { PipeSystemObject } from 'entity/pipeSystem/PipeSystemObject';
import GameScene from 'scenes/GameScene';
import Vector2 = Phaser.Math.Vector2;

export default class ConsumerBuilding extends Building implements InputSocket, PipeSystemObject {

    private inputSocket: OutputSocket | null = null;
    private heatDeposit = 0;
    private lowLimit: number;
    private highLimit: number;
    private overlay: Phaser.GameObjects.Sprite;

    constructor (scene: GameScene, x: number, y: number, image: string) {
        super(scene, x, y, image);

        this.lowLimit = -5;
        this.highLimit = this.getRequiredHeat() * 5;

        this.overlay = this.scene.add.sprite(0, 0, 'assets', image + '_overlay').setAlpha(0.00001);
        this.overlay.setInteractive({ useHandCursor: true });
        this.add(this.overlay);

        this.overlay.on('pointerdown', () => {
            if (!this.scene.pipeSystem.isConnectingMode()) return;
            console.log('connect');
            this.scene.pipeSystem.completeConnecting(this);
        });

        this.overlay.on('pointerover', () => {
            if (!this.scene.pipeSystem.isConnectingMode()) return;
            this.overlay.setAlpha(1);
        });
        //
        this.overlay.on('pointerout', () => {
            this.overlay.setAlpha(0.00001);
        });
    }

    updateHeat (): void {
        console.log('HEAT: coinsumer update heat');
        if (this.heatDeposit < 0) {
            console.log('Building is freezing');
        } else if (this.heatDeposit > this.highLimit) {
            console.log('house is too hot');
        }
        this.heatDeposit--;
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

    setInputSocket (object: OutputSocket): void {
        this.inputSocket = object;
    }

    getPosition (): Phaser.Math.Vector2 {
        return new Vector2(
            this.x,
            this.y
        );
    }

}
