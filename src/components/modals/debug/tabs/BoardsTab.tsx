'use client'
import { Tab } from '@headlessui/react';
import { BoardData } from '@models/BoardData';
import { StateFieldType } from '@models/app';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';

const BoardsTabElement = (): JSX.Element => {
  const [ boards, setBoards ] = useState({} as StateFieldType);
  const [ displayValue, setDisplayValue ] = useState('{}');

    const getBoards = async () => {
      const boardData = await window.api['GetAppState']('Boards')
      if (boardData.status === 'SUCCESS' && boardData.data ) {
        setBoards(boardData.data);
      }
      setDisplayValue(JSON.stringify(boardData, null, 2));
    }
  return (

    <Tab.Panel className='h-full border border-black rounded p-2 flex flex-col gap-2'>
      <button onClick={getBoards} className='btn btn-sm'>Update</button>
      <textarea className='w-full h-3/4 border border-black rounded' value={displayValue} readOnly={true}></textarea>
        <table className='table-md'>
          <thead>
            <tr>
              <th> Board name </th>
              <th> Board id </th>
              <th> Task count </th>
            </tr>
          </thead>
          <tbody>
            {
              boards ?
              Object.values(boards).map((board: BoardData) => {
                if (board) {
                  return (
                  <tr key={board.id+uuid()} className='hover:bg-gray-200'>
                    <td key={uuid()}>
                      {board.config.name}
                    </td>
                    <td key={uuid()}>{board.id}</td>
                    {
                          board.tasks ?
                          <td key={uuid()}>{board.tasks.length}</td> : <td key={uuid()}></td>
                    }
                  </tr>);
                }
                return <></>
              })
              : <></>
            }
          </tbody>
        </table>
    </Tab.Panel>
  );
}

const BoardsTab = {
  title: 'Boards',
  component: BoardsTabElement,
}

export default BoardsTab;
