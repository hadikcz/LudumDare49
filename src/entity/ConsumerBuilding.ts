import Building from 'entity/Building';
import { InputSocket } from 'entity/pipeSystem/InputSocket';
import { OutputSocket } from 'entity/pipeSystem/OutputSocket';
import { PipeSystemObject } from 'entity/pipeSystem/PipeSystemObject';
import GameScene from 'scenes/GameScene';
import Vector2 = Phaser.Math.Vector2;
import PipeVisual from 'entity/pipeSystem/PipeVisual';
import { Depths } from 'enums/Depths';
import ProgressBarUI from 'libs/ProgressBarUI';
import Image = Phaser.GameObjects.Image;

export default class ConsumerBuilding extends Building implements InputSocket, PipeSystemObject {

    private inputSocket: OutputSocket | null = null;
    private heatDeposit = 0;
    private lowLimit: number;
    private highLimit: number;
    private overlay: Phaser.GameObjects.Sprite;
    private heatText: Phaser.GameObjects.Text;
    private pipeVisual: PipeVisual|null = null;
    private healthbar: ProgressBarUI;
    private warnIcon: Image;

    private colors = {
        hot: 0xe9373a,
        ok: 0x7fc719,
        cold: 0x8bd0ba,
    };

    private snowflakeIcon: Phaser.GameObjects.Image;

    constructor (scene: GameScene, x: number, y: number, image: string) {
        super(scene, x, y, image);

        this.lowLimit = this.getRequiredHeat() * -10;
        this.highLimit = this.getRequiredHeat() * 10;

        const style = { fontFamily: 'arcadeclassic, Arial', fontSize: 65, color: '#feda09', align: 'center' };
        const modifyTextX = -15;
        const modifyTextY = -35;

        // #region UI
        this.warnIcon = this.scene.add.image(25, -30, 'assets', 'ui_warn').setScale(1.2);
        this.warnIcon.setVisible(false);
        this.add(this.warnIcon);
        this.scene.add.tween({
            targets: this.warnIcon,
            scaleX: 0.8,
            scaleY: 0.8,
            duration: 500,
            yoyo: true,
            repeat: Infinity
        });
        this.snowflakeIcon = this.scene.add.image(45, 0, 'assets', 'ui_snowflake').setScale(1.1);
        this.snowflakeIcon.setVisible(false);
        this.add(this.snowflakeIcon);
        this.scene.add.tween({
            targets: this.snowflakeIcon,
            scaleX: 0.9,
            scaleY: 0.9,
            duration: 500,
            yoyo: true,
            repeat: Infinity
        });

        this.healthbar = new ProgressBarUI(this.scene, {
            x: this.x + 28,
            y: this.y + 13,
            angle: 180,
            atlas: 'assets',
            atlasBg: 'ui_progressbar_small',
            atlasBar: 'ui_progressbar_small_inner',
            depth: Depths.UI,
            offsetX: 0,
            offsetY: 0,
            // barAlpha: 0.75,
            bgAlpha: 0.75,
        });
        this.healthbar.setTint(this.colors.ok);
        this.healthbar.setPercent(50);

        this.heatText = this.scene.add.text(this.x + modifyTextX, this.y + modifyTextY, '', style)
            .setScale(0.2)
            .setStroke('#7c6e1b', 30)
            .setDepth(Depths.UI);

        // #endregion

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
        if (this.heatDeposit < 0) {
        } else if (this.heatDeposit > this.highLimit) {
            if (this.steamInterval === undefined) {
                this.handleSteam();
            }
        } else {
            if (this.steamInterval !== undefined) {
                this.stopSteam();
            }
        }
        if (this.heatDeposit <=this.lowLimit) {
            this.heatDeposit = this.lowLimit;
        } else {
            this.heatDeposit--;
        }

        this.heatText.setText(this.heatDeposit.toString());
        this.calcAndProcessPercent();
    }

    getInputSocket (): OutputSocket | null {
        return this.inputSocket;
    }

    getRequiredHeat (): number {
        return 1;
    }

    sendHeat (heatValue: number): void {
        console.log('HEAT: building recieve heat ' + heatValue);
        if (this.heatDeposit + heatValue > this.highLimit) {
            this.heatDeposit = this.highLimit;
        }
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
        this.inputSocket = null;
    }

    destroy (fromScene?: boolean) {
        super.destroy(fromScene);
        this.heatText.destroy();
        this.overlay.destroy();
        this.healthbar.destroy();
    }

    private calcAndProcessPercent (): void {
        let start = this.lowLimit;
        let end = this.highLimit;


        let percent = ((this.heatDeposit + Math.abs(start)) / (Math.abs(start) + end)) * 100;
        this.healthbar.setPercent(percent);

        let color;
        if (percent < 10) {
            color = this.colors.cold;
            this.warnIcon.setVisible(false);
            this.snowflakeIcon.setVisible(true);
        } else if (percent >=10 && percent < 90) {
            color = this.colors.ok;
            this.snowflakeIcon.setVisible(false);
            this.warnIcon.setVisible(false);
        } else {
            color = this.colors.hot;
            this.snowflakeIcon.setVisible(false);
            this.warnIcon.setVisible(true);
        }

        this.healthbar.setTint(color);
    }

}
