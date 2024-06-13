export const StorageStateFields = {
  Tasks: 'Tasks',
  Boards: 'Boards',
  AssignedTasks: 'AssignedTasks',
  User: 'User',
  Team: 'Team',
  TaskMap: 'TaskMap',
  RelationshipMap: 'RelationshipMap',
} as const;

export type StorageStateField = keyof typeof StorageStateFields;
