'use client'
import { useState } from 'react';
import ModalContainer from '../molecules/ModalContainer';
import { includes } from 'lodash';

const CreateTeam = (): JSX.Element => {

  const [ members, setMembers ] = useState([] as string[]);

  const [ name, setName ] = useState('');

  const catchReturn = (event: any) => {
    if (event.keyCode === 13 ) {
      switch (event.target.id) {
        case 'name':
          setTeamName(event.target.value);
          break;
        case 'newmember':
          addTeamMember(event.target.value);
          event.target.value = '';
          break;
        default:
          console.log('NANI?!');
          break;
      }
    }
  }

  const setTeamName = (teamName: string) => {
    if (teamName === '' || !teamName) {
      console.error('Invalid team name');
      return;
    }
    setName(teamName);
  }

  const addTeamMember = (name: string) => {
    if (includes(members, name) || name === '') {
      console.error('Invalid input');
      return;
    }
    setMembers([...members, name]);
  }

  const removeMember = (member: string) => {
    const filtered = members.filter((fMember) => fMember !== member);
    setMembers(filtered);
  }

  return(
    <ModalContainer modalId='createteam' buttonText='Create team'>
      <div className='w-full flex flex-col justify-start gap-4'>
        <div className='flex flex-row items-center gap-3'>
          <div className='w-1/4'>Name:</div>
          <input
            type='text'
            id='name'
            className='w-full input input-bordered'
            onKeyUp={(event) => catchReturn(event)}
          />
        </div>
        <div className='flex flex-row items-center gap-3'>
          <div className='w-1/4'>Members:</div>
          <input
            type='text'
            id='newmember'
            className='w-full input input-bordered'
            onKeyUp={(event) => catchReturn(event)}
          />
        </div>
        <div id='memberpills'></div>
        <div>
          {JSON.stringify(members)}
          {JSON.stringify(name)}
        </div>
        <div className='flex gap-2.5'>
          {
            members.map((member, index) => {
              return <div key={`${member}${index}`} className='badge bg-slate-200 cursor-pointer' onClick={() => removeMember(member)}>{member} X</div>
            })
          }
        </div>
        <button className='btn btn-outline btn-success w-1/3'> SAVE </button>
      </div>
    </ModalContainer>
  );
}

export default CreateTeam;
