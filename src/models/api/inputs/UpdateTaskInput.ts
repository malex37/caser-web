import { TaskData } from '@models/TaskData';
import { uuid } from '@models/Types';

export type UpdateTaskInput = {
  taskId: uuid;
  updatedFields: Partial<TaskData>;
}
