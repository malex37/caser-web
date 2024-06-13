import { Team } from '@models/Team';
import { ApiTypes, BasicResponse } from '@models/index';
import { AppState } from '@storage/state';
import { StorageStateFields } from '@models/app';

const CreateTeam: ApiTypes['CreateTeam'] = async (team: Team): Promise<BasicResponse> => {
  let teamState = AppState.getFieldValue(StorageStateFields.Team);
  teamState = team;
  return {
    status: 'SUCCESS',
  };
}

export default CreateTeam;
