export const StorageStateFields = {
  Tasks: 'Tasks',
  Boards: 'Boards',
  AssignedTasks: 'AssignedTasks',
  User: 'User',
  Team: 'Team'
} as const;

export type StorageStateField = keyof typeof StorageStateFields;
