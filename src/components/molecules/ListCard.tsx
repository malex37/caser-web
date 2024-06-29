import { Folder } from "@models/DBSchemas/Folders";
import { v4 as uuid } from 'uuid';

export default function ListCard({ folder }: { folder: Folder }) {
  return (
    <div key={uuid()} className="border rounded border-carrot_orange p-2 hover:bg-amethyst-900">
      <div className="flex gap-4 items-center p-0">
        <p className="w-1/4">{folder.name}</p>
        <p className="w-1/4">{folder.client}</p>
        <p className="w-1/4">{folder.caseType}</p>
        <p className="w-1/4">{folder.county}</p>
      </div>
    </div>
  );
}
