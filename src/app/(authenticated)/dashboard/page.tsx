'use client'
import GetFolders from '@api/GetFolders';
import ScrollArea from '@components/ScrollArea';
import NewFolder from '@components/modals/NewFolder';
import ListCard from '@components/molecules/ListCard';
import ModalContainer from '@components/molecules/ModalContainer';
import { Folder } from '@models/DBSchemas/Folders';
import { useEffect, useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { ShowToast } from '@components/ToastMessage';

export default function Dashboard(): JSX.Element {

  const router = useRouter()

  const [folders, setFolders] = useState([] as Folder[]);

  const fetchFolders = async () => {
    console.log('Fetching folders for dashboard');
    const r = await GetFolders();
    setFolders(r);
    ShowToast({ type: 'success', message: 'Successfully loaded folders' })
  };

  const submitRefresh = (e: any) => {
    e.preventDefault();
    fetchFolders();
  }

  const navigateToSelectedFolder = (folderId: string) => {
    console.log(`Navigating to folder ${folderId}`);
    router.push(`/folder/${folderId}`);
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  return (
    <div className='w-full h-full p-0 flex flex-col'>
      <div className='flex flex-col'>
        <div className='flex w-full justify-center text-2xl'>
          Welcome to your dashboard! 🏡
        </div>
        {/* TODO: Move this to a component */}
        <div id="dashboard-menu" className='join gap-2 p-2'>
          <ModalContainer buttonText='New Folder' modalId='new-folder-join' additionalClassNames='btn join-item'>
            <NewFolder modalId='new-folder-join' />
          </ModalContainer>
        </div>
      </div>
      <div className='w-1/3 shadow shadow-moonstone m-3'>
        <div className='flex w-full border border-x-transparent border-y-transparent border-b-neutral-300 p-2'>
          <h2 className='p-3 text-xl'>Folders</h2>
          <div className='w-full'></div>
          <button className='p-2 btn' onClick={submitRefresh}><ArrowPathIcon className='h-full w-auto' /></button>
        </div>
        <ScrollArea>
          {
            folders.map((folder, index) => {
              return <ListCard key={index} folder={folder} action={navigateToSelectedFolder} ></ListCard>;
            })
          }
        </ScrollArea>
      </div>
    </div>
  );
}


