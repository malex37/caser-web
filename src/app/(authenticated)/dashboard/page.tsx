'use server'
import GetFolders from '@api/GetFolders';
import ScrollArea from '@components/ScrollArea';
import ListCard from '@components/molecules/ListCard';

export default async function Dashboard(): Promise<JSX.Element> {

  const folders = await GetFolders();

  return (
    <div className='w-full h-full p-0 flex flex-col'>
      <div className='flex justify-center text-2xl m-3'>
        Welcome to your dashboard! 🏡
      </div>
      <div className='w-1/3 shadow shadow-moonstone m-3'>
        <h2 className='p-3 text-xl border border-x-transparent border-y-transparent border-b-neutral-300'>Folders</h2>
        <ScrollArea>
          {
            folders.map(folder => {
              return <ListCard folder={folder} ></ListCard>;
            })
          }
        </ScrollArea>
      </div>
    </div>
  );
}


