import { ApiTypes } from '@models/api/Definitions';
import { GetAssignedTasksResponse } from '@models/api/Responses';
import { AppState } from '@storage/state';
import { TaskData } from '@models/TaskData';

/**
 * Returns a list of uuids for a given user from state. Designed this way for future compatibility with browser version of app
 * @group API
 * @param user - User id to retrieve tasks for
 */
export const GetAssignedTasks: ApiTypes['GetAssignedTasks'] = async (user: string): Promise<GetAssignedTasksResponse> => {
  console.log(`Handling request for assigned tasks for user ${user}`);
  console.log(`Raw assigned task state \n${JSON.stringify(AppState.getFieldValue('AssignedTasks'), null, 2)}`);
  const tasksAssigned = AppState.getFieldValue('AssignedTasks')[user];
  const tasks = AppState.getFieldValue('Tasks');
  console.log(`Tasks state \n${JSON.stringify(tasks, null, 2)}`);
  if (!tasksAssigned) {
    console.log(`No tasks assigned to user ${user}`);
    return {
      status: 'SUCCESS',
      tasks: [],
    }
  }
  const tasksFound: TaskData[] = tasksAssigned.map((taskId: string) => tasks[taskId]);
  return {
    status: 'SUCCESS',
    tasks: tasksFound,
  };
}

export default GetAssignedTasks;
