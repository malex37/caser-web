import { ApiTypes } from '@models/api';
import { AppState } from '@storage/state';
import { StorageStateFields } from '@models/app';

/**
 * Retrieves all boards from storage. Used only for desktop development
 * @group API
 * @param none
 */
export const GetBoards: ApiTypes['GetBoards'] = () => {
  const boards = AppState.getFieldValue(StorageStateFields.Boards);
  console.log(`Boards: ${JSON.stringify(boards)}`);
  if (!boards) {
    return Promise.resolve({
      status: 'NOT_FOUND'
    });
  }
  return Promise.resolve({
    status: 'SUCCESS',
    boards: boards,
  })
}

export default GetBoards;
