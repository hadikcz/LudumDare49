import Building from 'entity/Building';
import { InputSocket } from 'entity/pipeSystem/InputSocket';
import { OutputSocket } from 'entity/pipeSystem/OutputSocket';
import { PipeSystemObject } from 'entity/pipeSystem/PipeSystemObject';
import GameScene from 'scenes/GameScene';

export default class ConsumerBuilding extends Building implements InputSocket, PipeSystemObject {


    private inputSocket: OutputSocket | null = null;
    private heatDeposit = 0;
    private lowLimit: number;
    private highLimit: number;

    constructor (scene: GameScene, x: number, y: number, image: string) {
        super(scene, x, y, image);

        this.lowLimit = -5;
        this.highLimit = this.getRequiredHeat() * 5;
    }

    updateHeat (): void {
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
        this.heatDeposit += heatValue;
    }

    setInputSocket (object: OutputSocket): void {
        this.inputSocket = object;
    }

}
