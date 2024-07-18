'use client'
import { PreviewFile } from "@models/app";
import { HTMLAttributes, useEffect, useState } from "react";
type ClassNameType = HTMLAttributes<HTMLDivElement>['className'] | undefined;
export default function TextFile({ file, className }: { file: PreviewFile, className?: ClassNameType }) {
  const [textBody, setTextBody] = useState('');
  const textValue = async (obj: PreviewFile) => {
    const defaultValueBuffer = await obj.data.arrayBuffer();
    const stringValue = Buffer.from(defaultValueBuffer).toString();
    setTextBody(stringValue);
  }
  useEffect(() => {
    textValue(file);
  }, [])
  return (
    <div id='text-file-preview' className='w-full'>
      <textarea className="w-full" defaultValue={textBody}></textarea>
    </div>
  );
}
