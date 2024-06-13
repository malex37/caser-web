import { TagData } from './TagData';

export interface BoardConfig {
  availableTags: TagData[];
  startDate?: number;
  endDate?: number;
  name: string;
  boardId: string;
}
