import { APINames, ApiTypes } from '@models/api/Definitions';
import { v4 as uuid } from 'uuid';
import { AppState } from '@storage/state';
import { CreateTaskResponse } from '@models/api/Responses';
import { TaskData, TaskStatus } from '@models/TaskData';
import { StorageStateFields } from '@models/app';
import { BoardData } from '@models/BoardData';
import { uuid as uuidType } from '@models/Types';
import { CreateTaskInput } from '@models/api/inputs/CreateTaskInput';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { SessionToken } from '@models/api/auth/iron';


/**
 * Creates a task within the application state
 * @group API
 * @param task - Task to 'create' passed in by client omitting id, as it's a required field but will be provided by backend/main process
 * @param autoAddBoardId - ID of board to link to automatically. For now optional
 */
export const CreateTask: ApiTypes['CreateTask'] =
  async (input: CreateTaskInput): Promise<CreateTaskResponse> => {
    // get session
    const sessionCookie = cookies().get(process.env.SESSION_COOKIE);
    if (!sessionCookie) {
      throw new Error('Invalid request, auth token ');
    }
    // get session
    const session = await getIronSession<SessionToken>(cookies(), {
      password: process.env.DEV_PSWD,
      cookieName: process.env.SESSION_COOKIE,
    })
    if (!session) {
      throw new Error('Invalid request, no session');
    }
    // if session is valid build ddb client
    console.log(`Executing ${APINames.CreateTask} with parameters (${JSON.stringify(input.task)},${input.autoAddBoardId})`);
    try {
      // Override client provided UUID in case uuid is compromised??
      const newTaskId = uuid();
      (input.task as TaskData).id = (newTaskId as uuidType);
      const stateTasks = AppState.getFieldValue(StorageStateFields.Tasks);
      const newTask = {
        ...input.task,
        id: newTaskId,
        status: TaskStatus.Queue,
      };
      stateTasks[newTaskId] = newTask;
      AppState.setStateField({ Tasks: stateTasks });
      const userTasks = AppState.getFieldValue('AssignedTasks');
      AppState.setStateField({
        AssignedTasks: {
          ...userTasks,
          [input.task.assignee]: [
            userTasks[input.task.assignee] ? userTasks[input.task.assignee] : undefined,
            newTaskId,
          ],
        }
      });
      if (input.autoAddBoardId) {
        console.log(`Auto add requested`);
        const board: BoardData = AppState.getFieldValue('Boards')[(input.autoAddBoardId as string)];
        console.log(`Adding task ${newTaskId} to board ${board.id} titled ${board.config.name}`);
        board.tasks.push(newTaskId);
      }
      return {
        task: input.task as TaskData,
        status: 'SUCCESS',
      };
    } catch (error) {
      console.error(`Error occurred creating task`, error);
      return { status: 'ERROR' };
    }
  };

export default CreateTask;
