import { OutputSocket } from 'entity/pipeSystem/OutputSocket';

export interface InputSocket {
    getInputSocket(): OutputSocket | null;
    setInputSocket(object: OutputSocket): void;
    getRequiredHeat(): number;
    sendHeat(heatValue: number): void;
}
