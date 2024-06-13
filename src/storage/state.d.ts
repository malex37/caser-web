import { TaskData } from '@models/TaskData';
import { StorageStateFields } from './StateFields';
import { BoardData } from '@models/BoardData';
import { UserData } from '@models/UserData';
import { Team } from '@models/Team';
interface State {
    [StorageStateFields.Tasks]: {
        [id: string]: TaskData;
    };
    [StorageStateFields.Boards]: {
        [id: string]: BoardData;
    };
    [StorageStateFields.AssignedTasks]: {
        [user: string]: string[];
    };
    [StorageStateFields.User]: UserData | {};
    [StorageStateFields.Team]: Team | {};
    [s: string]: any;
}
export declare class StateManager {
    private state;
    constructor(initialState?: State);
    addStateField(definedState: State): void;
    setStateField(state: Partial<State>): void;
    getFieldValue<Key extends keyof State, T extends State[Key]>(stateKey: Key): T | {
        [field: string]: any;
    };
    getState(): Partial<State>;
    load(state: State): void;
}
export declare const AppState: StateManager;
export {};
