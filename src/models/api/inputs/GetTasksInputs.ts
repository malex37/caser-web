export const Filters = {
  TaskId: 'TaskId',
  Assignee: 'Assignee'
} as const;

export type Filter = keyof typeof Filters;
