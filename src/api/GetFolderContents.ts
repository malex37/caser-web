'use server'

import { ListObjectsV2Command, ListObjectsV2CommandInput, ListObjectsV2CommandOutput, S3Client } from "@aws-sdk/client-s3";
import { SessionKeysOptions } from "@middleware/Config";
import { SessionServiceKeys } from "@models/api/auth/SessionToken";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { v4 as uuid } from 'uuid';

export interface ReshapedFolder {
  name: string;
  size: number;
  lastModified: Date;
  bucketKey: string;
  uuid: string;
}

function reshapeBucketFolder(bucketDescription: ListObjectsV2CommandOutput, prefix: string): ReshapedFolder[] {
  const reshaped = bucketDescription.Contents?.map(content => {
    if (!content.Key || !content.Size || !content.LastModified) {
      return;
    }
    // Filter root object
    const finalKey = content.Key.replaceAll(prefix, '');
    if (finalKey === '') {
      return;
    }
    return {
      name: finalKey,
      size: content.Size,
      lastModified: content.LastModified,
      bucketKey: content.Key,
      uuid: content.ETag || uuid(),
    } as ReshapedFolder;
  });
  // remove undefined
  return (reshaped || []).filter(el => el !== undefined) as ReshapedFolder[];
}

export default async function GetFolderContents(folderId: string): Promise<ReshapedFolder[]> {
  const session= await getIronSession<SessionServiceKeys>(cookies(), SessionKeysOptions);
  if (!session) {
    throw new Error('Access denied');
  }

  const s3Client = new S3Client({
    region: 'us-east-1',
    credentials: {
      sessionToken: session.ST,
      accessKeyId: session.AKI,
      secretAccessKey: session.SKI,
      accountId: process.env.AWS_ACCOUNT_ID
    }
  });
  const commandInput: ListObjectsV2CommandInput = {
    Bucket: process.env.BUCKET_NAME,
    Prefix: folderId+'/',
    Delimiter: '/'
  }
  const command = new ListObjectsV2Command(commandInput);
  const bucketContents = await s3Client.send(command);
  return reshapeBucketFolder(bucketContents, folderId + '/');
}
