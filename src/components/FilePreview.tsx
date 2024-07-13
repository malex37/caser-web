'use client'

import { useEffect, useState } from "react";
// @ts-ignore next-line
import { PDFDocumentProxy } from "pdfjs-dist";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { FileManager } from "@storage/FileManager";

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).toString();

type PreviewFile = {
  name: string;
  type: string;
  data: File;
};
const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
  isOffscreenCanvasSupported: true
};

function PdfCanvas({ file }: { file: PreviewFile }) {
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const onLoadSuccess = ({ numPages: nextNumPages }: PDFDocumentProxy) => {
    setPageNumber(nextNumPages);
  }
  const changePage = (direction: 'left' | 'right') => {
    const destinationPage = currentPage + (direction === 'left' ? -1 : 1);
    if (destinationPage < 0 || destinationPage >= pageNumber) {
      return;
    }
    setCurrentPage(destinationPage);
  }
  return (
    <div id='pdf-preview-container'>
      <Document file={file.data} options={options} onLoadSuccess={onLoadSuccess}>
        <Page key={`page-${currentPage + 1}`} pageNumber={currentPage + 1} width={800} />
      </Document>
      <div className="flex items-center justify-center">
        <div className="join">
          <button className="join-item btn" onClick={() => changePage('left')}><ChevronLeftIcon className="h-10" /></button>
          <button className="join-item btn">{currentPage + 1}</button>
          <button className="join-item btn" onClick={() => changePage('right')}><ChevronRightIcon className="h-10" /></button>
        </div>
      </div>
    </div>
  );
}
export default function FilePreview({ fileKey }: { fileKey: string }): JSX.Element {
  const [fileData, setFileData] = useState({} as PreviewFile);
  // create document
  const GetFileFromDB = async (fileKey: string) => {
    console.log(`[FilePreview] Getting file from storage ${fileKey}`);
    try {
      if (fileData.name === fileKey) {
        console.log(`[FilePreview] fileData.name matches fileKey, skipping loading`);
        return;
      }
      const file = await FileManager.getFile(fileKey);
      if (!file) {
        console.error(`No file with name ${fileKey} present!`);
        throw new Error('Invalid name');
      }
      console.log(`[FilePreview] File ${fileKey} loaded`)
      setFileData({
        name: fileKey,
        data: file,
        type: file.type,
      })
      //   const file = await FilesDB.files.get(fileKey);
      //   if (!file || !file.data) {
      //     // TODO: Call canvas factory and render/show an error message
      //     throw new Error('Invalid file key');
      //   }
      //   setFileData({
      //     ...file,
      //     data: file.data,
      //   });
      //   if (file.type === '.pdf') {
      //     const buff = file.data;
      //     console.log(`IndexedDB file entry data ${buff}`);
      //     const loadedFile = await getDocument({
      //       data: atob(file.data),
      //     }).promise;
      //     setPdfFile(atob(file.data));
      //     await loadedFile.destroy()
      //   }
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    GetFileFromDB(fileKey)
  }, []);

  function RenderComponentFactory(file: PreviewFile) {
    console.log(`[FilePreview] Rendering file of type ${file.type}`);
    // // GetFileFromDB(fileKey);
    // console.log(`Rendering file with key ${file.name} and type ${file.name}`);
    // // Use text area
    // if (file.type === '.txt') {
    //   const textBuffer = await file.data.arrayBuffer();
    //   const text = new TextDecoder().decode(textBuffer);
    //   return (
    //     <textarea
    //       className='textarea w-full'
    //       contentEditable={false}
    //       defaultValue={text} />);
    // }
    // if (pdfFile && file.type === '.pdf') {
    if (file.data) {
      console.log(`[FilePreview] rendering pdf with name ${file.name}`);
      return <PdfCanvas file={file} />;
    }
    // }
    return <></>;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div id="preview-container">
        {
          RenderComponentFactory(fileData)
        }
      </div>
    </div>
  )
}
