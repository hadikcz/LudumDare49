import { InputSocket } from 'entity/pipeSystem/InputSocket';
import Vector2 = Phaser.Math.Vector2;
import { BalancerTarget } from 'entity/pipeSystem/BalancerTarget';
import PipeVisual from 'entity/pipeSystem/PipeVisual';
import { SplitterTarget } from 'enums/SplitterTarget';

export interface OutputSocket {
    getOutputObject(): InputSocket | null;
    setOutputObject(object: InputSocket, pipe: PipeVisual): void;
    getOutputPower(): number | null;
    getPosition(): Vector2;
    disconnect(input: boolean, output: boolean, splitterTarget?: SplitterTarget|BalancerTarget|null): void;
}
