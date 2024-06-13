import { StorageStateField } from '@models/app/storage';
import { AppState } from '@storage/state';
import { ApiTypes, GetAppStateResponse } from '@models/api';

const GetAppState: ApiTypes['GetAppState'] = async <T extends StorageStateField>(key: T): Promise<GetAppStateResponse> => {
  const state = AppState.getFieldValue(key);
  if (!state) {
    return {
      status: 'NOT_FOUND'
    }
  }
  return {
    status: 'SUCCESS',
    data: state,
  }
}

export default GetAppState;
