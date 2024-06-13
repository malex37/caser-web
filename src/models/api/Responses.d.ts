import { TaskData } from '@models/TaskData';
import { StatusCode } from './StatusCodes';
import { BoardData } from '@models/BoardData';
import { UserData } from '@models/UserData';
import { BoardConfig } from '@models/BoardConfig';
import { Team } from '@models/Team';
import { StateFieldType } from '@models/app/storage/State';
import { LinkResult } from './ApiFields';
export interface BasicResponse {
    status: StatusCode;
}
export interface CreateTaskResponse extends BasicResponse {
    task?: TaskData;
}
export interface GetTaskResponse extends BasicResponse {
    tasks?: TaskData[];
    detailStatus: StatusCode;
}
export interface GetAssignedTasksResponse extends BasicResponse {
    tasks: TaskData[];
}
export interface GetBoardsResponse extends BasicResponse {
    boards?: {
        [id: string]: BoardData;
    };
}
export interface GetBoardByIdResponse extends BasicResponse {
    data?: BoardData;
}
export interface GetUserResponse extends BasicResponse {
    data?: UserData;
}
export interface GetBoardConfigResponse extends BasicResponse {
    data?: BoardConfig;
}
export interface SaveBoardConfigResponse extends BasicResponse {
}
export interface GetBoardFieldResponse extends BasicResponse {
    data?: any;
}
export interface GetTeamResponse extends BasicResponse {
    data?: Team;
}
export interface GetAppStateResponse extends BasicResponse {
    data?: StateFieldType;
}
export interface LinkTasksResponse extends BasicResponse {
    linkResult?: LinkResult;
}
