import { State } from '@models/app';
export declare class StateManager {
    private state;
    constructor(initialState?: State);
    addStateField(definedState: State): void;
    setStateField(state: Partial<State>): void;
    setField(field: keyof State, value: any): void;
    getFieldValue<Key extends keyof State, T extends State[Key]>(stateKey: Key): T | {};
    getState(): Partial<State>;
    load(state: State): void;
}
export declare const AppState: StateManager;
