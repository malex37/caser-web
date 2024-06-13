import CreateTeam from '@components/modals/CreateTeam';
import Avatar from '@components/molecules/Avatar';

const Settings = (): JSX.Element => {
  const state: { [key: string]: any } = {};

  return (
    <div>
      <div className='flex flex-col justify-center w-full gap-7'>
        {state.user ?
          <>
            <Avatar first={state.user.name.first[0]} second={state.user.name.last[0]} />
            <div className='flex flex-col justify-center items-center'>
              <div>{state.user.username}</div>
              <div>{state.user.email}</div>
              <div>{state.user.name.first} {state.user.name.last}</div>
            </div>
          </> : <div>WHO ARE YOU?!</div>
        }
        {
          // TODO: Move to component
        }
        <div>
          <CreateTeam />
        </div>
      </div>
    </div>
  );
}

export default Settings
