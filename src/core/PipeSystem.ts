import WorldEnvironment from 'core/WorldEnvironment';
import HeatingPlant from 'entity/HeatingPlant';
import { OutputSocket } from 'entity/pipeSystem/OutputSocket';
import { SocketType } from 'enums/SocketType';
import GameScene from 'scenes/GameScene';
import Line = Phaser.GameObjects.Line;
import ConsumerBuildingX from 'entity/ConsumerBuildingX';
import Balancer from 'entity/pipeSystem/Balancer';
import { BalancerTarget } from 'entity/pipeSystem/BalancerTarget';
import Combiner from 'entity/pipeSystem/Combiner';
import { InputSocket } from 'entity/pipeSystem/InputSocket';
import PipeVisual from 'entity/pipeSystem/PipeVisual';
import Splitter from 'entity/pipeSystem/Splitter';
import Switch from 'entity/pipeSystem/Switch';
import { SplitterTarget } from 'enums/SplitterTarget';
import Vector2 = Phaser.Math.Vector2;
import { Depths } from 'enums/Depths';

export default class PipeSystem {

    private worldEnvironment: WorldEnvironment;
    private scene: GameScene;
    private selectedOutputSocket: OutputSocket|null = null;
    private disconnectMode = false;

    private pipeVisual: Line | null = null;
    private pipesVisuals: PipeVisual[] = [];
    private splitterBalancerTarget: SplitterTarget|BalancerTarget|null = null;

    private showAll = true;
    private firedHideAll = false;
    private isConnectCoolledDown = true;

    private lastPos: Vector2|null = null;
    private positions: Vector2[] = [];
    private pipeVisualMulti: Phaser.GameObjects.Graphics|null = null;

    private previousPathLines: Line[] = [];

    constructor (scene: GameScene, worldEnvironment: WorldEnvironment) {
        this.scene = scene;
        this.worldEnvironment = worldEnvironment;

        this.scene.input.on('pointerdown', () => {
            if (!this.isConnectingMode() || !this.lastPos) return;
            const worldX = this.scene.input.activePointer.worldX;
            const worldY = this.scene.input.activePointer.worldY;

            const line = this.scene.add.line(0, 0, this.lastPos.x, this.lastPos.y, worldX, worldY, 0x6f6f8d, 1)
                .setDepth(Depths.PIPES)
                .setOrigin(0)
                .setLineWidth(2);
            this.previousPathLines.push(line);

            this.pipeVisualMulti?.lineTo(worldX, worldY);
            this.lastPos = new Vector2(worldX, worldY);
            this.positions.push(this.lastPos);

            this.pipeVisualMulti?.strokePath();
            this.pipeVisualMulti?.closePath();
        });
    }

    update (): void {
        this.iterateShowAllMode();

        if (!this.selectedOutputSocket || !this.pipeVisual || !this.lastPos) return;

        const startPos = this.selectedOutputSocket.getPosition();
        this.pipeVisual.setTo(this.lastPos.x, this.lastPos.y, this.scene.input.activePointer.worldX, this.scene.input.activePointer.worldY);
    }

    updateHeat (): void {
        try {
            // @ts-ignore
            for (let object of this.worldEnvironment.heaterGroup.getChildren()) {
                let heatingPlant = object as any as HeatingPlant;
                heatingPlant.updateHeat();
            }

            for (let object of this.worldEnvironment.buildingsGroup.getChildren()) {
                let building = object as any as ConsumerBuildingX;
                building.updateHeat();
            }

            for (let object of this.worldEnvironment.factoriesGroup.getChildren()) {
                let building = object as any as ConsumerBuildingX;
                building.updateHeat();
            }

            for (let object of this.worldEnvironment.combiners.getChildren()) {
                let combiner = object as any as Combiner;
                combiner.updateHeat();
            }
        } catch (e) {
            console.error(e);
        }
    }

    startConnecting (output: OutputSocket, splitterBalancerTarget: SplitterTarget|BalancerTarget|null = null): void {
        if (!this.isConnectCoolledDown) return;
        if (this.isDisconnectMode()) return;
        if (this.selectedOutputSocket !== null) {
            console.error('HEAT: Cant select another output socket, because one is already using');
            return;
        }

        this.selectedOutputSocket = output;
        this.splitterBalancerTarget = splitterBalancerTarget;
        this.scene.ui.showSocket(SocketType.INPUT);

        this.createPipeCursor();
        // this.createPipeCursorMulti();
    }

