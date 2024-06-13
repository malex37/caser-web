import { Team } from '@models/Team';
import { StorageStateField, StorageStateFields } from './StateFields'
import { BoardData, TaskData, UserData } from '@models/index';
import { uuid } from '@models/Types';
import { RelationshipMap } from '@models/TaskRelationships';
export interface State {
  [StorageStateFields.Tasks]: { [id: string]: TaskData };
  [StorageStateFields.Boards]: { [id: string]: BoardData };
  [StorageStateFields.AssignedTasks]: { [user: string]: string[] }
  [StorageStateFields.User]: UserData | {};
  [StorageStateFields.Team]: Team | {};
  [StorageStateFields.TaskMap]: { [taskId: string]: string[] };
  [StorageStateFields.RelationshipMap]: { [taskId: uuid]: RelationshipMap };
  [key: string]: any;
}
export type StateFieldType = State[StorageStateField];
