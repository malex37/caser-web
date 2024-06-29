'use server'
import { DynamoDBClient, PutItemCommand, PutItemInput } from '@aws-sdk/client-dynamodb';
import { PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { SessionKeysOptions } from '@middleware/Config';
import { FolderDbSchema } from '@models/DBSchemas/Folders';
import { CreateFolderInput, CreateFolderInputKeys } from '@models/api/CreateFolderInput';
import { SessionServiceKeys } from '@models/api/auth/SessionToken';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { v4 as uuid } from 'uuid';

export default async function CreateFolder(_currentState: unknown, formData: FormData) {
  console.log(`YEEEEEEEHAW`);
  console.log(`
    ${formData.get('name')}
    ${formData.get('client')}
    ${formData.get('caseType')}
    ${formData.get('judge')}
    ${formData.get('county')}
  `);
  // get data
  const folderProps = formDataToInput(formData);
  console.log(`Transformed folderProps: ${JSON.stringify(folderProps)}`);
  const session = await getIronSession<SessionServiceKeys>(cookies(), SessionKeysOptions);
  const creds = {
    accessKeyId: session.AKI,
    secretAccessKey: session.SKI,
    sessionToken: session.ST,
    accountId: process.env.AWS_ACCOUNT_ID,
  }
  // Create a folder in bucket
  const s3Client = new S3Client({
    region: 'us-east-1',
    credentials: creds,
  });
  // create folder command
  const putObjectInput: PutObjectCommandInput = {
    Bucket:process.env.BUCKET_NAME,
    Key: `${folderProps.name}/`,
    ContentLength: 0,
  }
  console.log(`Invoking S3 to put object with input ${JSON.stringify(putObjectInput)}`);
  const putObjectCommand = new PutObjectCommand(putObjectInput);
  const putResult = await s3Client.send(putObjectCommand);
  console.log(`PutObject output is: ${putResult}`);
  // once the bucket is created register the entry in ddb
  const dynamoDBClient = new DynamoDBClient({
    region: process.env.SERVICE_REGION,
    credentials: creds,
  });
  const newFolderId = uuid();
  const putItemInput: PutItemInput = {
    TableName: process.env.FOLDERS_TABLE,
    Item: {
      [FolderDbSchema.id]: { S: newFolderId },
      [FolderDbSchema.name]: { S: folderProps.name },
      [FolderDbSchema.client]: { S: folderProps.client },
      [FolderDbSchema.judge]: { S: folderProps.judge },
      [FolderDbSchema.county]: { S: folderProps.county },
      [FolderDbSchema.caseType]: { S: folderProps.caseType },
      [FolderDbSchema.allowed_users]: { L: [] },
      [FolderDbSchema.tasks]: { L: [] },
    }
  };

  const putItemCommand = new PutItemCommand(putItemInput);
  const putItemOutput = await dynamoDBClient.send(putItemCommand);
  console.log(`Successfully put item for folder name ${folderProps.name} and id ${newFolderId}`);
  console.log(`PutItem result is: ${JSON.stringify(putItemOutput)}`)
  return true;
}

function formDataToInput(formData: FormData): CreateFolderInput {
  const keys = Object.keys(CreateFolderInputKeys);
  const res: any = {};
  keys.map(key => {
    const val = formData.get(key)
    console.log(`${key}: ${val}`);
    res[key] = val;
    if (!val) {
      throw new Error('Invalid input');
    }
  })
  return res;
}
