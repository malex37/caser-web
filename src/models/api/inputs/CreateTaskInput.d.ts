import { TaskData } from '@models/TaskData';
import { uuid } from '@models/Types';
export type CreateTaskInput = {
    task: Omit<TaskData, 'id'>;
    autoAddBoardId?: uuid;
};
