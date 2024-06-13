import { ApiTypes, GetBoardConfigResponse } from '@models/api';
import { AppState } from '@storage/state';
import { BoardData } from '@models/BoardData';

/**
 * Returns only configuration field within the board data. Made to keep the data returnes as a smaller payload
 * @group API
 * @param boardId - UUID for board to retrieve config of
 */
export const GetBoardConfig: ApiTypes['GetBoardConfig'] = async (boardId: string): Promise<GetBoardConfigResponse> => {
  console.log(`Retrieving board config for id ${boardId}`);
  const boards = AppState.getFieldValue('Boards');
  const board: BoardData = boards[boardId];
  if (!board) {
    console.log(`No board found for id ${boardId}`);
    return {
      status: 'NOT_FOUND'
    }
  }
  return {
    status: 'SUCCESS',
    data: board.config,
  };
}

export default GetBoardConfig;
