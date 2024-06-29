'use client'
import GetFolders from '@api/GetFolders';
import ScrollArea from '@components/ScrollArea';
import NewFolder from '@components/modals/NewFolder';
import ListCard from '@components/molecules/ListCard';
import ModalContainer from '@components/molecules/ModalContainer';
import { Folder } from '@models/DBSchemas/Folders';
import { useEffect, useState } from 'react';

export default function Dashboard(): JSX.Element {

  // const folders = await GetFolders();
  const [folders, setFolders] = useState([] as Folder[]);

  const fetchFolders = async () => {
      const r = await GetFolders();
      setFolders(r);
  };

  const submitRefresh = (e: any) => {
    e.preventDefault();
    fetchFolders();
  }

  useEffect(() => {
      fetchFolders();
  }, [])
  return (
    <div className='w-full h-full p-0 flex flex-col'>
      <div className='flex flex-col'>
        <div className='flex w-full justify-center text-2xl'>
          Welcome to your dashboard! 🏡
        </div>
        {/* TODO: Move this to a component */}
        <div id="dashboard-menu" className='join gap-2'>
          <ModalContainer buttonText='New Folder' modalId='new-folder-join' additionalClassNames='btn join-item'>
            <NewFolder modalId='new-folder-join'/>
          </ModalContainer>
          <button className='btn join-item'>Some other function</button>
        </div>
      </div>
      <div className='w-1/3 shadow shadow-moonstone m-3'>
        <div className='flex'>
          <h2 className='p-3 text-xl border border-x-transparent border-y-transparent border-b-neutral-300'>Folders</h2>
          <button className='w-auto btn btn-accent' onClick={submitRefresh}>R</button>
        </div>
        <ScrollArea>
          {
            folders.map((folder, index) => {
              return <ListCard key={index} folder={folder} ></ListCard>;
            })
          }
        </ScrollArea>
      </div>
    </div>
  );
}


