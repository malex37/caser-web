// import { BoardData } from '@models/BoardData';
// import { AppState } from '../storage';
// import { ApiTypes, GetBoardFieldResponse } from '@models/index';
//
// const GetBoardField: ApiTypes['GetBoardField'] = async (boardId: string, field: keyof BoardData): Promise<GetBoardFieldResponse> => {
//   const board = AppState.getFieldValue('Boards')[boardId];
//   if (!board) {
//     return {
//       status: 'NOT_FOUND'
//     }
//   }
//   const data = board[field];
//   return {
//     status: 'SUCCESS',
//     data: data,
//   };
// }
//
// export default GetBoardField;
