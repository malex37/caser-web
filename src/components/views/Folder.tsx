import { Folder } from "@models/DBSchemas/Folders";

export default function FolderView({ folder }: { folder: Folder }) {
  const folderDetail = (field: string, text: string) => {
    return <div className="join-item flex items-center gap-2"><p className="font-bold">{field}:</p><p>{text}</p></div>;
  }
  return (
    <>
      {folder ?
        <>
          <div id="folder-name" className="text-3xl">{folder.name}</div>
          <div className="join gap-2 mt-3">
            <div className="join-item w-0.5 bg-accent"></div>
            {folderDetail("County", folder.county)}
            <div className="join-item w-0.5 bg-accent"></div>
            {folderDetail("Assigned judge", folder.judge)}
            <div className="join-item w-0.5 bg-accent"></div>
            {folderDetail("Client", folder.client)}
            <div className="join-item w-0.5 bg-accent"></div>
            {folderDetail("Case origin", folder.caseType)}
            <div className="join-item w-0.5 bg-accent"></div>
            {
              process.env.NODE_ENV !== 'production' ?
                folderDetail("Folder id", folder.id)
                : null
            }
          </div>
        </> : null
      }
    </>
  );
}
