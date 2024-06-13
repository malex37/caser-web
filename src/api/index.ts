import CreateTask from './CreateTask';
import CreateTeam from './CreateTeam';
import DeleteTask from './DeleteTask';
import GetAllTasks from './GetAllTasks';
import GetAppState from './internal/GetAppState';
import GetAssignedTasks from './GetAssignedTasks';
import GetBoardById from './GetBoardById';
import GetBoardConfig from './GetBoardConfig';
import GetBoards from './GetBoards';
import GetTasks from './GetTasks';
import GetTeam from './GetTeam';
import GetUser from './GetUser';
import SaveBoardConfig from './SaveBoardConfig';
import SetTaskStatus from './SetTaskStatus';
import UpdateTask from './UpdateTask';
import { ApiTypes } from '@models/api/Definitions';

/**
 * API implementations, intended to represent a 1:1 mapping for browser version of app
 * @module API
 */
export * from './CreateTask';
export * from './CreateTeam';
export * from './DeleteTask';
export * from './GetAllTasks';
export * from './GetAssignedTasks';
export * from './GetBoardById';
export * from './GetBoardConfig';
export * from './GetBoards';
export * from './GetTasks';
export * from './GetTeam';
export * from './GetUser';
export * from './SaveBoardConfig';
export * from './SetTaskStatus';
export * from './UpdateTask';
export * from './internal/GetAppState';
/**
 * Exported type definitions for implementation
 * @hidden
 */
export const API: Partial<ApiTypes> = {
  CreateTask,
  CreateTeam,
  DeleteTask,
  GetAllTasks,
  GetAppState,
  GetAssignedTasks,
  GetBoardById,
  GetBoardConfig,
  GetBoards,
  GetTasks,
  GetTeam,
  GetUser,
  SaveBoardConfig,
  SetTaskStatus,
  UpdateTask,
};

