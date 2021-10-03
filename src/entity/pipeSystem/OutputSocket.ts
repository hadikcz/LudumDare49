import { InputSocket } from 'entity/pipeSystem/InputSocket';
import Vector2 = Phaser.Math.Vector2;

export interface OutputSocket {
    getOutputObject(): InputSocket | null;
    setOutputObject(object: InputSocket): void;
    getOutputPower(): number | null;
    getPosition(): Vector2;
}
