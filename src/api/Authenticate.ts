'use server';

// malex: 4r.9Jwi9R?_3YEE
import { AuthenticationResultType, CognitoIdentityProviderClient, InitiateAuthCommand, InitiateAuthCommandInput } from "@aws-sdk/client-cognito-identity-provider";
import { createHmac } from "crypto";
const clientId = '6lt1t6rhh1v3e7gftbgpr30efp';
const clientS = 'q53s2b3ct18gdug7vak0ll1tk1qcthlk6saos9ulo8jrnjoeosu';

function generateHash(username: string) {
  const hashBuilder = createHmac('sha256', clientS);
  hashBuilder.update(`${username}${clientId}`);
  return hashBuilder.digest('base64');
}

/**
 * Technically the InitiateAuth flow here can use a secret_hash BUT if it's to be distributed
 * to an electron app then we don't want to expose a client secret.
 */
export async function Authenticate(_currentState: unknown, formData: FormData) {
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
    if (!process.env.AWS_SECRET || !process.env.AWS_KEY) {
      throw new Error('Invlid AWS SDK credentials');
    }
    const client = new CognitoIdentityProviderClient({
      region: 'us-west-2',
    });
    const response = await client.send(loginCommand);
    console.log(`Initiate auth response is ${JSON.stringify(response, null, 2)}`);
    if (!response.AuthenticationResult?.IdToken || !response.AuthenticationResult.IdToken) {
      throw new Error('No ID token in auth response');
    }
    // redirect to dashboard
    return;
  } catch (error) {
    throw error;
  }
}
