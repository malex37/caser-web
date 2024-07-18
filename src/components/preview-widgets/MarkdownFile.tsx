'use client'

import React, { useEffect, useState } from "react";
import { MDXEditor, MDXEditorMethods, headingsPlugin, linkPlugin } from "@mdxeditor/editor";
import { PreviewFile } from "@models/app";

export interface MardownFileProps {
  file: PreviewFile
  editorReference?: React.MutableRefObject<MDXEditorMethods | null>;
}

export default function MarkdownFile({ file, editorReference }: MardownFileProps) {
  const [text, setText] = useState<string>('');
  const [locked, setLocked] = useState<boolean>(true);
  async function LoadMarkdownText(file: PreviewFile) {
    const markdownBuffer = await file.data.arrayBuffer();
    const markdownText = Buffer.from(markdownBuffer).toString();
    setText(markdownText)
  }
  useEffect(() => {
    LoadMarkdownText(file);
  }, []);
  const toggleEdit = (e: any) => {
    e.preventDefault();
    console.log(`Enabling edit for editor. Previous value ${locked}`);
    setLocked(!locked);
  }
  return (
    <div className={`p-3 w-full flex flex-col gap-2`}>
      <div className="items-center w-full">
        <button className="btn btn-accent w-1/5" onClick={(e) => toggleEdit(e)}>{locked ? 'Edit' : 'Done'}</button>
      </div>
      <div className={`${locked ? '' : 'border'}`}>
        {
          text !== '' ?
            <MDXEditor
              onChange={(e) => console.log(e)}
              ref={editorReference}
              markdown={text}
              plugins={[headingsPlugin(), linkPlugin()]}
              readOnly={locked}
            /> : null
        }
      </div>
    </div>
  );
}
