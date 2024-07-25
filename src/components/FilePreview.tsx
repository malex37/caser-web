'use client'

import { useEffect, useRef, useState } from "react";
// @ts-ignore next-line
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { FileManager } from "@storage/FileManager";
import PdfCanvas from '@components/preview-widgets/PdfCanvas';
import TextFile from "./preview-widgets/TextFile";
import { PreviewFile } from "@models/app";
import { MimeTypes } from "@models/MimeTypes";
import MarkdownFile from "./preview-widgets/MarkdownFile";
import { v4 as uuid } from 'uuid';
import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import { ShowToast } from "@components/molecules/ToastMessageHandler";


function Controls({
  onClose,
  onLock,
  editEnabled
}: {
  onClose: Function, onLock: Function, editEnabled: boolean
}) {
  const editOrSave = (lockState: boolean) => {
    if (!lockState) {
      return 'Save';
    }
    return 'Edit';
  }
  return (
    <div className="dropdown dropdown-hover w-1/3">
      <div
        tabIndex={0}
        role="button"
        className="btn m-1"
      >
        <Cog8ToothIcon
          className="w-full h-full" />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[10] hover:z-[20] w-52 p-2 shadow "
      >
        <li><div onClick={() => onLock()}>{editOrSave(editEnabled)}</div></li>
        <li><div onClick={() => onClose()}>Close</div></li>
      </ul>
    </div>
  );
}


export default function FilePreview(
  { fileKey, visibility, visControl, currentFolder }:
    { fileKey: string, visibility: 'visible' | 'invisible', visControl: Function, currentFolder: string }
): JSX.Element {
  const [fileData, setFileData] = useState<PreviewFile>({} as PreviewFile);
  const [locked, setLocked] = useState(true);
  const previewComponentRef = useRef(null);
  // create document
  const GetFileFromCache = async (fileKey: string) => {
    console.log(`[FilePreview] Getting file from storage ${fileKey}`);
    if (fileKey === '') {
      console.log('[FilePreview] File key not initialized');
      return;
    }
    try {
      const file = await FileManager.getFile(fileKey);
      if (!file) {
        console.error(`No file with name ${fileKey} present!`);
        throw new Error('Invalid name');
      }
      console.log(`[FilePreview] File ${fileKey} loaded. is type: ${file.type}`);
      setFileData({
        name: fileKey,
        data: file,
        type: file.type,
      });
    } catch (error) {
      console.log(`[FilePreview] Caugh error ${JSON.stringify(error as unknown as any)}`)
    }
  }

  useEffect(() => {
    console.log('[FilePreview] Acting on useEffect');
    GetFileFromCache(fileKey);
  }, [fileKey]);

  async function SaveFile() {
    if (!previewComponentRef || !previewComponentRef.current) {
      throw new Error('Preview component reference is undefined');
    }
    try {
      // @ts-ignore next-line
      const text = previewComponentRef.current.editedText();
      // @ts-ignore next-line
      if (!previewComponentRef.current.wasEdited()) {
        ShowToast({ type: 'info', message: 'No changes made to file'});
        return;
      }
      // @ts-ignore next-line
      const fileInfo = previewComponentRef.current.info();
      const fileBlob = new File([text], fileInfo.name, {
        type: fileInfo.type,
      });
      try {
        await FileManager.uploadFile(currentFolder, fileInfo.name, fileBlob);
        ShowToast({ type: 'success', message: 'File Saved!' });
      } catch (error) {
        ShowToast({ type: 'error', message: `Suffered an error ${JSON.stringify((error as unknown as any), null, 2)}`})
      }
    } catch (error) {
      console.log('Error saving file', error);
    }
  }
  function closePreview() {
    setLocked(true);
    visControl('invisible');
  }
  function toggleLock() {
    console.log(`Enabling edit for editor. Previous value ${locked}`);
    if (locked === false) {
      SaveFile();
    }
    setLocked(!locked);
  }
  function RenderComponentFactory(file: PreviewFile) {
    if (file.name === fileData.name) {
      console.log('[FilePreview] Rendering file and state file are the same');
      console.log(`[FilePreview] Rendering request for file ${JSON.stringify(file)}`);
    }
    console.log(`[FilePreview] Rendering file of type ${file.type}`);
    if (!file || !file.data || !file.type) {
      console.log('[FilePreview] Failed to render preview. No data');
      return undefined;
    }
    if (file.type === MimeTypes.pdf) {
      console.log(`[FilePreview] rendering pdf with name ${file.name}`);
      return <PdfCanvas file={file} />;
    }
    if (file.type === 'text/markdown') {
      return <MarkdownFile ref={previewComponentRef} file={file} editLocked={locked} />
    }
    // Default try to render as text
    return <TextFile ref={previewComponentRef} key={`${file.name}+${uuid()}`} className='w-full p-3' file={file}></TextFile>
  }

  return (
    visibility === 'visible' ?
      <div className="w-full h-full flex flex-col gap-3">
        <Controls
          onClose={closePreview}
          onLock={toggleLock}
          editEnabled={locked} />
        <div id="preview-container" className="w-full">
          {RenderComponentFactory(fileData)}
        </div>
      </div> : <></>
  )
}
