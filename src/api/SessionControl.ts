'use server'
import {
  CognitoIdentityClient,
  GetCredentialsForIdentityCommand,
  GetCredentialsForIdentityInput,
  GetIdCommand,
  GetIdCommandInput
} from '@aws-sdk/client-cognito-identity';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import { SessionServiceKeys, SessionToken } from '@models/api/auth/SessionToken';
import { createHmac } from 'crypto';
import { IronSession, getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { SessionKeysOptions, SessionTokenOptions } from '../middleware/Config';

const clientId = '6lt1t6rhh1v3e7gftbgpr30efp';
const clientS = 'q53s2b3ct18gdug7vak0ll1tk1qcthlk6saos9ulo8jrnjoeosu';

function generateHash(username: string) {
  const hashBuilder = createHmac('sha256', clientS);
  hashBuilder.update(`${username}${clientId}`);
  return hashBuilder.digest('base64');
}

export async function SessionControl(_currentState: unknown, formData: FormData): Promise<'APPROVED' | 'DENIED'> {
  // use aws cognito to authenticate user
  let providedPswd = formData.get('password');
  let providedUsername = formData.get('username');
  if (!providedPswd || typeof providedPswd !== 'string') {
    throw new Error('Password is required');
  }
  if (!providedUsername || typeof providedUsername !== 'string') {
    throw new Error('Username invalid');
  }
  console.log(`Env settings are PSWD ${process.env.DEV_PSWD} and USR ${process.env.DEV_USR}`);
  let tokenSession;
  let serviceSession;
  try {
    tokenSession = await getIronSession<SessionToken>(cookies(), SessionTokenOptions);
    serviceSession = await getIronSession<SessionServiceKeys>(cookies(), SessionKeysOptions)
  } catch (error) {
    console.log('Failed to get iron session with error ', error);
    return 'DENIED';
  }
  console.log(`TokenSession: ${JSON.stringify(tokenSession, null, 2)}`)
  console.log(`ServiceSession: ${JSON.stringify(serviceSession, null, 2)}`);
  // check if token needs renewal
  if (
    checkForEmptyFields(tokenSession) ||
      checkForEmptyFields(serviceSession) ||
      isTokenExpired(serviceSession)
  ) {
    console.log('Initiating auth');
    let loginInput: InitiateAuthCommandInput = {
      AuthFlow: "USER_PASSWORD_AUTH",
      AuthParameters: {
        PASSWORD: providedPswd,
        USERNAME: providedUsername,
        SECRET_HASH: generateHash(providedUsername),
      },
      ClientId: clientId,
    }
    const loginCommand = new InitiateAuthCommand(loginInput);
    const client = new CognitoIdentityProviderClient({
      region: 'us-west-2',
    });
    const response = await client.send(loginCommand);
    if (
      !response.AuthenticationResult ||
      !response.AuthenticationResult.IdToken ||
      !response.AuthenticationResult.AccessToken ||
      !response.AuthenticationResult.RefreshToken ||
      !response.AuthenticationResult.ExpiresIn
    ) {
      console.error('Incomplete auth')
      return 'DENIED';
    }
    const stsCreds = await assumeRole(response.AuthenticationResult.IdToken);
    if (
      !stsCreds.Credentials ||
      !stsCreds.Credentials.AccessKeyId ||
      !stsCreds.Credentials.SecretKey ||
      !stsCreds.Credentials.SessionToken
    ) {
      console.error('Unable to assume role, missing Credentials')
      return 'DENIED';
    }
    if (!stsCreds.Credentials.Expiration) {
      console.log('Unable to perform login without expiration in token');
      return 'DENIED';
    }
    console.log(`Cognito token expires in ${response.AuthenticationResult.ExpiresIn}`);
    const sessionExpiration = Date.now() + response.AuthenticationResult.ExpiresIn;
    console.log(`Will set expiration to ${sessionExpiration}`);
    tokenSession.username = providedUsername;
    tokenSession.webId = response.AuthenticationResult.IdToken,
    tokenSession.refresh = response.AuthenticationResult.RefreshToken,
    serviceSession.ST  = stsCreds.Credentials.SessionToken;
    serviceSession.AKI = stsCreds.Credentials.AccessKeyId;
    serviceSession.SKI = stsCreds.Credentials.SecretKey;
    serviceSession.EXP = stsCreds.Credentials.Expiration.getTime();
    console.log(`Resulting session ${JSON.stringify(tokenSession)}`);
    // create the session
    await tokenSession.save();
    await serviceSession.save();
  }
  return 'APPROVED';
}

async function assumeRole(idToken: string) {
  // After authenticating change access token to aws credentials
  const client = new CognitoIdentityClient({
    region: 'us-west-2',
  });
  console.log(`Using login provider ID: cognito-idp.us-west-2.amazonaws.com/${process.env.USER_POOL_ID}`);
  const loginMap = {
    [`cognito-idp.us-west-2.amazonaws.com/${process.env.USER_POOL_ID}`]: idToken,
  };
  console.log(`Using login map: ${JSON.stringify(loginMap)}`)
  // get identity ID
  const idInput: GetIdCommandInput = {
    AccountId: process.env.ACCOUNT_ID,
    IdentityPoolId: process.env.IDENTITY_POOL_ID,
    Logins: loginMap
  };
  const idCommand = new GetIdCommand(idInput);
  console.log(`Using IdCommand ${JSON.stringify(idCommand, null, 2)}`);
  const identityId = await client.send(idCommand);
  // console.log(`Identity id is: ${JSON.stringify(identityId)}`);
  const getCredsInput: GetCredentialsForIdentityInput = {
    IdentityId: identityId.IdentityId,
    Logins: loginMap
  };
  const command = new GetCredentialsForIdentityCommand(getCredsInput);

  const idResponse = await client.send(command);
  return idResponse;
}

function checkForEmptyFields(session: IronSession<SessionToken | SessionServiceKeys>): boolean {
  if (Object.keys(session).length === 0) {
    return true;
  }
  for (const field in session) {
    if (!field || field == '')  {
      return true;
    }
  }
  return false;
}

// TODO: Make this to have paths for Service session and Token
function isTokenExpired(session: IronSession<SessionServiceKeys>): boolean {
  const currentTime = Date.now();
  const expirationTime = session.EXP;
  console.log(`Session eval service key exp ${new Date(expirationTime).toString()} current time is: ${new Date(Date.now())} `);
  return !(expirationTime > currentTime);
}
