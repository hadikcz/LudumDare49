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

import NumberHelpers from 'helpers/NumberHelpers';

import consumerBuilding from './consumerBuilding.json';

export default class ConsumerBuildingX extends Building implements InputSocket, PipeSystemObject {

    private inputSocket: OutputSocket | null = null;
    private heatDeposit = 0;
    private lowLimit: number;
    private highLimit: number;
    private overlay: Phaser.GameObjects.Sprite;
    private heatText: Phaser.GameObjects.Text;
    private pipeVisual: PipeVisual|null = null;
    private healthbar: ProgressBarUI;
    private warnIcon: Image;
    private previousHeat = -9999;

    private colors = {
        hot: 0xe9373a,
        ok: 0x7fc719,
        cold: 0x8bd0ba,
    };

    private snowflakeIcon: Phaser.GameObjects.Image;
    private consumerBuildingCoordsBuilding: ConsumerBuildingSettings;
    private growDecreaseHeatIcon: Phaser.GameObjects.Image;

    constructor (scene: GameScene, x: number, y: number, image: string) {
        super(scene, x, y, image);

        this.consumerBuildingCoordsBuilding = consumerBuilding[image];
        if (this.consumerBuildingCoordsBuilding === undefined) {
            this.consumerBuildingCoordsBuilding = consumerBuilding['house'] as any as ConsumerBuildingSettings;
        }

        // this.highLimit = this.getRequiredHeat() * 10;
        // this.lowLimit = this.getRequiredHeat() * -10;
        this.lowLimit = this.consumerBuildingCoordsBuilding.heat.lowLimit;
        this.highLimit = this.consumerBuildingCoordsBuilding.heat.highLimit;

        const style = { fontFamily: 'arcadeclassic, Arial', fontSize: 65, color: '#feda09', align: 'center' };

        // #region UI
        this.warnIcon = this.scene.add.image(this.x + this.consumerBuildingCoordsBuilding.bar.x - 4, this.y + this.consumerBuildingCoordsBuilding.bar.y - 42, 'assets', 'ui_warn').setScale(1.2);
        this.warnIcon.setVisible(false);
        this.warnIcon.setDepth(Depths.UI1);
        this.scene.add.tween({
            targets: this.warnIcon,
            scaleX: 0.8,
            scaleY: 0.8,
            duration: 500,
            yoyo: true,
            repeat: Infinity
        });
        this.snowflakeIcon = this.scene.add.image(this.x + this.consumerBuildingCoordsBuilding.bar.x + 17, this.y, 'assets', 'ui_snowflake').setScale(1.1);
        this.snowflakeIcon.setVisible(false);
        this.snowflakeIcon.setDepth(Depths.UI1);

        this.scene.add.tween({
            targets: this.snowflakeIcon,
            scaleX: 0.9,
            scaleY: 0.9,
            duration: 500,
            yoyo: true,
            repeat: Infinity
        });

        this.healthbar = new ProgressBarUI(this.scene, {
            x: this.x + this.consumerBuildingCoordsBuilding.bar.x,
            y: this.y + this.consumerBuildingCoordsBuilding.bar.y,
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

        this.growDecreaseHeatIcon = this.scene.add.image(this.x + this.consumerBuildingCoordsBuilding.bar.x + 5, this.y,'assets', 'heat_grow');
        this.growDecreaseHeatIcon.setVisible(false);
        this.growDecreaseHeatIcon.setDepth(Depths.UI1);

        // @ts-ignore
        this.heatText = this.scene.add.text(this.x + this.consumerBuildingCoordsBuilding.heatText.x, this.y + this.consumerBuildingCoordsBuilding.heatText.y, '', style)
            .setScale(0.2)
            .setStroke('#7c6e1b', 30)
            .setDepth(Depths.UI_HEAT_TEXT)
            .setVisible(false);

        // #endregion

        this.overlay = this.scene.add.sprite(0, 0, 'assets', image + '_overlay').setAlpha(0.00001);
        this.overlay.setInteractive({ useHandCursor: true });
        this.add(this.overlay);

        this.overlay.on('pointerdown', () => {
            if (this.scene.pipeSystem.isDisconnectMode()) {
                this.pipeVisual?.destroy();
            }
            if (this.scene.pipeSystem.isConnectingMode()) {
                this.scene.pipeSystem.completeConnecting(this);
            }

            if (this.scene.destroyer.isDestroyMode()) {
                if (confirm('Are you really want to destroy ' + this.frameName + '?')) {
                    this.pipeVisual?.destroy();
                    this.disconnect();
                    setTimeout(() => {
                        this.destroy();
                    }, 300);
                }
            }
        });

        this.overlay.on('pointerover', () => {
            // this.heatText.setVisible(true);
            if (this.visible) {
                this.heatText.setVisible(true);
                this.overlay.setAlpha(1);
            }
            if (!this.scene.pipeSystem.isConnectingMode()) return;
        });
        //
        this.overlay.on('pointerout', () => {
            this.heatText.setVisible(false);
            // this.heatText.setVisible(false);
            this.overlay.setAlpha(0.00001);
        });

        setTimeout(() => {
            this.scene.time.addEvent({
                delay: 20000,
                callbackScope: this,
                repeat: Infinity,
                callback: () => {
                    if (!this.active) return;
                    if (this.scene.pause.isPaused()) return;
                    this.updateMoney();
                }
            });
        }, NumberHelpers.randomIntInRange(0, 6000));

        this.scene.time.addEvent({
            delay: 500,
            repeat: Infinity,
            callbackScope: this,
            callback: () => {
                if (!this.active) return;
                this.growDecreaseHeatIcon.setVisible(true);
                if (this.previousHeat === -9999) {
                    this.previousHeat = this.heatDeposit;
                    return;
                }

                if (this.previousHeat === this.heatDeposit) {
                    this.growDecreaseHeatIcon.setAlpha(0);
                } else if (this.previousHeat > this.heatDeposit) {
                    this.growDecreaseHeatIcon.setAlpha(1);
                    this.growDecreaseHeatIcon.setFrame('heat_down');
                } else if (this.previousHeat < this.heatDeposit) {
                    this.growDecreaseHeatIcon.setAlpha(1);
                    this.growDecreaseHeatIcon.setFrame('heat_grow');
                }

                this.previousHeat = this.heatDeposit;
            }
        });
    }

    preUpdate (): void {
        this.heatText.setText(this.heatDeposit.toString());
        this.calcAndProcessPercent();

        if (this.active) {
            this.processCollideWithNearBuilding();
        }
    }

    updateHeat (): void {
        if (!this.active) return;
        if (this.heatDeposit < 0) {
        } else if (this.heatDeposit >= this.highLimit) {
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
            this.heatDeposit -= this.getRequiredHeat();
        }
    }

    getInputSocket (): OutputSocket | null {
        return this.inputSocket;
    }

    getRequiredHeat (): number {
        // disable night shift
        // if (this.scene.dayNightSystem.isNight() && this.isIndustrial()) {
        //     return 0;
        // }
        return this.consumerBuildingCoordsBuilding.heat.require;
    }

    sendHeat (heatValue: number): void {
        if (this.heatDeposit + heatValue >= this.highLimit) {
            console.log(this.highLimit);
            this.heatDeposit = this.highLimit;
            return;
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

    updateMoney (): void {
        if (this.getRequiredHeat() === 0) return;
        if (!this.calcAndProcessPercent()) return;

        this.scene.money += this.consumerBuildingCoordsBuilding.happyProduceMoney;

        this.scene.effectManager.launchFlyText(this.x, this.y, this.consumerBuildingCoordsBuilding.happyProduceMoney.toString());
    }

    destroy (fromScene?: boolean): void {
        super.destroy(fromScene);
        this.heatText.destroy();
        this.overlay.destroy();
        this.healthbar.destroy();
        this.warnIcon.destroy();
        this.snowflakeIcon.destroy();
        this.growDecreaseHeatIcon.destroy();
        this.stopSteam();
    }

    private calcAndProcessPercent (): boolean {
        let start = this.lowLimit;
        let end = this.highLimit;


        let percent = ((this.heatDeposit + Math.abs(start)) / (Math.abs(start) + end)) * 100;
        this.healthbar.setPercent(percent);

        let color;
        if (percent < 20) {
            color = this.colors.cold;
            // this.warnIcon.setVisible(false);
            // this.snowflakeIcon.setVisible(true);
        } else if (percent >=20 && percent < 80) {
            color = this.colors.ok;
            // this.snowflakeIcon.setVisible(false);
            // this.warnIcon.setVisible(false);
        } else {
            color = this.colors.hot;
        }

        // icons
        let happy = false;
        if (percent < 5) {
            this.warnIcon.setVisible(false);
            this.snowflakeIcon.setVisible(true);
        } else if (percent >=5 && percent < 95) {
            happy = true;
            this.snowflakeIcon.setVisible(false);
            this.warnIcon.setVisible(false);
        } else {
            this.snowflakeIcon.setVisible(false);
            this.warnIcon.setVisible(true);
        }

        this.healthbar.setTint(color);

        return happy;
    }

    setVisible (value: boolean): this {
        this.healthbar.setVisible(value);

        return super.setVisible(value);
    }

    private processCollideWithNearBuilding (): void {
        const cleanFunction = (object: Image) => {
            if (object === undefined) return;
            if (!object.active) return;

            if (Phaser.Geom.Intersects.RectangleToRectangle(
                this.getImageBounds(),
                // @ts-ignore
                object.getImageBounds()
            )) {
                this.destroy(true);
            }
        };

        try {
            for (let child of this.scene.worldEnvironment.heaterGroup.getChildren()) {
                cleanFunction(child as any as Image);
            }
            for (let child of this.scene.worldEnvironment.combiners.getChildren()) {
                cleanFunction(child as any as Image);
            }
            for (let child of this.scene.worldEnvironment.switches.getChildren()) {
                cleanFunction(child as any as Image);
            }
            for (let child of this.scene.worldEnvironment.splitters.getChildren()) {
                cleanFunction(child as any as Image);
            }
            for (let child of this.scene.worldEnvironment.balancers.getChildren()) {
                cleanFunction(child as any as Image);
            }
        } catch (e) {

        }
    }

}
