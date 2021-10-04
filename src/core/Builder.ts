import WorldEnvironment from 'core/WorldEnvironment';
import Splitter from 'entity/pipeSystem/Splitter';
import { Building } from 'enums/Building';
import { Depths } from 'enums/Depths';
import GameScene from 'scenes/GameScene';
import Image = Phaser.GameObjects.Image;
import HeatingPlant from 'entity/HeatingPlant';
import Combiner from 'entity/pipeSystem/Combiner';
import Switch from 'entity/pipeSystem/Switch';

export default class Builder {

    private scene: GameScene;
    private worldEnvironment: WorldEnvironment;

    private buildMode: Building|null = null;
    private previewImage: Image;

    constructor (scene: GameScene, worldEnvironment: WorldEnvironment) {
        this.scene = scene;
        this.worldEnvironment = worldEnvironment;

        this.previewImage = this.scene.add.image(-1000, -1000, 'assets', 'splitter').setDepth(Depths.BUILD_ICON).setVisible(false);

        this.scene.input.on('pointerdown', (pointer, obj) => {
            if (!this.isBuildMode()) return;
            this.finishBuilding(pointer.worldX, pointer.worldY);
        });
    }

    update (): void {
        if (this.buildMode !== null) {
            this.previewImage.setPosition(this.scene.input.activePointer.worldX, this.scene.input.activePointer.worldY).setVisible(true);
        }
    }

    startBuild (building: Building): void {
        if (this.isBuildMode()) return;

        this.scene.ui.showBuildMode(building.toString());
        this.previewImage.setFrame(building.toString());
        console.log('start build');
        this.buildMode = building;
    }

    isBuildMode (): boolean {
        return !!this.buildMode;
    }

    finishBuilding (worldX: number, worldY: number): void {
        if (!this.isBuildMode()) return;

        if (this.buildMode === Building.SPLITTER) {
            const obj = new Splitter(this.scene, worldX, worldY);
            this.worldEnvironment.splitters.add(obj);
        } else if (this.buildMode === Building.SWITCH) {
            const obj = new Switch(this.scene, worldX, worldY);
            this.worldEnvironment.switches.add(obj);
        } else if (this.buildMode === Building.COMBINER) {
            const obj = new Combiner(this.scene, worldX, worldY);
            this.worldEnvironment.combiners.add(obj);
        } else if (this.buildMode === Building.HEATING_PLANT) {
            const obj = new HeatingPlant(this.scene, worldX, worldY);
            this.worldEnvironment.heaterGroup.add(obj);
        }

        this.previewImage.setPosition(-100, -100).setVisible(false);
        this.buildMode = null;
    }

    cancelBuilding (): void {
        this.previewImage.setPosition(-100, -100).setVisible(false);
        this.buildMode = null;
        this.scene.ui.hideBuildMode();
    }
}
