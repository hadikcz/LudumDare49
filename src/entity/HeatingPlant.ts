import Building from 'entity/Building';
import { InputSocket } from 'entity/pipeSystem/InputSocket';
import { OutputSocket } from 'entity/pipeSystem/OutputSocket';
import { PipeSystemObject } from 'entity/pipeSystem/PipeSystemObject';
import GameScene from 'scenes/GameScene';
import Vector2 = Phaser.Math.Vector2;
import PipeVisual from 'entity/pipeSystem/PipeVisual';

export default class HeatingPlant extends Building implements OutputSocket, PipeSystemObject {

    private outputSocketBuilding: InputSocket | null = null;
    private overlay: Phaser.GameObjects.Image;
    private pipeVisual: PipeVisual|null = null;

    constructor (scene: GameScene, x: number, y: number) {
        super(scene, x, y, 'heating_plant');

        this.overlay = this.scene.add.sprite(0, 0, 'assets', 'heating_plant_overlay').setAlpha(0.00001);
        this.overlay.setInteractive({ useHandCursor: true });
        this.add(this.overlay);

        this.overlay.on('pointerdown', () => {
            if (this.scene.pipeSystem.isDisconnectMode()) {
                this.pipeVisual?.destroy();
            } else {
                if (this.outputSocketBuilding) {
                    this.scene.ui.showSocketOccupied();
                } else {
                    this.scene.pipeSystem.startConnecting(this);
                }
            }
        });

        this.overlay.on('pointerover', () => {
            console.log('pointerover');
            this.overlay.setAlpha(1);
        });
        //
        this.overlay.on('pointerout', () => {
            this.overlay.setAlpha(0.00001);
        });
    }

    updateHeat (): void {
        console.log('HEAT: tick heating plant');
        const outputObject = this.getOutputObject();
        if (!outputObject) return;

        outputObject.sendHeat(
            this.getOutputPower()
        );
    }

    getOutputObject (): InputSocket | null {
        return this.outputSocketBuilding;
    }

    setOutputObject (object: InputSocket, pipe: PipeVisual): void {
        this.outputSocketBuilding = object;
        this.pipeVisual = pipe;
    }

    getOutputPower (): number {
        return 100;
    }

    getPosition (): Phaser.Math.Vector2 {
        return new Vector2(
            this.x,
            this.y
        );
    }

    disconnect (): void {
        console.log('HEAT: disconnect');
        this.outputSocketBuilding = null;
    }

}
