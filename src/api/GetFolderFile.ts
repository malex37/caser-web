'use server'
import { cookies } from "next/headers";
import { getS3Client } from "../clients/s3Client";
import { GetObjectCommand, GetObjectCommandInput, GetObjectCommandOutput } from "@aws-sdk/client-s3";
import { FolderFile } from "@models/api/FolderFile";

export default async function GetFolderFile(fileKey: string, id: string): Promise<FolderFile> {
  try {
    const client = await getS3Client(cookies());
    const getFileInput: GetObjectCommandInput = {
      Bucket: process.env.BUCKET_NAME,
      Key: fileKey,
    };
    const fileExtension = fileKey.substring(fileKey.lastIndexOf('.'), fileKey.length);
    const result: FolderFile = {
      type: fileExtension as '.txt' | '.pdf',
      name: fileKey.substring(fileKey.lastIndexOf('/', fileKey.length)),
      key: id,
    };
    console.log(`Created get object input ${JSON.stringify(getFileInput)}`);
    const getFileCommand = new GetObjectCommand(getFileInput);
    console.log('Created getFile command');
    const fileOutput: GetObjectCommandOutput = await client.send(getFileCommand);

    console.log(`Completed call with response with metadata ${JSON.stringify(fileOutput.$metadata, null, 2)}`);
    // parse the body to a buffer?
    if (!fileOutput.Body) {
      throw new Error('Incomplete file returned');
    }
    const bodyBuffer = await fileOutput.Body.transformToString('base64');
    result.data = bodyBuffer;

    // console.log(`Retrieved fileBuffer ${JSON.stringify(bodyBuffer)}`);
    return result;
  } catch (error) {
    console.error(`Failed created client with ${JSON.stringify(error as unknown as any)}`);
    throw error;
  }
};
