import { TaskRelationshipsType } from '@models/TaskRelationships';

export type LinkResult = {
    taskAdata: {
      relatedTo: string;
      relationShip: TaskRelationshipsType
    },
    taskBdata: {
      relatedTo: string;
      relationShip: TaskRelationshipsType;
    },
  };

