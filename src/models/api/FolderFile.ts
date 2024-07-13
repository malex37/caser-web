export type SupportedFileTypes = '.txt' | '.pdf' | '.jpg' | '.png';

export interface FolderFile {
  type: '.txt' | '.pdf'
  data?: string;
  name: string;
  key: string;
}
