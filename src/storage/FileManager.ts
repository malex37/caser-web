export class FileManager {
  constructor() { }

  static sanitizeName(pathName: string): string {
    const indexOfSlash = pathName.lastIndexOf('/') + 1;
    console.log(`Located last '/' at ${indexOfSlash}`);
    const writtenFileName = pathName.substring(indexOfSlash, pathName.length);
    return writtenFileName;
  }

  static async writeFile(name: string, data: ArrayBuffer): Promise<'OK' | 'ERROR'> {
    console.log(`[FileManager] Starting write for file ${name}`);
    // sanitize, remove everyting up to the last slash, this
    // is in case the file is xxx/yyy/zzz/aaa.b then we only want aaa.b
    const writtenFileName = FileManager.sanitizeName(name);
    console.log(`Using sanitized name ${writtenFileName}`);
    try {
      // get root dir
      const rootDir = await navigator.storage.getDirectory();
      console.log(`Acquired rootDir  ${rootDir.name}`);
      const fileHandler = await rootDir.getFileHandle(`${writtenFileName}`, { create: true });
      console.log(`Acquired fileHandler ${fileHandler.name}`);
      const fileAccessHandler = await fileHandler.createWritable();
      console.log(`Created writeable`);
      await fileAccessHandler.write(data);
      console.log(`Finished writing file with name ${writtenFileName}`);
      await fileAccessHandler.close();
    } catch (error) {
      console.log(`File writing failed with error ${JSON.stringify(error)}`);
      throw error;
    }
    return 'OK';
  }

  static async getFile(name: string): Promise<File | undefined> {
    const cleanName = FileManager.sanitizeName(name);
    try {
      console.log(`[FileManager] Getting root dir`)
      const fsRoot = await navigator.storage.getDirectory();
      console.log(`[FileManager] Getting file handle for ${cleanName}`);
      const fileHandler = await fsRoot.getFileHandle(cleanName);
      console.log(`[FileManager] Getting file for`);
      const file = await fileHandler.getFile();
      console.log(`[FileManager] Returrning file`);
      return file;
    } catch (error) {

    }
    return undefined;
  }
}
