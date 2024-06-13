import { BoardConfig } from '@models/BoardConfig';
import { BoardData, SaveBoardConfigResponse } from '@models/index';
import { AppState } from '@storage/state';
import { merge } from 'lodash';

const SaveBoardConfig = async (newConfig: BoardConfig): Promise<SaveBoardConfigResponse> => {
  const bord: BoardData = AppState.getFieldValue('Boards')[newConfig.boardId];
  if (!bord) {
    return {
      status: 'FAIL',
    };
  }
  const mergedConfig = merge(bord.config, newConfig);
  bord.config = mergedConfig;
  return {
    status: 'SUCCESS'
  };
};

export default SaveBoardConfig;
