'use client'
import { Fragment } from 'react';
import { Tab } from '@headlessui/react';
import StateTab from './debug/tabs/State';
import BoardsTab from './debug/tabs/BoardsTab';
import LinksTab from './debug/tabs/Links';

export interface DebugProps {
  id: string
}

interface ModalTab {
  title: string
  component: () => JSX.Element;
}

const Debug = (props: DebugProps): JSX.Element => {

  const Tabs: ModalTab[] = [
    StateTab,
    BoardsTab,
    LinksTab,
  ];

  return (
    <dialog id={props.id} className='modal w-full h-full'>
      <div className='modal-box max-w-[90%] gap-2 h-full w-full'>
        {
          // close button
          //
        }
        {
          //<form method='dialog'>
          //  <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>X</button>
          //</form>
        }
        <Tab.Group>
          <div className='border-b border-slate-300 sticky'>
            <Tab.List className='flex gap-2'>
              {
                Tabs.map((tab, index) => {
                  return (
                    <Tab as={Fragment} key={index}>
                      {
                        ({ selected }) => (
                          <div className={
                            `ring-white rounded-t p-2 text-lg ${selected ? 'text-red-400 bg-slate-300' : 'bg-slate-100 text-black'}`
                          }>
                            {tab.title}
                          </div>
                        )
                      }
                    </Tab>);
                })
              }
            </Tab.List>
          </div>
          <Tab.Panels className='h-full border-[0.25em] border-slate-300'>
            {
              Tabs.map(tab => {
                return tab.component();
              })
            }
          </Tab.Panels>
        </Tab.Group>
      </div>
    </dialog>
  );
}

export default Debug;
