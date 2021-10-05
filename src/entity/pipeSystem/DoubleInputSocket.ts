import { OutputSocket } from 'entity/pipeSystem/OutputSocket';
import Vector2 = Phaser.Math.Vector2;
import PipeVisual from 'entity/pipeSystem/PipeVisual';

export interface DoubleInputSocket {
    getInputSocketFirst(): OutputSocket | null;
    setInputSocketFirst(object: OutputSocket, pipe: PipeVisual): void;
    getInputSocketSecond(): OutputSocket | null;
    setInputSocketSecond(object: OutputSocket, pipe: PipeVisual): void;

    getRequiredHeat(): number;
    sendHeat(heatValue: number): void;
    getPosition(): Vector2;
}
