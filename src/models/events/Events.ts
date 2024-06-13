export const EventNames: { [key: string]: string } = {
  TaskUpdated: 'TaskUpdated',
} as const;

export type EventName = keyof typeof EventNames;
