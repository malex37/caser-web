'use client'
import { FolderFile } from "@models/api/FolderFile";
import Dexie, { Table } from "dexie";

export class FilesDatabase extends Dexie{
  files!: Table<FolderFile>;
  constructor() {
    super('Files');
    this.version(1).stores({
      files: 'key, file',
    });
  }
}

export const FilesDB = new FilesDatabase();
