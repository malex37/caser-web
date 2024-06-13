import { Status } from '@/models/TaskData';
import { uuid } from '@models/Types';
export interface SetTaskStatusInput {
    taskId: uuid;
    newStatus: Status;
}
