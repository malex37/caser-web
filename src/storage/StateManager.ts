import { State } from '@models/app';

export class StateManager {
  private state: State;

  constructor(initialState?: State) {
    this.state  = initialState ? initialState : {
      Tasks: {},
      Boards: {},
      AssignedTasks: {},
      User: {},
      Team: {},
      RelationshipMap: {},
      TaskMap: {},
    };
  }

  addStateField(definedState: State): void {
    // Go through the keys in the object and copy their value
    Object.keys(definedState).map((statePropKey: string) => {

      if (this.state[statePropKey] && this.state[statePropKey] instanceof Object) {
        this.addStateField(this.state[statePropKey]);
      }
      this.state[statePropKey] = definedState[statePropKey];
    });
  }

  setStateField(state: Partial<State>): void {
    this.state = { ...this.state, ...state};
  }

  setField(field: keyof State, value: any): void {
    this.state[field] = value;
  }

  getFieldValue<Key extends keyof State, T extends State[Key]>(stateKey: Key): T | {} {
    return this.state[stateKey] ? this.state[stateKey] : {};
  }

  getState(): Partial<State> {
    let partialState = { ...this.state } as any;
    // delete partialState[StorageStateFields.User];
    return partialState;
  }

  load(state: State): void {
    console.log(`Loading ${JSON.stringify(state)}`);
    this.state = state;
  }
}

export const AppState = new StateManager();
