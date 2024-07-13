// 'use client'
// import { FolderFile } from "@models/api/FolderFile";
// import { createContext } from "react";
//
// export const FolderContextActions = {
//   AddFile: 'AddFile',
// } as const;
//
// export type FolderContextActionType = {
//   [FolderContextActions.AddFile]: { folderKey: string, files: [FolderFile] }
// }
//
// export interface FolderFilesContextInterface {
//   [folderKey: string]: {
//     [fileKey: string]: FolderFile
//   },
//   dispatch?: any,
// };
//
// export const FolderFilesContextInitialState: FolderFilesContextInterface = {};
//
// export type payload<T extends keyof typeof FolderContextActions, N extends FolderContextActionType[T]> = {
//   name: T,
//   data: N,
// }
//
// function addFile(context: FolderFilesContextInterface, files: FolderContextActionType["AddFile"]) {
//   const resultingState: FolderFilesContextInterface = {
//     ...context,
//   };
//
//   files.files.map(file => {
//     console.log(`Adding file through dispatch ${JSON.stringify(file)}`);
//     resultingState[files.folderKey] = {
//       [file.key]: file,
//     }
//   });
//   return resultingState;
// }
//
// export function dispatchAction<T extends keyof typeof FolderContextActions, N extends FolderContextActionType[T]>(context: any, action: { type: T, data: N }) {
//   switch (action.type) {
//     case 'AddFile':
//       return addFile(context, action.data)
//     default:
//       throw Error('Invalid action');
//   }
// }
//
// export const FolderFilesContext = createContext({} as FolderFilesContextInterface);
//
// export const FolderFilesContextDispatch = createContext(null);
