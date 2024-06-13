'use client'
import { Tab } from '@headlessui/react';
import { StorageStateField } from '@models/app';
import { useState } from 'react';

const StateTabComponent = () => {
  const [stateText, setStateText] = useState('{}');

  const getStateValue = async (key: StorageStateField) => {
    const tasks = await window.api['GetAppState'](key);
    if (tasks.status !== 'SUCCESS') {
      setStateText(`Error fetching ${key}: ${JSON.stringify(tasks)}`);
    }
    setStateText(JSON.stringify(tasks.data, null, 2));
  };
  return (
    <Tab.Panel className='h-full p-2 border border-black rounded w-full flex flex-col gap-2'>
      <div className='text-3xl'>State:</div>
      <div id='state' className='h-full w-full flex flex-col gap-2'>
        <button onClick={() => getStateValue('Tasks')} className='btn btn-sm'>Update</button>
        <textarea className='w-full h-3/4' value={stateText} readOnly={true}></textarea>
      </div>
      </Tab.Panel>
    );
}

const StateTab = {
  title: 'State',
  component: StateTabComponent,
};

export default StateTab;
