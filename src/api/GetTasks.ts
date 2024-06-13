import { ApiTypes } from '@models/api/Definitions';
import { GetTaskResponse } from '@models/api/Responses';
import { AppState } from '@storage/state';
import { Filter, Filters } from '@models/api/inputs/GetTasksInputs';
import { StorageStateFields } from '@models/app';
import { TaskData } from '@models/TaskData';

// @ts-ignore next-line
export const GetTasks: ApiTypes['GetTasks'] = async (fieldValue: string[] & string, filters: Filter[] = [Filters.TaskId]): Promise<GetTaskResponse> => {
  const taskState = AppState.getFieldValue(StorageStateFields.Tasks);
  let result: TaskData[] = [];
  fieldValue.map(taskId => {
    const tempTask = taskState[taskId];
    if (tempTask) {
      result.push(tempTask);
    }
  });
  if (result.length === 0) {
    return {
      status: 'NOT_FOUND',
      detailStatus: 'NOT_FOUND',
    };
  }
  return {
    tasks: result,
    status: 'SUCCESS',
    detailStatus: 'SUCCESS'
  };
}

export default GetTasks;
