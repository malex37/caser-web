'use client'

import React, { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
  MDXEditor,
  MDXEditorMethods,
  headingsPlugin,
  linkPlugin,
  toolbarPlugin,
  tablePlugin,
  linkDialogPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  listsPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  InsertTable,
  CreateLink,
  BlockTypeSelect,
} from "@mdxeditor/editor";
import '@mdxeditor/editor/style.css';
import { PreviewFile } from "@models/app";

export interface MardownFileProps {
  file: PreviewFile
  editorReference?: React.MutableRefObject<MDXEditorMethods | null>;
  editLocked: boolean;
  children?: React.ReactNode;
  ref: any;
}
const ToolBar = () => (
  <>
    {' '}
    <UndoRedo />
    <BoldItalicUnderlineToggles />
    <BlockTypeSelect />
    <CreateLink />
    <InsertTable />
  </>
);
const MarkdownFile = forwardRef(function MarkdownFile({ file, editorReference, editLocked, children }: MardownFileProps, ref) {
  const [text, setText] = useState<string>('');
  const [edited, setEdited] = useState<boolean>(false);
  async function LoadMarkdownText(file: PreviewFile) {
    const markdownBuffer = await file.data.arrayBuffer();
    const markdownText = Buffer.from(markdownBuffer).toString();
    setText(markdownText)
  }
  useEffect(() => {
    LoadMarkdownText(file);
  }, []);
  useImperativeHandle(ref, () => {
    return {
      editedText() {
        return text;
      },
      wasEdited() {
        return edited;
      },
      info() {
        return {
          type: file.type,
          name: file.name,
        };
      }
    }
  });

  const setEditorText = (e: string) => {
    setText(e);
    setEdited(true);
  }

  return (
    <div className={`p-3 w-full flex flex-col gap-2`}>
      {children ? children : null}
      <div className={`${editLocked ? '' : 'border'} p-3`}>
        {
          text !== '' ?
            <MDXEditor
              contentEditableClassName="prose"
              onChange={(e) => setEditorText(e)}
              ref={editorReference}
              markdown={text}
              plugins={[
                headingsPlugin(),
                linkPlugin(),
                tablePlugin(),
                linkDialogPlugin(),
                listsPlugin(),
                codeBlockPlugin(),
                codeMirrorPlugin({ codeBlockLanguages: { bash: 'bash' } }),
                toolbarPlugin({
                  toolbarContents: () => ToolBar(),
                }),
              ]}
              readOnly={editLocked}
            /> : null
        }
      </div>
    </div>
  );
});
export default MarkdownFile;
