import { OutputSocket } from 'entity/pipeSystem/OutputSocket';
import Vector2 = Phaser.Math.Vector2;

export interface InputSocket {
    getInputSocket(): OutputSocket | null;
    setInputSocket(object: OutputSocket): void;
    getRequiredHeat(): number;
    sendHeat(heatValue: number): void;
    getPosition(): Vector2;
}
