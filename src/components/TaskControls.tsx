'use client'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';

export interface Control {
  // I don't understand why typing params makes it not pass the value with params, it becomes undefined
  action: (params: any) => void;
  actionParams?: any;
  redirectTo?: string;
  text: string;
  icon?: any;
}

export interface TaskControlsProps {
  taskId: string;
  controls: Control[];
}

const TaskControls = (props: TaskControlsProps): JSX.Element => {

  const [controlState, setControlState] = useState({} as Record<string, Control>);
  const navigate = useNavigate();
  const emptyElement = <></>;

  useEffect(() => {
    const controlState: { [key: string]: any } = {};
    props.controls.map(control => {
      const id = uuid();
      controlState[id] = control;
    });
    setControlState(controlState);
  }, []);

  const controlActionWrapper = (control: Control) => {
    console.log(`Calling action ${JSON.stringify(control)} with params(${JSON.stringify(control.actionParams)})`);
    control.action(control.actionParams);
    if (control.redirectTo) {
      navigate(control.redirectTo);
    }
  }
  return (
    <div className='dropdown dropdown-left'>
      <div tabIndex={0} role='button' className='btn btn-m1'><Cog6ToothIcon className='w-auto h-1/2' /> Options</div>
      <ul tabIndex={0} className='dropdown-content menu z-[1] p-2 shadow bg-base-100 rounded-box'>
        {
          Object.keys(controlState).map(controlKey => {
            const control = controlState[controlKey];
            const icon = control.icon ? control.icon : emptyElement;
            return (
              <li key={controlKey}>
                <a className='flex flex-row flex-nowrap gap-2 h-full' onClick={() => controlActionWrapper(control)}>
                  {icon}
                  {control.text}
                </a>
              </li>
            );
          })
        }
      </ul>
    </div>
  );
}

export default TaskControls;
