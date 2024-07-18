'use client'
import { Folder } from "@models/DBSchemas/Folders";
import { v4 as uuid } from 'uuid';

export default function ListCard({ folder, action }: { folder: Folder, action?: (...any: any) => void }) {
  const logItem = (name: string) => {
    console.log(`Clicked: ${name}`);
  }
  const actionWrapper = (containerClickedName: string) => {
    console.log(`Action wrapper invoked from: ${containerClickedName}`);
    if (action) {
      console.log(`Action defined as ${action.name} and invoked with id: ${folder.id}`);
      action(folder.id);
    }
    console.log('Action prop is undefined, returning');
  }
  return (
    <div key={uuid()} className="border rounded border-carrot_orange p-2 hover:bg-amethyst-900">
      <div className="flex gap-4 items-center p-0" onClick={() => actionWrapper('DetailedContainer')}>
        <p className="w-1/4" onClick={() => logItem('FolderName')}>{folder.name}</p>
        <p className="w-1/4" onClick={() => logItem('FolderClient')}>{folder.client}</p>
        <p className="w-1/4" onClick={() => logItem('FolderCaseType')}>{folder.caseType}</p>
        <p className="w-1/4" onClick={() => logItem('FolderCounty')}>{folder.county}</p>
      </div>
    </div>
  );
}
