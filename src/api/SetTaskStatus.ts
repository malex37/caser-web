import { Status } from '@models/TaskData';
import { ApiTypes } from '@models/api/Definitions';
import { AppState } from '@storage/state';

export const SetTaskStatus: ApiTypes['SetTaskStatus'] = (param: { taskId: string, newStatus: Status }) => {
  console.log(`Setting parent ${param.newStatus} for task ${param.taskId}`);
  const tasks = AppState.getFieldValue('Tasks');
  // console.log(`Tasks are: ${JSON.stringify(tasks, null, 2)}`);
  // This works to update the value since the tasks object returned is a reference
  // to a complex object which JS takes as references not copies (I think)
  tasks[param.taskId].status = param.newStatus;
  console.log(`Tasks after change are: ${JSON.stringify(tasks, null, 2)}`);
  AppState.setStateField({
    Tasks: tasks,
  });
  // console.log(`Task state is now ${JSON.stringify(AppState.getFieldValue('Tasks'))}`)
  return {
    status: 200,
    updatedId: param.taskId,
  };
};

export default SetTaskStatus;

