import csv from 'csvtojson';
import { writeFileSync } from 'fs';
async function generateMimeTypes() {
  const response = await fetch('https://www.iana.org/assignments/media-types/application.csv', {
    method: "GET",
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:128.0) "Gecko/20100101 Firefox/128.0"'
    }
  });
  if (!response.body) {
    return;
  }
  const bodyblob = await response.blob();
  const bodyText = await bodyblob.text();
  const jsonCsv = await csv().fromString(bodyText);
  const jsonFile: Record<string, string> = {};
  const mimeTypeKeys: Record<string, string> = {};
  jsonCsv.map((part: {Name: string, Template: string} )=> {
    if (part.Name.includes('OBSOLETE')) {
      return;
    }
    jsonFile[part.Name] = part.Template;
    mimeTypeKeys[part.Name] = part.Name;
  });
  const stringJson = JSON.stringify(jsonFile, null, 2);
  const keysJson = JSON.stringify(mimeTypeKeys, null, 2);
  const keyType = "export type MimeKeysType = keyof typeof MimeTypeKeys";
  const file = " export const MimeTypes = " + stringJson + '\n' + 'export const MimeTypeKeys = ' + keysJson + '\n' + keyType;
  writeFileSync("./src/models/MimeTypes.ts", file, );
}

generateMimeTypes();
