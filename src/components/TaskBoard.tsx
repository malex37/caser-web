import { DndContext } from '@dnd-kit/core'
import TaskCard from './molecules/TaskCard';
import TaskLane from './TaskLane';
import LaneHeader from './molecules/LaneHeader';
import { TaskData, TaskStatus } from '@models/TaskData';
import { TaskMapType } from '@models/TaskMap';
import { APINames } from '@models/api/Definitions';

function TaskBoard(props: {
  progress: TaskMapType,
  queued: TaskMapType,
  completed: TaskMapType,
  updateFunction: Function,
  handlePopUp: Function,
  renderingBoard: string;
}): JSX.Element {
  console.log(`Rendering taskBoard with props ${JSON.stringify(props)}`);
  return (
    <>
      <div className='h-full p-0'>
        <div className='w-full grid grid-cols-3 h-full grid-flow-row justify-center'>
          <DndContext onDragEnd={handleDragEnd}>
            <div className='col-span-1/3 m-2 h-full'>
              <LaneHeader>
                Queue
              </LaneHeader>
              <TaskLane id={TaskStatus.Queue} >
                {
                  Object.values(props.queued).map((val) => {
                    return val ?
                      <TaskCard
                        task={val as TaskData}
                        key={(val as TaskData).id}
                        parentBoard={props.renderingBoard} />
                      : <></>;
                  })
                }
              </TaskLane>
            </div>
            <div className='col-span-1/3 m-2 h-full'>
              <LaneHeader>
                In Progress
              </LaneHeader>
              <TaskLane id={TaskStatus.Progress}>
                {
                  Object.values(props.progress || {}).map((task) => {
                    return task ?
                      <TaskCard
                        task={{ ...task } as TaskData}
                        key={(task as TaskData).id}
                        parentBoard={props.renderingBoard} />
                      : <></>
                  })
                }
              </TaskLane>
            </div>
            <div className='col-span-1/3 m-2 h-full'>
              <LaneHeader>
                Completed
              </LaneHeader>
              <TaskLane id={TaskStatus.Complete}>
                {
                  Object.values(props.completed || {}).map(val => {
                    return val ?
                      <TaskCard
                        task={{ ...val } as TaskData}
                        key={(val as TaskData).id}
                        parentBoard={props.renderingBoard}
                      /> : <></>;
                  })
                }
              </TaskLane>
            </div>
          </DndContext>
        </div>
      </div>
    </>
  );

  //@ts-ignore next-line
  function handleDragEnd({ over, active }) {
    const task = active.data.current.task;
    console.log(`Drop event for task ${active.id} with data ${JSON.stringify(task)} into ${over.id}`);
    console.log(`Original status ${task.status}, task id ${task.id}`);
    // console.log(`Tasks with same original status ${JSON.stringify(state.tasks[task.status], null, 2)}`);
    console.log(`TaskData is ${JSON.stringify(task)}`);
    if (task.status === over.id) {
      console.log(`Task with id ${task.id} is already in status ${over.id}, ignoring`);
      return;
    }
    const newTask: TaskData = { ...task };
    newTask.status = over.id;
    window.api[APINames.SetTaskStatus]({ taskId: newTask.id, newStatus: newTask.status });
    // Propagate to parent
    props.updateFunction({ ...newTask }, active.data.current.task.status);
  };
}

export default TaskBoard;
