import { InputSocket } from 'entity/pipeSystem/InputSocket';
import Vector2 = Phaser.Math.Vector2;
import PipeVisual from 'entity/pipeSystem/PipeVisual';
import { SplitterTarget } from 'enums/SplitterTarget';

export interface OutputSocket {
    getOutputObject(): InputSocket | null;
    setOutputObject(object: InputSocket, pipe: PipeVisual): void;
    getOutputPower(): number | null;
    getPosition(): Vector2;
    disconnect(onlyInput: boolean, splitterTarget?: SplitterTarget|null): void;
}
