import { BoardConfig } from './BoardConfig';
import { TagData } from './TagData';

export interface BoardData {
  id: string;
  tasks: string[];
  availableTags:  TagData[];
  config: BoardConfig;
}
