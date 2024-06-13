import { ApiTypes, GetUserResponse } from '@models/api'
import { AppState } from '@storage/state';
import { StorageStateFields } from '@models/app';
import { isEmpty } from '@util/Utility';
import { UserData } from '@models/UserData';

export const GetUser: ApiTypes['GetUser'] = async (): Promise<GetUserResponse> => {
  const userData = AppState.getFieldValue(StorageStateFields.User) as UserData;
  console.log(`Retrieved: ${JSON.stringify(userData)}`);
  if (!userData || isEmpty(userData)) {
    return {
      status: 'NOT_FOUND',
    };
  }
  return {
    status: 'SUCCESS',
    data: userData,
  };
}

export default GetUser;
