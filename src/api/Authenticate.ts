'use server';

import { AuthenticationResultType, CognitoIdentityProviderClient, InitiateAuthCommand, InitiateAuthCommandInput } from "@aws-sdk/client-cognito-identity-provider";
import { createHmac } from "crypto";
import { cookies } from "next/headers";

const clientId = '6lt1t6rhh1v3e7gftbgpr30efp';
const clientS = 'q53s2b3ct18gdug7vak0ll1tk1qcthlk6saos9ulo8jrnjoeosu';

function generateHash(username: string) {
  const hashBuilder = createHmac('sha256', clientS);
  hashBuilder.update(`${username}${clientId}`);
  return hashBuilder.digest('base64');
}

/**
 * Technically the InitiateAuth flow here can use a secret_hash BUT if it's to be distributed
 * to devices or environments out of our control then we can't expose that secret. Particurlaly
 * if the app it to be ejected to be mounted within an electron app.
 */
export async function Authenticate(_currentState: unknown, formData: FormData): Promise<'APPROVED' | 'DENIED'> {
  try {
    const providedPswd = formData.get('password');
    const providedUsername = formData.get('username');
    if (!providedPswd || typeof providedPswd !== 'string') {
      throw new Error('Password is required');
    }
    if (!providedUsername || typeof providedUsername !== 'string') {
      throw new Error('Username invalid');
    }
    console.log(`Provided username ${providedUsername} and password: ${providedPswd}`);
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
    console.log(`Initiate auth response is ${JSON.stringify(response, null, 2)}`);
    if (!response.AuthenticationResult?.IdToken || !response.AuthenticationResult.AccessToken) {
      throw new Error('No ID or access token in auth response');
    }
    // SUCCESS!
    console.info(`Success user ${providedUsername} successfully authenticated`);
    return 'APPROVED';
  } catch (error) {
    return 'DENIED';
  }
}
