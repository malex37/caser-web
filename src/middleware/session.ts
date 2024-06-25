'use server'
import { CognitoIdentityClient, GetCredentialsForIdentityCommand, GetCredentialsForIdentityInput, GetIdCommand, GetIdCommandInput } from '@aws-sdk/client-cognito-identity';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import { AssumeRoleWithWebIdentityCommand, AssumeRoleWithWebIdentityCommandInput, STSClient } from '@aws-sdk/client-sts';
import { SessionToken } from '@models/api/auth/iron';
import { createHmac } from 'crypto';
import { SessionOptions, getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { v4 as uuid } from 'uuid';

const clientId = '6lt1t6rhh1v3e7gftbgpr30efp';
const clientS = 'q53s2b3ct18gdug7vak0ll1tk1qcthlk6saos9ulo8jrnjoeosu';

function generateHash(username: string) {
  const hashBuilder = createHmac('sha256', clientS);
  hashBuilder.update(`${username}${clientId}`);
  return hashBuilder.digest('base64');
}
// v0)VRgJ2iJepnor)Uqu#LdEppqppBMqB
export async function SessionControl(_currentState: unknown, formData: FormData): Promise<'APPROVED' | 'DENIED'> {
  // use aws cognito to authenticate user
  let providedPswd = formData.get('password');
  let providedUsername = formData.get('username');
  if (!providedPswd || typeof providedPswd !== 'string') {
    if (process.env.DEV_PSWD && process.env.DEV_USR) {
      console.log(`Using env settings PSWD ${process.env.DEV_PSWD} and USR ${process.env.DEV_USR}`);
      providedPswd = process.env.DEV_PSWD;
      providedUsername = process.env.DEV_USR;
    }
    throw new Error('Password is required');
  }
  if (!providedUsername || typeof providedUsername !== 'string') {
    throw new Error('Username invalid');
  }
  console.log(`Env settings are PSWD ${process.env.DEV_PSWD} and USR ${process.env.DEV_USR}`);
  console.log(`Provided username ${providedUsername} and password: ${providedPswd}`);
  const sessionOptions: SessionOptions = {
    password: process.env.DEV_PSWD || providedPswd,
    cookieName: 'x-iron-ticket',
    cookieOptions: {
      secure: true,
      path: '/'
    }
  }
  let session;
  try {
    session = await getIronSession<SessionToken>(cookies(), sessionOptions);
  } catch (error) {
    console.log('Failed to get iron session with error ', error);
    return 'DENIED';
  }
  const loginInput: InitiateAuthCommandInput = {
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
  console.log(`[Session] Cognito response ${JSON.stringify(response, null, 2)}`);
  if (!response.AuthenticationResult || !response.AuthenticationResult.IdToken || !response.AuthenticationResult.AccessToken) {
    console.error('Incomplete auth')
    return 'DENIED';
  }
  const idToken = response.AuthenticationResult.IdToken;
  // check if session is active
  if (!session.active) {
    // have to create a new session
    const stsCreds = await assumeRole(response.AuthenticationResult.IdToken, providedUsername);
    if (!stsCreds.Credentials || !stsCreds.Credentials.AccessKeyId || !stsCreds.Credentials.SecretKey) {
      console.error('Unable to assume role, missing Credentials')
      return 'DENIED';
    }
    session.username = providedUsername;
    session.active = true;
    session.sessionId = response.Session || uuid();
    session.webId = idToken,
    session.cognitoCred = {
      accessKeyId: stsCreds.Credentials.AccessKeyId,
      secretKey: stsCreds.Credentials.SecretKey
    };
    // create the session
    await session.save();
  }
  return 'APPROVED';
}

async function assumeRole(idToken: string, username: string) {
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
    AccountId: process.env.AWS_ACCOUNT_ID,
    IdentityPoolId: process.env.IDENTITY_POOL_ID,
    Logins: loginMap
  };
  const idCommand = new GetIdCommand(idInput);
  console.log(`Using IdCommand ${JSON.stringify(idCommand, null, 2)}`);
  const identityId = await client.send(idCommand);
  console.log(`Identity id is: ${JSON.stringify(identityId)}`);
  const getCredsInput: GetCredentialsForIdentityInput = {
    IdentityId: identityId.IdentityId,
    Logins: loginMap
  };
  const command = new GetCredentialsForIdentityCommand(getCredsInput);

  const idResponse = await client.send(command);
  console.log(`Assume role response ${JSON.stringify(idResponse, null, 2)}`)
  return idResponse;
}
