import { TaskData } from '@models/TaskData';
import { StorageStateFields } from './StateFields';
import { BoardData } from '@models/BoardData';
import { UserData } from '@models/UserData';
import { Team } from '@models/Team';

interface State {
  [StorageStateFields.Tasks]: { [id: string]: TaskData };
  [StorageStateFields.Boards]: { [id: string]: BoardData };
  [StorageStateFields.AssignedTasks]: { [user: string]: string[] }
  [StorageStateFields.User]: UserData | {};
  [StorageStateFields.Team]: Team | {};
  [s: string]: any
}

export class StateManager {
  private state: State;

  constructor(initialState?: State) {
    this.state = initialState ? initialState : {
      Tasks: {},
      Boards: {},
      AssignedTasks: {},
      User: {},
      Team: {},
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
    this.state = { ...this.state, ...state };
  }

  getFieldValue<Key extends keyof State, T extends State[Key]>(stateKey: Key): T | { [field: string]: any } {
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
