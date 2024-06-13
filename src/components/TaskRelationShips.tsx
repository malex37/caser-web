import { useState } from 'react';
import InputField from './molecules/InputField';
import { uuid } from '@models/Types';
import { TaskRelationshipValues } from '@models/TaskRelationships';
import DropDownSelection, { DropDownOption } from './molecules/DropDownSelection';

export interface TaskRelationShipsProps {
  linkStartTask: uuid;
}

const TaskRelationShips = (props: TaskRelationShipsProps): JSX.Element => {
  const [relateTarget, setRelateTarget] = useState('');
  const [relationShip, setRelationShip] = useState('');
  const linkTask = (e: any) => {
    e.preventDefault();
    console.log(`It\'s dangerous to go alone, take this! 🗡️ ${relateTarget}`);
    console.log(`Submitting relationship for task ${props.linkStartTask} with ${relateTarget}, with relationship ${relationShip}`)
  }
  const relationOptions = Object.keys(TaskRelationshipValues).map(v => {
    return { value: v }
  });
  const addRelationShipTarget = (target: string) => {
    console.log(`Received target to set ${target}`);
    setRelateTarget(target);
  }
  const addRelationShip = (option: DropDownOption) => {
    console.log(`Received relationship option ${JSON.stringify(option)}`);
    setRelationShip(option.value);
    console.log(`RelationShip set to ${relationShip}`);
  }
  return (
    <div className='flex flex-col gap-3'>
      <form
        id='linkform'
        name='linkform'
        onSubmit={linkTask}
      >
        <InputField
          value={relateTarget}
          action={addRelationShipTarget}
          name='relateinput'
          placeholder='Input the id of the task to link to'
        />
        <DropDownSelection
          name='relationshipselector'
          label='Relations'
          placeholder='None'
          options={relationOptions}
          action={addRelationShip}
          setTextToSelected={true}
        />
        <button className='btn btn-sm w-1/5' onClick={e => linkTask(e)}>Link!</button>
      </form>
    </div>
  );
}

export default TaskRelationShips;
