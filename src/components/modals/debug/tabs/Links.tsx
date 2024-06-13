'use client'
import { Tab } from '@headlessui/react';
import { useState } from 'react';

const Links = (): JSX.Element => {
  const [ linkState, setLinks ] = useState('');
  const getLinks = async () => {
    const response = await window.api['GetAppState']('RelationshipMap');
    setLinks(JSON.stringify(response.data));
  };
  return (
    <Tab.Panel className='h-full border border-black rounded p-2 flex flex-col gap-2'>
      <button onClick={getLinks} className='btn btn-sm'>GetLinks</button>
      <textarea className='w-full h-3/4 border border-black rounded' value={linkState} readOnly={true}></textarea>
    </Tab.Panel>
  );
}

const LinksTab = {
  title: 'Task Relations',
  component: Links,
}

export default LinksTab;

