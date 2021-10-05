import { InputSocket } from 'entity/pipeSystem/InputSocket';
import Vector2 = Phaser.Math.Vector2;

export interface DoubleStableOutputSocket {

    getFirstOutputObject(): InputSocket | null;

    getSecondOutputObject(): InputSocket | null;

    getOutputPower(): number | null;
    getPosition(): Vector2;
}
