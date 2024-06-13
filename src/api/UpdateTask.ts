import { UpdateTaskInput } from '@/models/api/inputs/UpdateTaskInput';
import { ApiTypes } from '@models/api/Definitions';
import { AppState } from '@storage/state';

export const UpdateTask: ApiTypes['UpdateTask'] =
  (input: UpdateTaskInput) => {
    console.log(`Updating task with ${JSON.stringify(input.updatedFields)}`);
    const tasks = AppState.getFieldValue('Tasks');
    tasks[input.taskId] = {
      ...tasks[input.taskId],
      ...input.updatedFields,
    };
    console.log(`Resulting task ${JSON.stringify(tasks[input.taskId])}`);
  };

export default UpdateTask;

