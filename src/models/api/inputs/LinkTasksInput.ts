import { TaskRelationshipsType } from '@models/TaskRelationships';

export interface LinkTasksInput {
  taskIdA: string;
  taskIdB: string
  taskAtoTaskBrelationship: TaskRelationshipsType;
}
