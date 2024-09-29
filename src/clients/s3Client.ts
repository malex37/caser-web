import { S3Client } from "@aws-sdk/client-s3";
import { SessionKeysOptions } from "@middleware/Config";
import { SessionServiceKeys } from "@models/api/auth/SessionToken";
import { getIronSession } from "iron-session";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export async function getS3Client(sessionCookies: ReadonlyRequestCookies) {
  try {
    console.log('[GetS3Client] Acquiring session');
    const session = await getIronSession<SessionServiceKeys>(sessionCookies, SessionKeysOptions);
    console.log(`[GetS3Client] session for s3 contents: ${JSON.stringify(session, null, 2)}`);
    if (!session || !session.ST || !session.AKI || !session.SKI) {
      throw new Error('Access denied');
    }
    console.log(`[GetS3Client] Creating client`);
    return new S3Client({
      region: 'us-east-1',
      credentials: {
        sessionToken: session.ST,
        accessKeyId: session.AKI,
        secretAccessKey: session.SKI,
        accountId: process.env.ACCOUNT_ID
      }
    });
  } catch (error) {
    throw error;
  }
}
