'use server'

import { PutObjectCommand, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { SessionKeysOptions } from "@middleware/Config";
import { SessionServiceKeys } from "@models/api/auth/SessionToken";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export default async function UploadFile(
  folderId: string,
  fileName: string,
  file: Uint8Array,
): Promise<boolean> {
  const session = await getIronSession<SessionServiceKeys>(cookies(), SessionKeysOptions);
  if (!session) {
    throw new Error('Access denied');
  }

  const s3Client = new S3Client({
    region: 'us-east-1',
    credentials: {
      sessionToken: session.ST,
      accessKeyId: session.AKI,
      secretAccessKey: session.SKI,
      accountId: process.env.AWS_ACCOUNT_ID,
    }
  });
  const putCommandInput: PutObjectCommandInput = {
    Bucket: process.env.BUCKET_NAME,
    Key: folderId+`/${fileName}`,
    Body: file,
    ContentLength: file.length
  };

  const putCommand = new PutObjectCommand(putCommandInput);
  const response = await s3Client.send(putCommand);
  console.log(`[${UploadFile.name}] upload completed with result ${JSON.stringify(response)}`);
  return true;
}
