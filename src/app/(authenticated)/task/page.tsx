'use client'
import { TagData } from '@models/TagData';
import { TaskData } from '@models/TaskData';
import { GetTaskResponse } from '@models/api/Responses';
import { StatusCodes } from '@models/api/StatusCodes';
import Crumbs from '@components/molecules/Crumbs';
import TaskControls, { Control } from '@components/TaskControls';
import TagGroupElement from '@components/molecules/TagGroupElement';
import { filter, includes, isEqual } from 'lodash';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuid } from 'uuid'
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import { uuid as uuidT } from '@models/Types';
import TaskRelationShips from '@components/TaskRelationShips';

export default function TaskDetails() {
  let [task, setTask] = useState({} as TaskData);
  let [editLockState, setEditState] = useState({ locked: true });
  let [descriptionText, setDescriptionText] = useState('');
  const [availableTags, setAvailableTags] = useState([] as TagData[]);
  let location = useLocation();
  const [originBoard, setOriginBoard] = useState('');
  const [controls, setControls] = useState([] as Control[]);
  useEffect(() => {
    const getTask = async () => {
      const params = new URLSearchParams(location.search);
      const id = params.get('id');
      setOriginBoard(params.get('board') || '');
      if (!id) {
        console.error('No taskId in param')
        return;
      }
      const gotTask: GetTaskResponse = await window.api['GetTasks']([id as uuidT]);
      if (gotTask.status !== StatusCodes.SUCCESS || !gotTask.tasks) {
        throw new Error(`API call returned error or no task ${JSON.stringify(gotTask)}`);
      }
      setTask(gotTask.tasks[0])
      setDescriptionText(gotTask.tasks[0].description);
      console.log(`Task ${JSON.stringify(gotTask.tasks[0])}`);
      // Get available tags
      console.log(`Requesting config for board ${id}`);
      const configsTags: TagData[] = [];
      gotTask.tasks[0].linkedBoards.map(async link => {
        const config = await window.api['GetBoardConfig'](link as uuidT);
        console.log(`Retrieve response ${JSON.stringify(config)}`);
        if (config.status !== 'SUCCESS' || !config.data) {
          console.error('Failed to retrieve config');
          return;
        }
        config.data.availableTags.map(tag => {
          const exists = configsTags.some((element) => {
            return isEqual(tag, element);
          });
          if (!exists) {
            configsTags.push(tag);
            setAvailableTags(configsTags);
          }
        });
      });
      setControls([
        {
          text: 'Edit',
          action: toggleEdit,
          icon: <PencilSquareIcon className='' />
        },
        {
          text: 'Delete',
          action: deleteTask,
          actionParams: `${id}`,
          redirectTo: '..',
        }
      ]);
    };
    getTask();
  }, []);

  const toggleEdit = () => {
    let shouldEdit = !editLockState.locked;
    setEditState({
      ...editLockState,
      locked: shouldEdit
    });
  }

  const updateTaskDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescriptionText(e.target.value);
  }
  const descriptionArea = <textarea
    id='description'
    className={`w-5/6 textarea text-black m-2 resize-none border read-only:focus:outline-none  ${editLockState.locked ? 'read-only:border-black read-only:focus:border-black' : 'focus:border-red-500 border-red-500'}`}
    readOnly={editLockState.locked}
    value={descriptionText}
    onChange={(e) => updateTaskDescription(e)}
    rows={10}
  >
  </textarea>;

  const tagTask = async (tag: TagData) => {
    if (includes(task.tags, tag)) {
      console.log(`Task is already tagged with ${tag.value}`);
      return;
    }
    setTask({
      ...task,
      tags: [...task.tags || [], tag]
    });
    window.api['UpdateTask']({ taskId: task.id, updatedFields: { tags: [...task.tags || [], tag] } });
  };

  const removeTag = async (tag: TagData) => {
    const tagsRemoved = filter(task.tags, (el) => !isEqual(el, tag));
    setTask({
      ...task,
      tags: [...tagsRemoved],
    });
  }

  const cancelEdit = () => {
    setDescriptionText(task.description);
    toggleEdit();
  }

  const saveDescription = async () => {
    window.api['UpdateTask']({ taskId: task.id, updatedFields: { description: descriptionText } });
    toggleEdit();
  };

  const deleteTask = (taskId: string) => {
    console.log(`Requesting delete of task ${taskId}`);
    window.api['DeleteTask'](taskId as uuidT);
  };

  const timestampToString = (timestamp: number) => {
    const dateFromTimestamp = new Date(timestamp);
    return dateFromTimestamp.toLocaleDateString();
  }


  return (
    <div>
      <div className='grid grid-cols-2'>
        <div className='col-span-2'>
          {
            task ?
              <div className='w-full grid grid-cols-4 m-3 max-w-full'>
                <div className='text-2xl col-span-3 border-b border-b-gray-500'>
                  <textarea
                    className='h-full w-full read-only:focus:outline-none read-only:resize-none read-only:outline-none outline rounded outline-red-500 p-3'
                    readOnly={editLockState.locked}
                    autoFocus={false}
                    value={task.title}
                  />
                </div>
                <div className='col-span-2 justify-start'>
                  <div className='tooltip tooltip-bottom' data-tip={new Date(task.createDate).toLocaleString()}>
                    <span className='bold'>Start date</span>: {timestampToString(task.createDate)}
                  </div>
                  <div className='col-span-2 justify-start'>
                    Task id: {task.id}
                  </div>
                </div>
                <div className='col-span-1 flex flex-row-reverse mr-10'>
                  {
                    controls.length > 0 ? <TaskControls
                      taskId={task.id}
                      controls={[...controls]} /> : <></>
                  }
                </div>
                <div className='col-span-4 p-3'>
                  <label form='description' className='label font-bold'>Description</label>
                  {task.description ? descriptionArea : <></>}
                  {
                    !editLockState.locked ?
                      <div className='flex gap-3 justify-start'>
                        <button className='btn btn-outline btn-success' onClick={saveDescription}>Save</button>
                        <button className='btn btn-outline btn-error' onClick={cancelEdit}>Cancel</button>
                      </div>
                      : <></>
                  }
                </div>
                <div className='pt-2 flex gap-2 items-baseline'>
                  <div className='text-xl font-bold'>
                    Assigned to:
                  </div>
                  <div>
                    {task.assignee}
                  </div>
                </div>
                <div>
                  <details className='dropdown w-full'>
                    <summary className='btn m-1'>Add new tag</summary>
                    <ul className='dropdown-content menu z-[1] shadow rounded-box bg-gray-50'>
                      {
                        availableTags ? availableTags.map((tag, index) => {
                          if (!tag.value) return;
                          return <li key={tag.color + tag.value + 'dropdownoption' + index}>
                            <span onClick={() => tagTask(tag)}><div className='flex flex-nowrap w-3 h-3' style={{ backgroundColor: `#${tag.color}` }}></div>{tag.value}</span>
                          </li>
                        }) : null
                      }
                    </ul>
                  </details>
                </div>
                <div id='tagsection' className='flex gap-2'>
                  <div className='flex text-xl font-bold items-center'>Tags:</div>
                  {
                    task.tags ?
                      task.tags.map(tag => {
                        return <TagGroupElement key={uuid()} tag={tag} action={removeTag} editEnable={!editLockState.locked} />
                      })
                      : <></>
                  }
                </div>
                <div className='w-3/4 col-span-4 p-3 flex flex-col gap-2'>
                  <div className='flex text-xl font-bold items-center'>Task links:</div>
                  <TaskRelationShips linkStartTask={task.id} />
                </div>
              </div> :
              <div>
                Loading task...
              </div>
          }
        </div>
      </div>
      <div className='p-3'>
        <Crumbs
          pathToConvert={location.pathname}
          crumbsWithNoPath={['/', 'task']}
          crumbsToIgnore={['/']}
          delimiter='/'
          crumbsToAppend={[{ text: 'Home', path: '/' }]}
          stateForPath={
            {
              [`${originBoard}`]: {
                boardId: originBoard
              }
            }
          }
        />
      </div>
    </div>
  );
}
