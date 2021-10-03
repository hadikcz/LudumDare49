import WorldEnvironment from 'core/WorldEnvironment';
import HeatingPlant from 'entity/HeatingPlant';
import { OutputSocket } from 'entity/pipeSystem/OutputSocket';
import { SocketType } from 'enums/SocketType';
import GameScene from 'scenes/GameScene';

export default class PipeSystem {

    private worldEnvironment: WorldEnvironment;
    private scene: GameScene;
    private selectedOutputSocket: OutputSocket|null = null;

    constructor (scene: GameScene, worldEnvironment: WorldEnvironment) {
        this.scene = scene;
        this.worldEnvironment = worldEnvironment;
    }

    updateHeat (): void {
        console.log('HEAT: tick heat system');

        // @ts-ignore
        for (let object of this.worldEnvironment.heaterGroup.getChildren()) {
            let heatingPlant = object as any as HeatingPlant;
            heatingPlant.updateHeat();
        }
    }

    startConnecting (output: OutputSocket): void {
        if (this.selectedOutputSocket !== null) {
            console.error('HEAT: Cant select another output socket, because one is already using');
            return;
        }

        this.selectedOutputSocket = output;
        this.scene.ui.showSocket(SocketType.OUTPUT);
    }
}
