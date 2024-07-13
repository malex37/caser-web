'use client'
import TabContainer from './debug/tabs/TabContainer';
import FSInfo from './debug/tabs/FSInfo';
import { useEffect } from 'react';

export interface DebugProps {
  id: string,
}

const Debug = (props: DebugProps): JSX.Element => {
  useEffect(() => {
    // Set up event listener
    const body = document.getElementsByTagName('body')[0];
    if (!body) {
      throw new Error('No <body> found, something is seriouslt wrong');
    }
    body.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.code !== 'F1') {
        return;
      }
      // get modal
      const modal = document.getElementById(props.id);
      if (!modal) {
        throw new Error('Unable to open, debug modal doesn\'t exist');
      }
      // @ts-ignore next-line
      modal.showModal();
    });
  });
  return (
    <dialog id={props.id} className='modal w-full h-full'>
      <div className='modal-box max-w-[90%] gap-2 h-full w-full'>
        <TabContainer>
         <FSInfo />
        </TabContainer>
      </div>
    </dialog>
  );
}

export default Debug;
