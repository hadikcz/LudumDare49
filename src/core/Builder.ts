import WorldEnvironment from 'core/WorldEnvironment';
import HeatingPlant from 'entity/HeatingPlant';
import Combiner from 'entity/pipeSystem/Combiner';
import Splitter from 'entity/pipeSystem/Splitter';
import Switch from 'entity/pipeSystem/Switch';
import { Building } from 'enums/Building';
import { Depths } from 'enums/Depths';
import TransformHelpers from 'helpers/TransformHelpers';
import GameScene from 'scenes/GameScene';
import Image = Phaser.GameObjects.Image;

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
            const size = this.getBuildingSize(this.buildMode);
            const canPlace = this.canPlace(this.scene.input.activePointer.worldX, this.scene.input.activePointer.worldY, size);
            this.previewImage.setPosition(this.scene.input.activePointer.worldX, this.scene.input.activePointer.worldY).setVisible(true);
            // this.previewImage.

            if (canPlace) {
                this.previewImage.setTint(0x00FF00);
            } else {
                this.previewImage.setTint(0xFF0000);
            }
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

        this.scene.ui.hideBuildMode();
    }

    cancelBuilding (): void {
        this.previewImage.setPosition(-100, -100).setVisible(false);
        this.buildMode = null;
        this.scene.ui.hideBuildMode();
    }

    private canPlace (x, y, size): boolean {
        let nearestValue = Infinity;

        for (let object of this.worldEnvironment.heaterGroup.getChildren()) {
            if (!object.active) continue;
            // @ts-ignore
            let distance = TransformHelpers.getDistanceBetween(x, y, object.x, object.y) - 30;
            if (distance < nearestValue) {
                nearestValue = distance;
            }
        }

        for (let object of this.worldEnvironment.buildingsGroup.getChildren()) {
            if (!object.active) continue;
            // @ts-ignore
            let distance = TransformHelpers.getDistanceBetween(x, y, object.x, object.y);
            if (distance < nearestValue) {
                nearestValue = distance;
            }
        }

        for (let object of this.worldEnvironment.factoriesGroup.getChildren()) {
            if (!object.active) continue;
            // @ts-ignore
            let distance = TransformHelpers.getDistanceBetween(x, y, object.x, object.y);
            if (distance < nearestValue) {
                nearestValue = distance;
            }
        }

        for (let object of this.worldEnvironment.combiners.getChildren()) {
            if (!object.active) continue;
            // @ts-ignore
            let distance = TransformHelpers.getDistanceBetween(x, y, object.x, object.y);
            if (distance < nearestValue) {
                nearestValue = distance;
            }
        }

        for (let object of this.worldEnvironment.splitters.getChildren()) {
            if (!object.active) continue;
            // @ts-ignore
            let distance = TransformHelpers.getDistanceBetween(x, y, object.x, object.y);
            if (distance < nearestValue) {
                nearestValue = distance;
            }
        }

        for (let object of this.worldEnvironment.switches.getChildren()) {
            if (!object.active) continue;
            // @ts-ignore
            let distance = TransformHelpers.getDistanceBetween(x, y, object.x, object.y);
            if (distance < nearestValue) {
                nearestValue = distance;
            }
        }
        console.log(nearestValue);
        return nearestValue > size; // because placing object and object around
    }

    private getBuildingSize (building: Building): number {
        switch (building) {
            case Building.HEATING_PLANT:
                return 100;
            case Building.COMBINER:
            case Building.SWITCH:
            case Building.SPLITTER:
                return 32;
            default:
                return 32;
        }
    }

    private getSizeOfBuildingByFrameName (frameName: string): number {
        const frame = this.scene.textures.getFrame('assets', frameName);
        if (!frame) {
            console.error('frame not found ' + frameName);
            return 32;
        }
        let size = (frame.width + frame.height) / 2;

        return size;
    }
}
