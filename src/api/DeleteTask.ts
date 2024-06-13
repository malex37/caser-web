import { ApiTypes } from '@models/api';
import { AppState } from '@storage/state';
/**
 * Deletes task by uuid from storage and state
 * @group API
 * @param taskId - UUID for target task
 * */
export const DeleteTask: ApiTypes['DeleteTask'] = (taskId: string) => {
  console.log(`Received request to remove task with ID: ${taskId}`);
  const tasks = AppState.getFieldValue('Tasks');
  delete tasks[taskId];
};

export default DeleteTask;

