import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

export interface DropdownOption {
  value: string;
  icon?: {
    content: string;
    height: number;
    width: number;
    color: string;
  }
}

export interface DropDownSelectionprops {
  label: string;
  className?: string;
  placeholder?: string;
  options: DropdownOption[];
  name: string;
  setField?: (value: any) => void;
}

function TagDropdown(props: DropDownSelectionprops) {
  const defaultSelection: DropdownOption ={
    value: props.placeholder || 'Option',
    icon: {
      width: 3,
      height: 3,
      content: 'x',
      color: '666464',
    },
  };
  const [selected, setSelected] = useState(defaultSelection);
  useEffect(()=>{
    console.log(`Loading dropdown`);
    setSelected(defaultSelection);
  }, []);

  const handleSelect = (selectedOption: DropdownOption) => {
    setSelected({...selectedOption, icon: selectedOption.icon ? selectedOption.icon : defaultSelection.icon });
    console.log(`Selected ${selectedOption.value}`);
    if (props.setField) {
      props.setField(selectedOption);
    }
    // setSelected(props.placeholder);
  };
  return(
    <div  className='flex gap-2 items-center' key={uuid()}>
      <div>
        <details className='dropdown w-full'>
          <summary className='btn m-1'>
            <div className={`flex flex-nowrap w-${selected.icon ? selected.icon.width: '3'} h-${selected.icon ? selected.icon.height : '3'} before:content-[${selected.icon ? selected.icon.content : ''}]`} style={{backgroundColor: `#${selected.icon?.color}`}}></div>{selected.value}</summary>
          <ul className='dropdown-content menu z-[1] shadow rounded-box bg-gray-50'>
          {
            props.options.map((tagOption,index) => {
              const id = `dropdown-${index}`
              return <li key={id}>
                <span onClick={() => handleSelect(tagOption)}>
                    <div id={id} className={`flex flex-nowrap w-${tagOption.icon?.width} h-${tagOption.icon?.height} before:contents-[${tagOption.icon?.content}]`} style={{backgroundColor: `#${tagOption.icon?.color}`}}></div>
                    { tagOption.value }
                </span>
              </li>
            })
          }
          </ul>
        </details>
      </div>
    </div>
  );
}

export default TagDropdown;
