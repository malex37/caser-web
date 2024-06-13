'use client'
import TaskBoard from '@components/TaskBoard';
import TaskList from '@components/TaskList';
import { useEffect, useState } from 'react';
import { TaskMapType } from '@models/TaskMap';
import { Status, TaskData, TaskStatus } from '@models/TaskData';
import NewTask from '@components/modals/NewTask';
import { StatusCodes } from '@models/api/StatusCodes';
import { APINames } from '@models/api/Definitions';
import { CreateTaskResponse } from '@models/api/Responses';
import { BoardData } from '@models/BoardData';
import { uuid } from '@/models/Types';
import Link from 'next/link';

const ViewStyle: { [name: string]: string } = {
  List: 'list',
  Board: 'board',
} as const;

interface BoardViewState {
  viewStyle: keyof typeof ViewStyle;
  tasks: { [id: string]: TaskMapType };
  updateInProgress: boolean;
  initialized: boolean;
  boardData: BoardData;
};

function Board({ params }: { params: { boardId: string } }) {
  const [state, setState] = useState({
    viewStyle: ViewStyle.Board,
    tasks: {
      [TaskStatus.Progress]: {} as TaskMapType,
      [TaskStatus.Queue]: {} as TaskMapType,
      [TaskStatus.Complete]: {} as TaskMapType
    },
    updateInProgress: false,
    initialized: false,
    boardData: {},
  } as BoardViewState);
  useEffect(() => {
    const taskStateCount =
      Object.keys(state.tasks[TaskStatus.Progress] || {}).length +
      Object.keys(state.tasks[TaskStatus.Complete] || {}).length +
      Object.keys(state.tasks[TaskStatus.Queue] || {}).length;
    if (taskStateCount <= 0 || !state.initialized) {
      const request = async () => {
        const board = await window.api['GetBoardById'](params.boardId as uuid);
        console.log(`Board data ${JSON.stringify(board)}`);
        const tasks: { [status: string]: any } = { [TaskStatus.Progress]: {}, [TaskStatus.Queue]: {}, [TaskStatus.Complete]: {} };
        if (!board.data) {
          return;
        }
        const retrievedTasks = await window.api['GetTasks']((board.data.tasks as uuid[]), []);
        if (!retrievedTasks.tasks) {
          return;
        }
        retrievedTasks.tasks.map((singleTaskData: TaskData) => {
          if (!singleTaskData) {
            console.log(`Attempted to handle empty task, skipping`);
            return;
          }
          console.log(`Organizing task ${JSON.stringify(singleTaskData, ['$'])}`);
          switch (singleTaskData.status as Status) {
            case TaskStatus.Queue:
              tasks[TaskStatus.Queue][singleTaskData.id] = singleTaskData;
              break;
            case TaskStatus.Complete:
              tasks[TaskStatus.Complete][singleTaskData.id] = singleTaskData;
              break;
            case TaskStatus.Progress:
              tasks[TaskStatus.Progress][singleTaskData.id] = singleTaskData;
              break;
            default:
              console.log(`Unidentified status for task ${JSON.stringify(singleTaskData)}`);
              break;
          }
        });
        setState({
          ...state,
          tasks: tasks,
          initialized: true,
          boardData: board.data,
        });
        console.log(`Initial tasks state: ${JSON.stringify(state.tasks, null, 2)}`);
      }
      request();
    }
  });

  const handlePopUpOpen = () => {
    // @ts-ignore
    document.getElementById('create-form').showModal();
  };

  async function createTask(data: TaskData) {
    if (Object.values(data).some(val => val === '')) {
      console.log(`Incomplete createTask input, ignoring ${JSON.stringify(data)}`);
      return;
    }

    setState({
      ...state,
      updateInProgress: true,
    });
    const newTask: Omit<TaskData, 'id'> = {
      title: data.title,
      assignee: data.assignee as string,
      description: data.description as string,
      tags: data.tags ? data.tags.map((tag) => { return { color: tag.color, value: tag.value }; }) : [],
      status: TaskStatus.Queue as unknown as Status,
      createDate: Date.now(),
      lastUpdateDate: Date.now(),
      linkedBoards: [`${params.boardId}`],
    }
    console.log(`Requesting createTask with data: ${JSON.stringify(data)} and boardId ${params.boardId}`);
    const taskCreatestatus: CreateTaskResponse = await window.api[APINames.CreateTask]({ task: newTask, autoAddBoardId: params.boardId as uuid });
    if (taskCreatestatus.status !== StatusCodes.SUCCESS || !taskCreatestatus.task) {
      console.log(`CreateTask reponse ${JSON.stringify(taskCreatestatus)}`);
      throw new Error(`Failed to create task, please try again...`);
    }
    console.log(`Create return ${JSON.stringify(taskCreatestatus)}`);
    setState({
      ...state,
      updateInProgress: false,
    });
    feedbackTasks(taskCreatestatus.task);
  }

  function buttonText() {
    return state.viewStyle === ViewStyle.Board ? ViewStyle.List : ViewStyle.Board;
  }

  function changeView() {
    setState({
      ...state,
      viewStyle: buttonText(),
    });
  }

  function feedbackTasks(task: TaskData, oldStatus?: Status) {
    console.log(`Received update with task ${JSON.stringify(task, null, 2)} and old status of ${oldStatus}`);
    if (oldStatus) {
      delete state.tasks[oldStatus][task.id];
    }
    setState({
      ...state,
      tasks: {
        ...state.tasks,
        [task.status]: {
          ...state.tasks[task.status],
          [task.id]: task,
        },
      },
    });
  }

  return (
    <>
      <NewTask saveAction={createTask} boardData={state.boardData} />
      <div className='grid grid-cols-1'>
        <div className='flex gap-2 justify-end'>
          <div className='dropdown dropdown-left'>
            <div tabIndex={0} role='button' className='btn btn-m1'> . . . </div>
            <ul tabIndex={0} className='dropdown-content menu z-[1] p-2 shadow bg-base-100 rounded-box' style={{ width: 'calc(100vw/2)' }}>
              <li>
                <a className='border border-blue-500 rounded m-2 p-2' onClick={changeView}>Change view to {buttonText()} </a>
              </li>
              <li>
                <a className='border border-blue-500 rounded m-2 p-2' onClick={handlePopUpOpen}>Create new task</a>
              </li>
              <li>
                <Link className='border border-blue-500 rounded m-2 p-2' href={`/${state.boardData.id}/config`}>Board options</Link>
              </li>
            </ul>
          </div>
        </div>
        {
          state.tasks && !state.updateInProgress ?
            state.viewStyle === ViewStyle.Board ?
              <TaskBoard
                progress={{ ...state.tasks[TaskStatus.Progress] }}
                queued={{ ...state.tasks[TaskStatus.Queue] }}
                completed={{ ...state.tasks[TaskStatus.Complete] }}
                updateFunction={feedbackTasks}
                renderingBoard={state.boardData.id}
                handlePopUp={handlePopUpOpen} /> : <TaskList tasks={{ ...state.tasks[TaskStatus.Progress], ...state.tasks[TaskStatus.Complete], ...state.tasks[TaskStatus.Queue] }} renderingBoard={state.boardData.id} />
            : 'Loading'
        }
      </div>
    </>
  );
};

export default Board;
