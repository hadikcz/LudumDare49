import { InputSocket } from 'entity/pipeSystem/InputSocket';

export interface OutputSocket {
    getOutputObject(): InputSocket | null;
    setOutputObject(object: InputSocket): void;
    getOutputPower(): number | null;
}
