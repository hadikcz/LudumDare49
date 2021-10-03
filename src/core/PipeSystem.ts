import WorldEnvironment from 'core/WorldEnvironment';
import HeatingPlant from 'entity/HeatingPlant';
import { OutputSocket } from 'entity/pipeSystem/OutputSocket';
import { SocketType } from 'enums/SocketType';
import GameScene from 'scenes/GameScene';
import Line = Phaser.GameObjects.Line;
import ConsumerBuilding from 'entity/ConsumerBuilding';
import { InputSocket } from 'entity/pipeSystem/InputSocket';
import PipeVisual from 'entity/pipeSystem/PipeVisual';

export default class PipeSystem {

    private worldEnvironment: WorldEnvironment;
    private scene: GameScene;
    private selectedOutputSocket: OutputSocket|null = null;

    private pipeVisual: Line | null = null;
    private pipesVisuals: PipeVisual[] = [];

    constructor (scene: GameScene, worldEnvironment: WorldEnvironment) {
        this.scene = scene;
        this.worldEnvironment = worldEnvironment;
    }

    update (): void {
        if (!this.selectedOutputSocket || !this.pipeVisual) return;

        const startPos = this.selectedOutputSocket.getPosition();
        this.pipeVisual.setTo(startPos.x, startPos.y, this.scene.input.activePointer.worldX, this.scene.input.activePointer.worldY);


    }

    updateHeat (): void {
        console.log('HEAT: tick heat system');

        // @ts-ignore
        for (let object of this.worldEnvironment.heaterGroup.getChildren()) {
            let heatingPlant = object as any as HeatingPlant;
            heatingPlant.updateHeat();
        }

        for (let object of this.worldEnvironment.buildingsGroup.getChildren()) {
            let building = object as any as ConsumerBuilding;
            building.updateHeat();
        }
    }

    startConnecting (output: OutputSocket): void {
        if (this.selectedOutputSocket !== null) {
            console.error('HEAT: Cant select another output socket, because one is already using');
            return;
        }

        this.selectedOutputSocket = output;
        this.scene.ui.showSocket(SocketType.INPUT);

        this.createPipeCursor();
    }

    completeConnecting (input: InputSocket): void {
        if (this.selectedOutputSocket === null) {
            console.error('HEAT: Cant finish connecting becuase output is missing');
            return;
        }

        // create visual cable
        const outputPos = this.selectedOutputSocket.getPosition();
        const inputPos = input.getPosition();
        const pipe = new PipeVisual(
            this.scene,
            outputPos.x,
            outputPos.y,
            inputPos.x,
            inputPos.y
        );
        this.pipesVisuals.push(pipe);

        // real connection
        this.selectedOutputSocket.setOutputObject(input);
        input.setInputSocket(this.selectedOutputSocket);

        this.selectedOutputSocket = null;

        this.scene.ui.hideSocket();
    }

    cancelConnecting (): void {
        if (this.selectedOutputSocket === null) {
            console.error('HEAT: cant cancel selecting, no socket selected');
            return;
        }

        this.selectedOutputSocket = null;
        this.pipeVisual?.destroy(true);
        this.scene.ui.hideSocket();
    }

    isConnectingMode (): boolean {
        return !!this.selectedOutputSocket;
    }

    private createPipeCursor (): void {
        if (!this.selectedOutputSocket) return;
        console.log('create pipe');
        const startPos = this.selectedOutputSocket.getPosition();
        this.pipeVisual = this.scene.add.line(0, 0, startPos.x, startPos.y, this.scene.input.activePointer.worldX, this.scene.input.activePointer.worldY, 0x6f6f8d, 1)
            .setLineWidth(2);
    }
}