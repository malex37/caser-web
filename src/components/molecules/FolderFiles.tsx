'use client'
import { v4 as uuid } from 'uuid';
import { ReshapedFolder } from '@api/GetFolderContents';
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from 'react';
import GetFolderFile from '@api/GetFolderFile';
import { FolderFile } from '@models/api/FolderFile';
import FilePreview from '@components/FilePreview';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { FileManager } from '@storage/FileManager';
import { GlobalEmitter } from '@source/EventEmitter';

type ReferenceObj = {
  name: string;
  reference: MutableRefObject<any>;
  state: boolean;
  setState: Dispatch<SetStateAction<boolean>>;
}

type ReferenceMap = {
  [name: string]: ReferenceObj,
};

export default function FolderFiles({ bucketContents, folderId }: { bucketContents: ReshapedFolder[], folderId: string }) {
  const [checkboRefs, setCheckboRefs] = useState({} as ReferenceMap);
  const [previewFileKey, setPreviewFileKey] = useState('');
  const checkEventName = 'set-check';
  const [folderFiles, setFolderFiles] = useState<ReshapedFolder[]>(bucketContents);
  const [previewStatus, setPreviewStatus] = useState<'visible'|'invisible'>('invisible');
  const [allChecked, setAllChecked] = useState(false);

  const updateFileList = async (event: CustomEvent<ReshapedFolder>) => {
    console.log(`Received event with data ${JSON.stringify(event.detail)}`)
    setFolderFiles([...folderFiles, event.detail]);
  };
  useEffect(() => {
    //set events once component is rendered
    Object.values(checkboRefs).map((reference: ReferenceObj) => {
      if (!reference.reference.current) {
        return;
      }
      // @ts-ignore next-line
      reference.reference.current.addEventListener(checkEventName, (event) => {
        const data = (event as CustomEvent<{ isChecked: boolean }>);
        console.log(`Event ${checkEventName} received, changing ${reference.name} checkbox state from ${reference.state} to ${data.detail.isChecked}`);
        reference.setState(data.detail.isChecked);
        console.log(`handled reference with name ${reference.name} and state ${reference.state}`);
        setCheckboRefs({ ...checkboRefs });
      });
      GlobalEmitter.subscribe('FileUploaded', 'updateFileViewFileList', updateFileList);
    });
    // set a key in context for the folder
  }, []);

  const toggleAllCheckboxes = (value: boolean) => {
    console.log(`Toggling all boxes to ${value}`)
    console.log(`Checking all boxes`);
    Object.values(checkboRefs).map(obj => {
      if (!obj.reference.current) {
        console.log(`No current for reference with name ${obj.name}`);
        return;
      }
      console.log(`Checking ref ${obj.name}`);
      obj.reference.current.dispatchEvent(new CustomEvent<{ isChecked: boolean }>(checkEventName, { detail: { isChecked: value } }));
      console.log(`Is reference still present: ${!!obj.reference}`)
      setAllChecked(value);
    });
  }
  const previewVisibility = (newVis: typeof previewStatus) => {
    setPreviewStatus(newVis);
  }
  const getObject = async (objectKey: string, id: string, name: string) => {
    setPreviewFileKey('');
    if (previewFileKey === objectKey) {
      console.log('File already rendered, ignoring request');
      return;
    }
    // check if file is in cache
    const cacheFile = await FileManager.getFile(name);
    if (cacheFile) {
      console.log('[FolderFiles] Found file in cache');
      if (previewStatus === 'invisible') {
        setPreviewStatus('visible');
      }
      setPreviewFileKey(name);
      return;
    }
    const file: FolderFile = await GetFolderFile(objectKey, id);
    if (!file || !file.data) {
      throw new Error('Invalid file');
    }
    await FileManager.writeFile(file.name, Uint8Array.from(atob(file.data), c => c.charCodeAt(0)));
    console.log(`Setting state file key to ${file.name}`);
    setPreviewFileKey(file.name);
    setPreviewStatus('visible')
  };

  const buildFileFromReshape = (file: ReshapedFolder) => {
    const fileType = file.name.substring(file.name.lastIndexOf('.'));
    const checkboxName = file.name.replaceAll('.', '-');
    const [state, setState] = useState(false);
    const ref = useRef(null);
    checkboRefs[checkboxName] = {
      name: checkboxName,
      reference: ref,
      state: state,
      setState: setState,
    };
    const el = (
      <tr key={uuid()}>
        <td>
          <label>
            <input
              type="checkbox"
              ref={checkboRefs[checkboxName].reference}
              name={checkboxName}
              className="checkbox-accent"
              checked={checkboRefs[checkboxName].state}
              onChange={() => checkboRefs[checkboxName].setState(!state)}
            />
          </label>
        </td>
        <td>
          {file.name}
        </td>
        <td>{fileType}</td>
        <td>{file.lastModified.toDateString()}</td>
        <td onClick={() => getObject(file.bucketKey, file.uuid, file.name)} ><MagnifyingGlassIcon className='h-10 w-10' /></td>
      </tr>
    );
    return el;
  }
  return (
    <div className="overflow-auto flex flex-row flex-nowrap">
      <div className='w-full'>
        <table className="table">
          <thead>
            <tr>
              <th>
                <label>
                  <input
                    type="checkbox"
                    name="all-checkboxes"
                    checked={allChecked}
                    className="checkbox-accent"
                    onChange={() => toggleAllCheckboxes(!allChecked)} />
                </label>
              </th>
              <th>File name</th>
              <th>File type</th>
              <th>Date uploaded</th>
            </tr>
          </thead>
          <tbody id="files-table-body">
            {
              folderFiles.length !== 0 ? bucketContents.map((file: ReshapedFolder) => {
                return buildFileFromReshape(file)
              }) : null
            }
          </tbody>
        </table>
      </div>
      <div className='divider-vertical'></div>
        {
          <FilePreview currentFolder={folderId} fileKey={previewFileKey} visibility={previewStatus} visControl={previewVisibility}/>
        }
    </div>
  );
}
