import Building from 'entity/Building';
import { InputSocket } from 'entity/pipeSystem/InputSocket';
import { OutputSocket } from 'entity/pipeSystem/OutputSocket';
import { PipeSystemObject } from 'entity/pipeSystem/PipeSystemObject';
import GameScene from 'scenes/GameScene';
import Vector2 = Phaser.Math.Vector2;
import PipeVisual from 'entity/pipeSystem/PipeVisual';
import { Depths } from 'enums/Depths';
import ProgressBarUI from 'libs/ProgressBarUI';

export default class HeatingPlant extends Building implements OutputSocket, PipeSystemObject {

    private static readonly MAX_HEAT = 100;
    private outputSocketBuilding: InputSocket | null = null;
    private overlay: Phaser.GameObjects.Image;
    private pipeVisual: PipeVisual|null = null;
    private healthbar: ProgressBarUI;
    private heatText: Phaser.GameObjects.Text;
    private plusButton: Phaser.GameObjects.Image;
    private heatGeneration = 0;
    private minusButton: Phaser.GameObjects.Image;
    private plusButton10: Phaser.GameObjects.Image;
    private minusButton10: Phaser.GameObjects.Image;
    private nasobitel: Phaser.GameObjects.Text;

    constructor (scene: GameScene, x: number, y: number) {
        super(scene, x, y, 'heating_plant');

        this.overlay = this.scene.add.sprite(0, 0, 'assets', 'heating_plant_overlay').setAlpha(0.00001);
        this.overlay.setInteractive({ useHandCursor: true });
        this.add(this.overlay);

        // #region UI
        this.healthbar = new ProgressBarUI(this.scene, {
            x: this.x + 75,
            y: this.y + 50,
            angle: 180,
            atlas: 'assets',
            atlasBg: 'ui_progressbar_large',
            atlasBar: 'ui_progressbar_large_inner',
            depth: Depths.UI,
            offsetX: 0,
            offsetY: 0,
            // barAlpha: 0.75,
            bgAlpha: 0.75,
        });
        this.healthbar.setTint(0xffcc68);
        this.healthbar.setPercent(0);

        // plus
        this.plusButton = this.scene.add.image(
            this.x + 85,
            this.y + 20,
            'assets',
            'ui_plus'
        )
            .setDepth(Depths.UI)
            .setInteractive({ useHandCursor: true });

        // minus
        this.minusButton = this.scene.add.image(
            this.x + 85,
            this.y + 40,
            'assets',
            'ui_minus'
        )
            .setDepth(Depths.UI)
            .setInteractive({ useHandCursor: true });

        this.plusButton.on('pointerdown', () => {
            if (this.heatGeneration > 100) return;
            this.heatGeneration++;
        });

        this.minusButton.on('pointerdown', () => {
            if (this.heatGeneration <= 0) return;
            this.heatGeneration--;
        });

        // 10
        const style2 = { fontFamily: 'arcadeclassic, Arial', fontSize: 65, color: '#feda09', align: 'center' };
        const modifyTextX2 = 90;
        const modifyTextY2 = -5;

        this.nasobitel = this.scene.add.text(this.x + modifyTextX2, this.y + modifyTextY2, 'x10', style2)
            .setScale(0.2)
            .setDepth(Depths.UI);
        // plus 10
        this.plusButton10 = this.scene.add.image(
            this.x + 85 + 16,
            this.y + 20,
            'assets',
            'ui_plus'
        )
            .setDepth(Depths.UI)
            .setInteractive({ useHandCursor: true });

        // minus 10
        this.minusButton10 = this.scene.add.image(
            this.x + 85 + 16,
            this.y + 40,
            'assets',
            'ui_minus'
        )
            .setDepth(Depths.UI)
            .setInteractive({ useHandCursor: true });

        this.plusButton10.on('pointerdown', () => {
            if (this.heatGeneration > 100) return;
            this.heatGeneration += 10;
            if (this.heatGeneration > 100) {
                this.heatGeneration = 100;
            }
        });

        this.minusButton10.on('pointerdown', () => {
            if (this.heatGeneration <= 0) return;
            this.heatGeneration -= 10;
            if (this.heatGeneration < 0) {
                this.heatGeneration = 0;
            }
        });

        const style = { fontFamily: 'arcadeclassic, Arial', fontSize: 65, color: '#feda09', align: 'center' };
        const modifyTextX = 62;
        const modifyTextY = -55;

        this.heatText = this.scene.add.text(this.x + modifyTextX, this.y + modifyTextY, '11', style)
            .setScale(0.2)
            .setStroke('#7c6e1b', 30)
            .setDepth(Depths.UI);
        this.healthbar.setPercent(this.getOutputPower());
        // this.progressBar.hide();

        this.overlay.on('pointerdown', () => {
            if (this.scene.pipeSystem.isDisconnectMode()) {
                this.pipeVisual?.destroy(true);
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

        // #endregion
    }

    preUpdate (): void {
        this.heatText.setText(this.getOutputPower().toString());
        this.healthbar.setPercent(this.getOutputPower());

        let targetTime = 10000;
        if (this.heatGeneration > 0 && this.heatGeneration <= 10) {
            targetTime = 700;
        }
        if (this.heatGeneration > 10 && this.heatGeneration <= 30) {
            targetTime = 600;
        }
        if (this.heatGeneration > 30 && this.heatGeneration <= 50) {
            targetTime = 500;
        }
        if (this.heatGeneration > 50 && this.heatGeneration <= 70) {
            targetTime = 400;
        }
        if (this.heatGeneration > 70 && this.heatGeneration <= 85) {
            targetTime = 250;
        }
        if (this.heatGeneration > 85) {
            targetTime = 200;
        }
        if (this.timeBetweenSmoke !== targetTime) {
            this.timeBetweenSmoke = targetTime;
            this.startSmoke();
        }
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
        return this.heatGeneration;
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

    destroy (fromScene?: boolean): void {
        super.destroy(fromScene);

        this.heatText.destroy();
        this.healthbar.destroy();
        this.plusButton.destroy();
        this.plusButton10.destroy();
        this.minusButton.destroy();
        this.minusButton10.destroy();
    }

}
