'use client'

import { useEffect, useState } from "react";
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


export default function FilePreview({ fileKey }: { fileKey: string }): JSX.Element {
  const [fileData, setFileData] = useState<PreviewFile>({} as PreviewFile);
  const [visible, setVisible] = useState(true);
  // create document
  const GetFileFromCache = async (fileKey: string) => {
    console.log(`[FilePreview] Getting file from storage ${fileKey}`);
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
    setVisible(true);
  }, [fileKey]);

  function closePreview() {
    setVisible(false);
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
      return <MarkdownFile file={file} />
    }
    // Default try to render as text
    return <TextFile key={`${file.name}+${uuid()}`} className='w-full p-3' file={file}></TextFile>
  }

  return (
    visible ?
      <div className="w-full h-full flex flex-col">
        <div id="preview-close" className='btn' onClick={closePreview}></div>
        <div id="preview-container" className="w-full">
          {RenderComponentFactory(fileData)}
        </div>
      </div> :<></>
  )
}
