'use server'
import { BatchGetItemCommand, BatchGetItemInput, DynamoDBClient, ScanCommand, ScanInput } from "@aws-sdk/client-dynamodb";
import { SessionKeysOptions } from "@middleware/Config";
import { Folder, FolderDbType, reshapeDbFolder } from "@models/DBSchemas/Folders";
import { SessionServiceKeys } from "@models/api/auth/SessionToken";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export default async function GetFolders(folderIds?: string[]): Promise<Folder[]> {
  const session = await getIronSession<SessionServiceKeys>(cookies(), SessionKeysOptions);

  if (!session) {
    throw new Error('Access denied');
  }
  console.log(`[${GetFolders.name}] getting folders with IDs ${JSON.stringify(folderIds)}`);
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
  }
  if (!folderIds || folderIds.length === 0) {
    const inputCmd = new ScanCommand(input);
    const result = await dbClient.send(inputCmd);
    if (!result.Items) {
      return [] as Folder[];
    }
    return (result.Items as FolderDbType[])?.map((folder: FolderDbType) => {
      return reshapeDbFolder(folder);
    });
  }
  const batchCommandInput: BatchGetItemInput = {
    RequestItems: {
      "Tickety_folders": {
        Keys: folderIds.map(id => { return { "id": { S: id } } }),
      }
    }
  };
  const batchGetCommand = new BatchGetItemCommand(batchCommandInput);
  const batchGetResponse = await dbClient.send(batchGetCommand);
  if (!batchGetResponse.Responses || !batchGetResponse.Responses['Tickety_folders'] || batchGetResponse.Responses['Tickety_folders'].length === 0) {
    return [];
  }
  const retrievedFolders = batchGetResponse.Responses['Tickety_folders'];
  const reshapedFolders = (retrievedFolders as FolderDbType[]).map(ddbFolder => reshapeDbFolder(ddbFolder))
  return reshapedFolders;
}
