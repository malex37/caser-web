import { ApiTypes, GetTeamResponse } from '@models/index';
import { AppState } from '@storage/state';
import { isEmpty } from 'lodash';
import { Team } from '@models/Team';

const GetTeam: ApiTypes['GetTeam'] = async (): Promise<GetTeamResponse> => {
  const teamState = AppState.getFieldValue('Team') as Team;
  if (!teamState || isEmpty(teamState)) {
    return {
      status: 'NOT_FOUND',
    };
  }
  return {
    status: 'SUCCESS',
    data: teamState,
  }
}

export default GetTeam;
