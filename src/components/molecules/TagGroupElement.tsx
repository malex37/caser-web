import { TagData } from '@models/TagData';
import Tag from './Tag';

interface TagGroupElementProps {
  key?: string;
  tag: TagData;
  action?: Function;
  classOverride?: string;
  editEnable?: boolean;
}

const TagGroupElement = (props: TagGroupElementProps) => {

  function emptyAction() {
    console.log(`No action configured for tag ${props.tag.value}`);
    return;
  };

  const btnAction = props.action ? props.action : emptyAction;

  function callAction() {
    btnAction(props.tag);
  }
  return(
    <div className='flex flex-nowrap gap-2 items-center'>
      <Tag color={props.tag.color} classOverride={props.classOverride}>{props.tag.value}</Tag>
      { props.action && props.editEnable ? <button onClick={callAction} className='btn btn-sm'>x</button> : <></> }
    </div>
  );
};

export default TagGroupElement;
