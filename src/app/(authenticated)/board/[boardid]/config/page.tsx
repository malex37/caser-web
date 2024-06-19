'use client'
import { BoardConfig as BoardConfigData } from '@models/BoardConfig';
import { TagData } from '@models/TagData';
import Crumbs from '@components/molecules/Crumbs';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Alert from '@components/molecules/icons/Alert';
import { isEqual } from 'lodash';
import TagEditor from '@components/TagEditor';
import NavMenu from '@components/NavMenu';
import { uuid } from '@models/Types';


const Visibility = {
  visible: 'visible',
  invisible: 'invisible'
} as const;

const NotificationType = {
  alert: 'alert',
  warning: 'warning',
  success: 'sucess',
  error: 'error',
} as const;

interface NotificationState {
  text: string;
  type: keyof typeof NotificationType,
  visibility: keyof typeof Visibility,
  opacity: '100' | '0',
};

export default function BoardConfiguration(): JSX.Element {
  const defaultNotificationState: NotificationState = {
    text: '',
    type: NotificationType.alert,
    visibility: Visibility.invisible,
    opacity: '0'
  };

  let location = useLocation();
  const [boardConfigState, setBoardConfigState] = useState({} as BoardConfigData);
  const [originalConfigState, setOriginalConfigState] = useState({} as BoardConfigData);
  const [boardName, setBoardName] = useState('');
  const [notificationState, setNotificationState] = useState(defaultNotificationState);

  useEffect(() => {
    console.log(`Navigated to BoardConfig ${JSON.stringify(location.state)}`);
    const getBoard = async (boardId: string) => {
      // Board config could be passed as navigation state but would increase chances
      // of multiple config writes from overriding each other since configs loaded
      // from navigation _could_ be out of date
      const boardConfig = await window.api['GetBoardConfig'](boardId as uuid);
      setBoardConfigState({ ...boardConfigState, ...boardConfig.data, boardId: boardId });
      setOriginalConfigState({ ...originalConfigState, ...boardConfig.data, boardId: boardId });
      setBoardName(boardConfig.data?.name || '');
    }
    getBoard(location.state.boardId);
  });

  const saveChanges = async () => {
    if (isEqual(boardConfigState, originalConfigState)) {
      setNotificationState({
        text: 'No changes in configuration. Did you miss anything?',
        type: NotificationType.warning,
        visibility: Visibility.visible,
        opacity: '100',
      });
      setTimeout(() => {
        setNotificationState(defaultNotificationState);
      }, 5000);
      return;
    }
    console.log(`SAVING ${JSON.stringify(boardConfigState)}`);
    const result = await window.api['SaveBoardConfig'](boardConfigState);
    if (result.status !== 'SUCCESS') {
      throw new Error('Failed to save');
    }
  }

  const handleChangedInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBoardConfigState({
      ...boardConfigState,
      name: e.target.value,
    });
    setBoardName(e.target.value);
  };

  const addTag = (newTag: TagData) => {
    setBoardConfigState({
      ...boardConfigState,
      availableTags: [...boardConfigState.availableTags, { value: newTag.value, color: newTag.color.replace('#', '') }]
    });
  }

  const removeTag = (tag: TagData) => {
    console.log(`Removing ${JSON.stringify(tag)}`);
    setBoardConfigState({
      ...boardConfigState,
      availableTags: boardConfigState.availableTags.filter(boardTag => !isEqual(boardTag, tag))
    });
  }

  return (
    <div className='w-full'>
      <NavMenu />
      <div className='flex flex-col gap-3 m-3'>
        <div className='flex items-center gap-3'><div> Name: </div><div><input className='input input-bordered' value={boardName} onChange={(e) => handleChangedInput(e)} /></div></div>
        <div> Available tags: </div>
        <TagEditor tagsToLoad={(boardConfigState.availableTags || [])} addTagAction={addTag} removeTagAction={removeTag} />
      </div>
      <div className='flex gap-5 m-3 w-full justify-center'>
        <button className='btn btn-outline btn-success' onClick={saveChanges}>Save</button>
        <button className='btn btn-outline btn-error'>Cancel</button>
      </div>
      <span className={`w-full flex justify-center ${notificationState.visibility}`}>
        <div role='alert' className={`w-1/2 alert alert-${notificationState.type}`}>
          <Alert />
          <span>{notificationState.text}</span>
        </div>
      </span>
      <Crumbs
        pathToConvert={location.pathname}
        crumbsWithNoPath={['/', 'config']}
        crumbsToIgnore={['/']}
        delimiter='/'
        crumbsToAppend={[{ text: 'Home', path: '/' }]}
        stateForPath={
          {
            [location.state.boardId]: {
              boardId: location.state.boardId
            }
          }
        }
      />
    </div>
  );
}

