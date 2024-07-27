'use client'
import UploadFile from "@api/UploadFile";
import { ShowToast } from "@components/molecules/ToastMessageHandler";
import { DocumentArrowUpIcon } from "@heroicons/react/24/outline";

export default function FileUpload({destinationFolder}: { destinationFolder: string }) {

  const fetchInputElement = () => {
    const el = document.getElementById("inputFile") as HTMLInputElement;
    if (!el) {
      throw new Error('Input element is not defined?!');
    }
    return el;
  }
  const openFileUpload = async () => {
    const inputElem = fetchInputElement();
    inputElem.click();
  }

  const handleUploadFile = async () => {
    const inputElem = document.getElementById("inputFile") as HTMLInputElement;
    if (!inputElem || !inputElem.files || !inputElem.files[0]) {
      ShowToast({type: 'error', message: 'Upload failed'});
      return;
    }
    const file = inputElem.files[0];
    console.log(`File uploaded: ${inputElem.files ? inputElem.files[0].name : 'none'}`);
    const fileData = Buffer.from(await file.arrayBuffer()).toString();
    let uploadStatus = await UploadFile(destinationFolder, file.name, fileData, file.type, file.lastModified);
    if (!uploadStatus) {
      fetchInputElement().files = null;
      ShowToast({ type: 'error', message: 'File upload failed :('});
      return;
    }
    (uploadStatus.lastModified as unknown as Date)= new Date(uploadStatus.lastModified)
    // clear element files to avoid rendering to fetch an unknown virtual path
    fetchInputElement().files = null;
    ShowToast({type: 'success', message: 'File uploaded'})
  }
  return (
    <div className="flex flex-row items-center gap-3">
      <div className="text-2xl">Files</div>
      <input type="file" id="inputFile" className="invisible w-0" onChange={handleUploadFile} />
      <div className="h-full w-auto rounded-box hover:cursor-pointer" onClick={openFileUpload}><DocumentArrowUpIcon className="h-8 w-auto" /></div>
    </div>
  );
}
