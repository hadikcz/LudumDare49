import { InputSocket } from 'entity/pipeSystem/InputSocket';
import Vector2 = Phaser.Math.Vector2;
import PipeVisual from 'entity/pipeSystem/PipeVisual';

export interface OutputSocket {
    getOutputObject(): InputSocket | null;
    setOutputObject(object: InputSocket, pipe: PipeVisual): void;
    getOutputPower(): number | null;
    getPosition(): Vector2;
    disconnect(onlyInput: boolean): void;
}
