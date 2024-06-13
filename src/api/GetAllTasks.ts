import { ApiTypes } from '@models/api/Definitions';
import { AppState } from '@storage/state';
import { StorageStateFields } from '@models/app';

/**
 * Returns all tasks in state
 * @group API
 * @param none
 */
export const GetAllTasks: ApiTypes['GetAllTasks'] = async () => {
  const tasks = AppState.getFieldValue(StorageStateFields.Tasks);
  return tasks
};

export default GetAllTasks;
