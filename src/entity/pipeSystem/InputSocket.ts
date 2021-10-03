import { OutputSocket } from 'entity/pipeSystem/OutputSocket';
import Vector2 = Phaser.Math.Vector2;
import PipeVisual from 'entity/pipeSystem/PipeVisual';

export interface InputSocket {
    getInputSocket(): OutputSocket | null;
    setInputSocket(object: OutputSocket, pipe: PipeVisual): void;
    getRequiredHeat(): number;
    sendHeat(heatValue: number): void;
    getPosition(): Vector2;
    disconnect(): void;
}
