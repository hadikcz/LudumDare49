import { InputSocket } from 'entity/pipeSystem/InputSocket';
import Vector2 = Phaser.Math.Vector2;
import PipeVisual from 'entity/pipeSystem/PipeVisual';

export interface DoubleOutputSocket {
    getStaticOutputObject(): InputSocket | null;
    setStaticOutputObject(object: InputSocket, pipe: PipeVisual): void;

    getVariableOutputObject(): InputSocket | null;
    setVariableOutputObject(object: InputSocket, pipe: PipeVisual): void;

    getOutputPower(): number | null;
    getPosition(): Vector2;
}
