'use server'
import { DynamoDBClient, ScanCommand, ScanInput } from "@aws-sdk/client-dynamodb";
import { SessionKeysOptions } from "@middleware/Config";
import {  Folder, FolderDbType, reshapeDbFolder } from "@models/DBSchemas/Folders";
import { SessionServiceKeys } from "@models/api/auth/SessionToken";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export default async function GetFolders(): Promise<Folder[]> {
  const session = await getIronSession<SessionServiceKeys>(cookies(), SessionKeysOptions);

  if (!session) {
    throw new Error('Access denied');
  }

  const dbClient = new DynamoDBClient({
    region: process.env.SERVICE_REGION,
    credentials: {
      secretAccessKey: session.SKI,
      accessKeyId: session.AKI,
      sessionToken: session.ST,
    }
  });
  const input: ScanInput = {
    TableName: process.env.FOLDERS_TABLE,
  };
  const inputCmd = new ScanCommand(input);
  const result = await dbClient.send(inputCmd);
  if (!result.Items) {
    return [] as Folder[];
  }
  return (result.Items as FolderDbType[])?.map((folder: FolderDbType) => {
    return reshapeDbFolder(folder);
  } );
}
