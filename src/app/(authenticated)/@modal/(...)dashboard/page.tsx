import NewTaskModal from '@components/modals/NewTask';
import { BoardData } from '@models/BoardData';
import { v4 as uuid } from 'uuid';

const save =() =>{}
const board: Partial<BoardData> = {
  id: uuid(),
  tasks: [],
}

export default function NewTask() {
  return (
    <NewTaskModal saveAction={save} boardData={board}></NewTaskModal>
  )
}
