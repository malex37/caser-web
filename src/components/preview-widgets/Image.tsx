import { FileManager } from "@storage/FileManager";
import { useEffect, useRef, useState } from "react";

export default function ImagePreview({ file }: { file: File }) {
  const previewCanvas = useRef(null);
  const loadImage = async (file: File) => {
    console.log('[ImagePreview] Starting image loading');
    const nFile = await FileManager.getFile(file.name);
    if (!nFile) {
      console.log(`[ImagePreview] Failed to load cache image ${file.name}`);
      return;
    }
    console.log(`[ImagePreview] Rendering image for file ${file.name}`);
    if (!previewCanvas.current) {
      console.log('[ImagePreview] Canvas ref not defined');
      return;
    }
    const ctx = (previewCanvas.current as HTMLCanvasElement).getContext('2d');
    if (ctx) {
      console.log('[ImagePreview] Context obtained');
      const dataSrc = URL.createObjectURL(nFile);
      const imageData = new Image();
      imageData.src = dataSrc;
      imageData.onload = () => {
        console.log('[ImagePreview] Image data loaded, drawing');
        ctx.drawImage(imageData, -1000, -1000);
        ctx.scale(0.5, 0.5);
        URL.revokeObjectURL(dataSrc);
      }
    }
  }
  useEffect(() => {
    loadImage(file);
  }, []);

  return (
    <div id="image-preview" className="w-full h-auto">
      <canvas ref={previewCanvas} id="image-preview-canvas" className="w-full h-full" width={2048} height={2048}></canvas>
    </div>
  );
}
