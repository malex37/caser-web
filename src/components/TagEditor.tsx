import { TagData } from '@models/TagData';
import TagGroupElement from './molecules/TagGroupElement';
import { HexColorPicker } from 'react-colorful';
import { useState } from 'react';

interface TagEditorProps {
  tagsToLoad: TagData[];
  addTagAction: Function;
  removeTagAction: Function;
};

const TagEditor = (props: TagEditorProps) => {

  let defaultColor = '#E8E9EB'

  const [color,setColor] = useState(defaultColor);
  const [text, setText] = useState('');

  function openNewTagModal() {
    //@ts-ignore next-line
    document.getElementById('new_tag_modal').showModal();
  }

  const colorPickerModal = <div>
   <HexColorPicker color={color} onChange={setColor} />
  </div>

  return(
    <span>
      <div className='flex gap-3 items-center flex-wrap'>
        {
          props.tagsToLoad.map((tag: TagData, index: number) => {
            return (
              <TagGroupElement key={`${index}`} tag={tag} classOverride='pt-1 pb-1 pr-3 pl-3 flex justify-center rounded' action={props.removeTagAction} />
            );
          })
        }
      <button className='btn btn-sm' onClick={() => openNewTagModal()}>+ Add tag</button>
      <dialog id='new_tag_modal' className='modal'>
        <div className='modal-box'>
          <form method='dialog' onSubmit={() => props.addTagAction({value: text, color: color})}>
            <div className='grid grid-cols-1 gap-2'>
              <div className='label'>
                <span className='text-lg label-text'>Tag text</span>
              </div>
              <input required={true} placeholder='Type title' className='input input-bordered' onChange={(e)=>setText(e.target.value)} value={text}/>
              <div className='label'>
                <span className='text-lg label-text'>Select a color</span>
              </div>
              <div className='flex w-full gap-10'>
                { colorPickerModal }
                <div className='w-24 h-24' style={{background: color}}></div>
              </div>
              <button className='btn btn-md'>Submit</button>
            </div>
          </form>
          <div className='w-full flex items-center justify-center font-bold text-lg'>
            Press ESC to close
          </div>
        </div>
      </dialog>
      </div>
    </span>
  );
};

export default TagEditor;
