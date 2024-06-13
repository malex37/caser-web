import { TagData } from '@models/TagData';
import DropDownSelection, { DropDownOption } from '../molecules/DropDownSelection';
import InputField from '../molecules/InputField';
import { useState } from 'react';
import { BoardData } from '@models/BoardData';
import InputArea from '../molecules/InputArea';
import TagGroupElement from '../molecules/TagGroupElement';
import { v4 as uuid } from 'uuid'
import { filter, isEqual } from 'lodash';

function NewTask(props: { saveAction: any, boardData: BoardData }) {
  const FormKeys = {
    DescriptionArea: 'areatext',
    TitleInput: 'titleinput',
    AssignSelection: 'selectassign',
    TagSelection: 'selecttag'
  };
  const [ title, setTitle ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ assignee, setAssign ] = useState('');
  const [ tags, setTags ] = useState([] as TagData[]);

  const addTag = (tag: DropDownOption) => {
    const castedTag = (tag.value as TagData);
    if (tags.some(stateTag => stateTag.value === castedTag.value)) {
      console.log('Tag is already added, ignoring');
      return;
    }
    console.log(`Adding tag ${(tag.value as TagData).value}`)
    setTags([...tags, castedTag]);
    console.log(`New Task will have tasks ${JSON.stringify(tags)}`);
  };

  const removeTag = (tag: TagData) => {
    const newTags = filter(tags, (e) => !isEqual(e, tag));
    setTags(newTags);
  }

  const addAssign = (assignee: DropDownOption) => {
    console.log(`Adding assignee ${assignee.value}`);
    setAssign(assignee.value);
  };

  const submitHandler = () => {
    const taskFormed = {
      title: title,
      description: description,
      tags: tags,
      assignee: assignee
    };
    console.log(`Saving ${JSON.stringify(taskFormed, null, 2)}`)
    resetForm();
    props.saveAction(taskFormed);
  };

  const resetForm = () => {
    const form = document.getElementById('newtaskform') as HTMLFormElement;
    if (!form) {
      throw new Error('Form not found! THIS SHOULD NOT HAPPEN');
    }
    setTitle('');
    setDescription('');
    setTags([]);
    setAssign('');
    (document.getElementById('create-form') as any).close();
  }

  return (
    <dialog id='create-form' className='modal w-full'>
      <div className='modal-box'>
          <div className='modal-action grid grid-cols-1 gap-3'>
            <div className='col-span-1'>
              <p className='font-bold text-lg'>New task</p>
            </div>
            <div className='col-span-1'>
              <form
                id='newtaskform'
                name='newtaskform'
                method='dialog'
                onSubmit={submitHandler}
                className='modal-middle'>
                <div className='grid grid-cols-2 justify-center gap-3'>
                  <InputField
                    label='Title:'
                    value={title}
                    name={FormKeys.TitleInput}
                    containerClass='col-span-2'
                    action={setTitle}
                  />
                  <InputArea
                    changeEventHandler={setDescription}
                    label={'Description:'}
                    grid={{spanWidth: 2, spanHeight: 1}}
                    text={description}
                  />
                <div>
                  <div>Assignee: {assignee}</div>
                  <DropDownSelection
                    name={FormKeys.AssignSelection}
                    label='Assignee'
                    options={[{value: 'John'}, {value: 'Jane'}, {value:'Carson'}]}
                    placeholder='Assign'
                    action={addAssign}
                  />
                  </div>
                <div>
                  <div className='max-h-32 overflow-y-auto overscroll-y-contain bg-scroll'>
                    {
                      tags.map(tag => <TagGroupElement key={uuid()} tag={tag} editEnable={true} action={removeTag}/>)
                    }
                  </div>
                  <DropDownSelection
                    name={FormKeys.TagSelection}
                    label='Tags:'
                    options={
                      props.boardData.config?.availableTags ?
                        props.boardData.config.availableTags.map(tag => {
                          return {
                            value: tag,
                            icon: {
                              color: tag.color,
                              content: 'x',
                            },
                            displayTextKeyMap: 'value.value',
                          }
                        })
                      : []
                    }
                    placeholder='Tag'
                    action={addTag}
                  />
                  </div>
                </div>
                <button className='btn col-span-1 w-1/2 m-2'>Submit</button>
              </form>
                <button name='close' className='btn col-span-1 w-1/2 m-2' onClick={resetForm}>Close (ESC)</button>
            </div>
          </div>
      </div>
    </dialog>
  );
}

export default NewTask;
