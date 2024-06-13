import { useState } from 'react';
import { v4 as uuid } from 'uuid';

export interface DropDownOptionIcon {
  content?: string;
  color: string;
}

type PathComponents = `${string}` | `${string}.`;

type ObjectPathDescriptorTemplate<T extends string> =
  string extends T ?
  string :
  T extends `${infer N}` ? (`${N}.${ObjectPathDescriptorTemplate<N>}`)
  : string;

export interface DropDownOption {
  icon?: DropDownOptionIcon;
  style?: React.CSSProperties;
  value: any;
  displayTextKeyMap?: ObjectPathDescriptorTemplate<PathComponents>;
}

export interface DropDownSelectionprops {
  label: string;
  className?: string;
  placeholder: string;
  options: DropDownOption[];
  name: string;
  action?: (value: DropDownOption) => void;
  setTextToSelected?: boolean
}

function DropDownSelection(props: DropDownSelectionprops) {

  const [state, setState] = useState(false);
  const [displayHolder, setDisplayHolder] = useState(props.placeholder);

  const displayText = (option: DropDownOption) => {
    if (!option.displayTextKeyMap) {
      return option.value;
    }
    const deStructuredMap = option.displayTextKeyMap.split('.');
    return drillToValue(0, deStructuredMap, option);
  }

  const handlerWrapper = (option: DropDownOption) => {
    console.log(`handling ${JSON.stringify(option.value)}`);
    if (props.action) {
      props.action(option);
    }
    if (props.setTextToSelected) {
      setDisplayHolder(option.value);
    }
    // Return the detail element to 'closed' state
    setState(false)
  };

  const defaultHandler = () => {
    console.log('Default handler used');
    setState(false);
    console.log(state);
  };

  function drillToValue(targetValueMapIndex: number, targetValueKeyMapOrder: string[], option: DropDownOption) {
    const thisKey = targetValueKeyMapOrder[targetValueMapIndex];
    if (typeof thisKey === 'object') {
      drillToValue(targetValueMapIndex + 1, targetValueKeyMapOrder, option);
    }
    return option.value[`${thisKey}`];
  }

  return (
    <div className='flex gap-2 items-center' key={uuid()}>
      <details id={props.name} className='dropdown w-full' open={state}>
        <summary className='btn m-1 animate-none'>{displayHolder}</summary>
        <ul className='dropdown-content menu z-[1] shadow rounded-box bg-gray-50'>
          {
            props.options.map((opt, index) => {
              if ((!opt.displayTextKeyMap && typeof opt.value !== typeof '') || !opt.value) {
                throw new Error('Invalid option for dropdown');
              }
              console.log(JSON.stringify(opt));
              let iconStyle: React.CSSProperties = {};
              // Icon style
              if (opt.icon) {
                iconStyle = {
                  backgroundColor: `#${opt.icon.color}`,
                };
              }
              const mergedStyle = {
                ...opt.style,
                ...iconStyle,
              };
              // find displayTextKeyMap
              const textValue = displayText(opt);
              return <li key={'dropdownoption' + index}>
                <div onClick={() => props.action ? handlerWrapper(opt) : defaultHandler()} className='flex justify-start'>
                  <span
                    className={`flex flex-nowrap w-3 h-3 justify-start ${opt.icon ? `before:content-[${opt.icon.content ? `'${opt.icon.content}'` : '&nbsp;'}]` : ''}`}
                    style={mergedStyle}></span>
                  <div>
                    {textValue}
                  </div>
                </div>
              </li>
            })
          }
        </ul>
      </details>
    </div>
  );
}

export default DropDownSelection;
