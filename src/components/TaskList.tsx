import { TaskMapType } from '@models/TaskMap';
import TaskCard from './molecules/TaskCard';
import { TaskData } from '@models/TaskData';

function TaskList(props: {
  tasks: TaskMapType,
  renderingBoard: string
}) {
  function buildCards(taskMap: TaskMapType) {
      const tasks: TaskData[] = Object.values(taskMap);
      return tasks.map((task: TaskData) => {
        return <TaskCard key={(task as TaskData).id} task={(task as TaskData)} parentBoard={props.renderingBoard} />
      });
  }
  return (
    <div className='max-w-md p-4'>
      {
        buildCards(props.tasks)
      }
    </div>
  );
}

export default TaskList;
