'use client'
import { PreviewFile } from "@models/app";
import { ChangeEvent, HTMLAttributes, forwardRef, useEffect, useImperativeHandle, useState } from "react";
type ClassNameType = HTMLAttributes<HTMLDivElement>['className'] | undefined;
const TextFile = forwardRef(function TextFile({ file, className }: { file: PreviewFile, className?: ClassNameType }, ref) {
  const [textBody, setTextBody] = useState('');
  const [edited, setEdited] = useState(false);
  const textValue = async (obj: PreviewFile) => {
    const defaultValueBuffer = await obj.data.arrayBuffer();
    const stringValue = Buffer.from(defaultValueBuffer).toString();
    setTextBody(stringValue);
  }
  useEffect(() => {
    textValue(file);
  }, [])
  useImperativeHandle(ref, () => {
    return {
      editedText() {
        return textBody;
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
  const changeTextBody = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setEdited(true);
    setTextBody(e.currentTarget.value);
  }
  return (
    <div id='text-file-preview' className='w-full'>
      <textarea className="w-full" defaultValue={textBody} onChange={(e) => changeTextBody(e)}></textarea>
    </div>
  );
});

export default TextFile;
