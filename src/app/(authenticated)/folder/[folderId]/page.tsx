import GetFolders from "@api/GetFolders";
import GetFolderContents from "@api/GetFolderContents";
import FolderFiles from "@components/molecules/FolderFiles";
import FolderView from "@components/views/Folder";
import FileUpload from "@components/molecules/FileUpload";

export default async function FolderPage({ params }: { params: { folderId: string } }) {
  const { folderId } = params;
  const getFolder = async (folderId: string) => {
    const folderGot = await GetFolders([folderId])
    if (!folderGot) {
      console.log('Folder not found :(');
    }
    console.log('Done fetching folders for view');
    return folderGot[0];
  }

  const getFolderContents = async (folderId: string) => {
    const folders = await GetFolderContents(folderId);
    return folders
  }

  const folder = await getFolder(folderId);
  const folderContents = await getFolderContents(folderId);

  return (
    <div className="flex flex-col p-3">
        <FolderView folder={folder} />
        <div className="divider"></div>
        <FileUpload destinationFolder={folderId} />
        <div className="divider"></div>
        <FolderFiles bucketContents={folderContents} folderId={folderId} />
    </div>
  );
};
