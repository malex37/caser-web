import { TaskMap } from '@models/TaskData';
import {
  BasicResponse,
  CreateTaskResponse,
  GetAssignedTasksResponse,
  GetBoardByIdResponse,
  GetBoardConfigResponse,
  GetBoardsResponse,
  GetTaskResponse,
  GetTeamResponse,
  GetUserResponse,
  SaveBoardConfigResponse,
  // GetBoardFieldResponse
} from './Responses';
import { Filter } from './inputs/GetTasksInputs';
import { BoardConfig, GetAppStateResponse, LinkTasksResponse } from '..';
import { Team } from '@models/Team';
import { StorageStateField } from '@models/app';
import { LinkTasksInput } from './inputs/LinkTasksInput';
import { uuid } from '@models/Types';
import { SetTaskStatusInput } from './inputs/SetTaskStatusInput';
import { UpdateTaskInput } from './inputs/UpdateTaskInput';
import { CreateTaskInput } from './inputs/CreateTaskInput';

export const APINames = {
  CreateTask: 'CreateTask',
  CreateTeam: 'CreateTeam',
  DeleteTask: 'DeleteTask',
  GetAllTasks: 'GetAllTasks',
  GetAssignedTasks: 'GetAssignedTasks',
  GetBoardById: 'GetBoardById',
  GetBoardConfig: 'GetBoardConfig',
  GetBoards: 'GetBoards',
  GetTasks: 'GetTasks',
  GetTeam: 'GetTeam',
  GetUser: 'GetUser',
  LinkTasks: 'LinkTasks',
  SaveBoardConfig: 'SaveBoardConfig',
  SetTaskStatus: 'SetTaskStatus',
  UpdateTask: 'UpdateTask',
  // GetBoardField: 'GetBoardField'
  // Internal
  GetAppState: 'GetAppState',
} as const;

export type ApiName = keyof typeof APINames;

type ApiTypesBase = {
  [name in ApiName]: (...parans: any) => any;
};


export interface ApiTypes extends ApiTypesBase {
  [APINames.CreateTask](input: CreateTaskInput): Promise<CreateTaskResponse>;
  [APINames.CreateTeam](team: Team): Promise<BasicResponse>;
  [APINames.DeleteTask](taskId: uuid): void;
  [APINames.GetAllTasks](): Promise<TaskMap>;
  [APINames.GetAssignedTasks](user: string): Promise<GetAssignedTasksResponse>;
  [APINames.GetBoardById](boardId: uuid): Promise<GetBoardByIdResponse>;
  [APINames.GetBoardConfig](boardId: uuid): Promise<GetBoardConfigResponse>;
  [APINames.GetBoards](): Promise<GetBoardsResponse>;
  [APINames.GetTasks](taskIds: uuid[] | string, filters?: Filter[]): Promise<GetTaskResponse>;
  [APINames.GetTeam](): Promise<GetTeamResponse>;
  [APINames.GetUser](): Promise<GetUserResponse>;
  [APINames.SaveBoardConfig](newBoardConfig: BoardConfig): Promise<SaveBoardConfigResponse>;
  [APINames.SetTaskStatus](param: SetTaskStatusInput): void;
  [APINames.UpdateTask](input: UpdateTaskInput): void;
  [APINames.LinkTasks](input: LinkTasksInput): Promise<LinkTasksResponse>;
  // [APINames.GetBoardField](boardId: string, field: keyof BoardData): Promise<GetBoardFieldResponse>;
  // Internal
  [APINames.GetAppState]<T extends StorageStateField>(key: T): Promise<GetAppStateResponse>;
};

