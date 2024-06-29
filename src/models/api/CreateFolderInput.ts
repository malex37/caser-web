export interface CreateFolderInput {
  name: string;
  client: string;
  caseType: string;
  judge: string;
  county: string;
}

export const CreateFolderInputKeys = {
  name: 'name',
  client: 'client',
  caseType: 'caseType',
  judge: 'judge',
  county: 'county'
} as const;
