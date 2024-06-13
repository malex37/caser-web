import { useDroppable } from '@dnd-kit/core';

function TaskLane(props: { id: string, children: any }) {
    const {isOver, setNodeRef} = useDroppable({
      id: props.id
    });
    const cardStyle = {
      opacity: !isOver ? 1 : 0.5,
    };
  return (
    <div ref={setNodeRef} style={cardStyle} className='h-full border-r border-l border-t rounded border-gray-300 p-3 m-2' >
      { props.children }
    </div>
  );
};

export default TaskLane;
