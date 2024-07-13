'use client'
import { useEffect, useState } from "react";
import Tab from "./Tab";
import { ArrowPathIcon, ArrowUpCircleIcon } from "@heroicons/react/24/outline";

export default function FSInfo() {
  const [fsFiles, setFsFiles] = useState([] as any[]);
  const getFsFiles = async () => {
    try {
      const rootDir = await navigator.storage.getDirectory();
      // const dirHandler = await rootDir.getDirectoryHandle('.');
      const iterableKeys = rootDir.keys();
      const keyArr = [];
      for await (const key of iterableKeys) {
        keyArr.push(key);
      }
      setFsFiles(keyArr);
    } catch (error) {
      console.error(`Failed to get FS info with error ${JSON.stringify((error as unknown as any))}`)
      throw error;
    }
  }
  useEffect(() => {
    getFsFiles();
  }, []);

  return (
    <Tab title="File system">
      <div>
        <div className="hover:cursor-pointer" onClick={getFsFiles}>
          <ArrowPathIcon className="w-24"/>
        </div>
        {JSON.stringify(fsFiles)}
      </div>
    </Tab>
  );
}
