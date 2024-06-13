import { uuid } from './Types';

export const TaskRelationshipValues = {
  PARENT:  'PARENT',
  CHILD: 'CHILD',
  ADJACENT: 'ADJACENT'
} as const;

export type TaskRelationshipsType = keyof typeof TaskRelationshipValues;

export type RelationshipMap = {
  parent?: uuid;
  children: uuid[];
  adjacent: uuid[];
};