    completeConnecting (input: InputSocket): void {
        if (this.isDisconnectMode()) return;
        if (this.selectedOutputSocket === null) {
            console.error('HEAT: Cant finish connecting becuase output is missing');
            return;
        }

        if (input.getInputSocket()) {
            this.scene.ui.showSocketOccupied();
            this.cancelConnecting();
            return;
        }

        // create visual cable
        const outputPos = this.selectedOutputSocket.getPosition();
        const inputPos = input.getPosition();
        this.positions.push(inputPos);
        const pipe = new PipeVisual(
            this.scene,
            this.positions,
            input,
            this.selectedOutputSocket,
            this.splitterBalancerTarget
        );
        // const pipe = new PipeVisual(
        //     this.scene,
        //     outputPos.x,
        //     outputPos.y,
        //     inputPos.x,
        //     inputPos.y,
        //     input,
        //     this.selectedOutputSocket,
        //     this.splitterBalancerTarget
        // );
        pipe.on('destroy', () => {
            const indexOf = this.pipesVisuals.indexOf(pipe);
            this.pipesVisuals.splice(indexOf, 1);
        });
        this.pipesVisuals.push(pipe);

        // real connection
        this.selectedOutputSocket.setOutputObject(input, pipe);
        input.setInputSocket(this.selectedOutputSocket, pipe);

        this.selectedOutputSocket = null;
        this.splitterBalancerTarget = null;

        this.scene.ui.hideSocket();

        this.pipeVisual?.setVisible(false);
        this.isConnectCoolledDown = false;
        this.positions = [];

        for (let line of this.previousPathLines) {
            line.destroy();
        }
        setTimeout(() => {
            this.isConnectCoolledDown = true;
        }, 100);
    }

    cancelConnecting (): void {
        if (this.selectedOutputSocket === null) {
            console.error('HEAT: cant cancel selecting, no socket selected');
            return;
        }

        this.selectedOutputSocket = null;
        this.splitterBalancerTarget = null;
        this.positions = [];
        this.pipeVisual?.destroy(true);
        this.scene.ui.hideSocket();
        for (let line of this.previousPathLines) {
            line.destroy();
        }
    }

    isConnectingMode (): boolean {
        return !!this.selectedOutputSocket;
    }

    startDisconnectMode (): void {
        this.disconnectMode = true;
        this.scene.ui.showDisconnectMode();
    }

    stopDisconnectMode (): void {
        this.disconnectMode = false;
        this.scene.ui.hideDisconnectMode();
    }

    isDisconnectMode (): boolean {
        return this.disconnectMode;
    }

    startShowAllMode (): void {
        this.showAll = true;
        this.firedHideAll = false;
    }

    stopShowAllMode (): void {
        this.showAll = false;
    }

    isShowAllMode (): boolean {
        return this.showAll;
    }

    private createPipeCursor (): void {
        if (!this.selectedOutputSocket) return;
        const startPos = this.selectedOutputSocket.getPosition();
        this.pipeVisual = this.scene.add.line(0, 0, startPos.x, startPos.y, this.scene.input.activePointer.worldX, this.scene.input.activePointer.worldY, 0x6f6f8d, 1)
            .setLineWidth(2);

        this.lastPos = startPos;
        this.positions.push(startPos);
    }

    private createPipeCursorMulti (): void {
        if (!this.selectedOutputSocket) return;

        const startPos = this.selectedOutputSocket.getPosition();
        this.pipeVisualMulti = this.scene.add.graphics({ x: 0, y: 0 });
        this.pipeVisualMulti.lineStyle(2, 0x6f6f8d);
        this.pipeVisualMulti.beginPath();
        this.pipeVisualMulti.lineTo(startPos.x, startPos.y);
        this.pipeVisualMulti.setDepth(Depths.UI);

        this.lastPos = startPos;
        this.positions.push(startPos);

    }

    private iterateShowAllMode (): void {
        if (!this.isShowAllMode() && this.firedHideAll) return;
        if (!this.isShowAllMode()) {
            this.firedHideAll = true;
        }
        for (let object of this.worldEnvironment.combiners.getChildren()) {
            let combiner = object as any as Combiner;
            if (this.isShowAllMode()) {
                combiner.showAll();
            } else {
                combiner.hideAll();
            }
        }
        for (let object of this.worldEnvironment.switches.getChildren()) {
            let combiner = object as any as Switch;
            if (this.isShowAllMode()) {
                combiner.showAll();
            } else {
                combiner.hideAll();
            }
        }
        for (let object of this.worldEnvironment.splitters.getChildren()) {
            let combiner = object as any as Splitter;
            if (this.isShowAllMode()) {
                combiner.showAll();
            } else {
                combiner.hideAll();
            }
        }
        for (let object of this.worldEnvironment.balancers.getChildren()) {
            let combiner = object as any as Balancer;
            if (this.isShowAllMode()) {
                combiner.showAll();
            } else {
                combiner.hideAll();
            }
        }
    }
}
