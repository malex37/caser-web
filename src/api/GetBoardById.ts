import { ApiTypes, GetBoardByIdResponse } from '@models/api';
import { AppState } from '@storage/state';
import { StorageStateFields } from '@models/app';

/**
 * Returns task board information from board uuid
 * @group API
 * @param boardId - UUID belonging to a task board
 * Refer to response for data returned
 */
export const GetBoardById: ApiTypes['GetBoardById'] = async (boardId: string): Promise<GetBoardByIdResponse> => {
  console.log(`Retrieving: ${boardId}`);
  const boardState = AppState.getFieldValue(StorageStateFields.Boards);
  console.log(`Boards: ${JSON.stringify(Object.keys(boardState))}`);
  const board = boardState[boardId];
  if (!board) {
    return {
      status: 'NOT_FOUND',
    };
  }
  return {
    status: 'SUCCESS',
    data: board,
  };
}

export default GetBoardById;
