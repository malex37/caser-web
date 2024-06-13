import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import Tag from './Tag';
import { TaskData } from '@models/TaskData';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface TaskCardProps {
  popUpHook?: any,
  task: TaskData,
  parentBoard?: string,
}

function TaskCard(props: TaskCardProps) {

  function defaultHandler() {
    console.log('Executed default, nothing to see here');
  };

  let [ task, setTask ] = useState({} as TaskData);

  useEffect(()=>{
    console.log(`Prop id ${props.task.id}`);
    setTask(props.task);
  },[task]);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.task.id,
    data: {
      ...props
    }
  });
  const cardStyle = CSS.Translate.toString(transform);
  const editButton = (
        <div className='border border-red-600' onClick={props.popUpHook ? props.popUpHook : defaultHandler}>
          Edit
        </div>
        );
  const empty = (<></>);

  return (
    <div
      ref={setNodeRef}
      style={ { transform: cardStyle } }
      {...attributes}
      className={`bg-white border border-purple-500 rounded p-2 text-sm mb-2 shadow hover:shadow-2xl`}
      id={props.task.id}
    >
      <div className='flex flex-col gap-2' {...listeners} >
        {
          props.task ?
          <Link
            className='text-lg font-semibold hover:text-cyan-600'
            to={`task?id=${props.task.id}${props.parentBoard ? '&board='+props.parentBoard : ''}`}
            key={props.task.id}
          >
         {props.task.title}
          </Link> : empty
        }
        <div className='text-base'>
          Assignee: {props.task.assignee}
        </div>
        <div className='flex h-1/5 justify-end flex-wrap'>
          {
            props.task.tags ? props.task.tags.map((tag, index) => {
              return (
                <Tag key={index} color={tag.color}>
                  {tag.value}
                </Tag>
              );
            }) : <></>
          }
        </div>
      </div>
      {
        props.popUpHook ? editButton : empty
      }
    </div>
  );
};

export default TaskCard;
