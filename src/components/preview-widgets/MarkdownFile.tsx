'use client'

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
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
const MarkdownFile = forwardRef(function MarkdownFile({ file, editLocked, children }: MardownFileProps, ref) {
  const [text, setText] = useState<string>('');
  const [edited, setEdited] = useState<boolean>(false);
  const localEditorReference = useRef<MDXEditorMethods>(null);
  async function LoadMarkdownText(file: File) {
    const markdownBuffer = await file.arrayBuffer();
    const markdownText = Buffer.from(markdownBuffer).toString();
    console.log(`[MardownFile] Text to render is ${markdownText}`);
    setText(markdownText);
    SetMarkdownByRef(markdownText);
  }
  const SetMarkdownByRef = (text = '') => {
    localEditorReference.current?.setMarkdown(text);
  };
  useEffect(() => {
    console.log(`[Markdown preview] Loading file with name ${file.name}`);
    LoadMarkdownText(file.data);
  }, [file]);
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
      },
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
        <MDXEditor
          contentEditableClassName="prose"
          onChange={(e) => setEditorText(e)}
          ref={localEditorReference}
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
        />
      </div>
    </div>
  );
});
export default MarkdownFile;
