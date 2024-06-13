import { LinkTasksResponse } from '@models/api/Responses';
import { LinkTasksInput } from '@models/api/inputs/LinkTasksInput';
import { ApiTypes, TaskData } from '@models/index';
import { AppState } from '@storage/state';
import { RelationshipMap } from '@models/TaskRelationships';
import { LinkResult } from '@models/api/ApiFields';
import { uuid } from '@models/Types';

const LinkTasks: ApiTypes['LinkTasks'] = async (input: LinkTasksInput): Promise<LinkTasksResponse> => {
  const tasks = AppState.getFieldValue('Tasks');
  const taskA = tasks[input.taskIdA];
  const taskB = tasks[input.taskIdB];
  if (!taskA || !taskB) {
    return {
      status: 'FAIL'
    };
  }
  // handle relationship operation

  let result: LinkResult | undefined = undefined;
  switch (input.taskAtoTaskBrelationship) {
    case 'PARENT':
      result = handleParent(taskA, taskB);
      break;
    case 'CHILD':
      result = handleChild(taskA, taskB);
      break;
    case 'ADJACENT':
      result = handleAdjacent(taskA, taskB);
      break;
    default:
      break;
  }

  return {
    status: 'SUCCESS',
    linkResult: result
  };
};

/**
 * A is parent of B
  */
function handleParent(taskA: TaskData, taskB: TaskData): LinkResult {
  const { relationA, relationB, relations } = primeRelations(taskA.id, taskB.id);
  if (!relationA.children.includes(taskB.id)) {
    relationA.children.push(taskB.id);
  }
  relationB.parent = taskA.id;
  AppState.setStateField({ RelationshipMap: { ...relations, [taskA.id]: relationA, [taskB.id]: relationB } });
  return {
    taskAdata: {
      relatedTo: taskB.id,
      relationShip: 'PARENT',
    },
    taskBdata: {
      relatedTo: taskA.id,
      relationShip: 'CHILD',
    },
  };
};

/**
 * A is child of B
  */
function handleChild(taskA: TaskData, taskB: TaskData): LinkResult {
  const { relationA, relationB, relations } = primeRelations(taskA.id, taskB.id);
  if (!relationB.children.includes(taskA.id)) {
    relationA.children.push(taskA.id);
  }
  AppState.setStateField({ RelationshipMap: { ...relations, [taskA.id]: relationA, [taskB.id]: relationB } });
  return {
    taskAdata: {
      relatedTo: taskB.id,
      relationShip: 'CHILD',
    },
    taskBdata: {
      relatedTo: taskA.id,
      relationShip: 'PARENT',
    }
  };
};
function handleAdjacent(taskA: TaskData, taskB: TaskData): LinkResult {
  const { relationA, relationB, relations } = primeRelations(taskA.id, taskB.id);
  if (!relationA.adjacent.includes(taskB.id)) {
    relationA.adjacent.push(taskB.id);
  }
  if (!relationB.adjacent.includes(taskA.id)) {
    relationB.adjacent.push(taskA.id);
  }
  AppState.setStateField({ RelationshipMap: { ...relations, [taskA.id]: relationA, [taskB.id]: relationB } });
  return {
    taskAdata: {
      relatedTo: taskB.id,
      relationShip: 'ADJACENT',
    },
    taskBdata: {
      relatedTo: taskA.id,
      relationShip: 'ADJACENT',
    }
  }
};
function primeRelations(taskA: uuid, taskB: uuid): { relationA: RelationshipMap, relationB: RelationshipMap, relations: { [taskId: uuid]: RelationshipMap } } {
  // TODO: Refactor to common function
  const relations = AppState.getFieldValue('RelationshipMap');
  let relationA: RelationshipMap = relations[taskA];
  let relationB: RelationshipMap = relations[taskB];
  if (!relationB) {
    relationB = {
      children: [],
      adjacent: []
    };
  }
  if (!relationA) {
    relationA = {
      children: [],
      adjacent: [],
    };
  }
  return {
    relationA: relationA,
    relationB: relationB,
    relations: relations,
  };
}

export default LinkTasks;
