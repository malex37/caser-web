import { TagData } from './TagData';
import { uuid } from './Types';

export const TaskStatus = {
  Queue: 'Queue',
  Complete: 'Complete',
  Progress: 'Progress',
};

export type Status = keyof typeof TaskStatus;

export interface TaskData {
  id: uuid;
  title: string;
  tags?: TagData[];
  assignee: string;
  status: Status;
  description: string;
  dueDate?: Date;
  createDate: number;
  lastUpdateDate: number;
  linkedBoards: string[];
}

export type TaskMap = Record<string, TaskData>;
