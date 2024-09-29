'use client'
import { FileManager } from "@storage/FileManager";
import { useEffect, useState, DragEvent } from "react";

export default function ImagePreview({ file }: { file: File }) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const img = new Image;

  const loadImage = async (file: File) => {
    console.log('[ImagePreview] Starting image loading');
    const nFile = await FileManager.getFile(file.name);
    if (!nFile) {
      console.log(`[ImagePreview] Failed to load cache image ${file.name}`);
      return;
    }
    console.log(`[ImagePreview] Rendering image for file ${file.name}`);
    const blb = URL.createObjectURL(nFile);
    setBlobUrl(blb);
    img.src = blb;
    setCanvasData();
  }

  const getCanvas = (): { context: CanvasRenderingContext2D, canvas: HTMLCanvasElement } => {
      const canvas = document.getElementById("image-canvas") as HTMLCanvasElement;
      if (!canvas) {
        console.error('Failed to load canvas');
        throw new Error('Undefined canvas element');
      }
      const context = canvas.getContext('2d');
      if (!context) {
        console.error('Failed to load canvas context');
        throw new Error('Undefined canvas context');
      }
      return { context, canvas };
  }

  const setCanvasData = () => {
    console.log('[ImagePreview] Setting canvas data');
    img.onload = () => {
      console.log('Loading image');
      const { context, canvas } = getCanvas();
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawOnCanvas(context, 0, 0);
    }
  };

  const panImage = () => {
    const { context } = getCanvas();
    context.translate(100, 0);
    console.log('Translating');
  }

  const dragStart = (event: DragEvent<HTMLCanvasElement>) => {
    console.log(`Drag started at x ${event.pageX}, y ${event.pageY}`);
    const { canvas, context } = getCanvas();
    context.setTransform(1, 0, 0, 1, 0, 0);
    canvas.style.cursor = 'grab';
    var ghost = new Image();
    ghost.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
    event.dataTransfer.setDragImage(ghost, 0, 0);
    canvas.onmousemove = (e) => { panImage()};
  };

  const drawOnCanvas = (context: CanvasRenderingContext2D, dx = 0, dy = 0, xw?: number, yw?: number) => {
    if (!xw || !yw) {
      context.drawImage(img, dx, dy);
      return;
    }
    context.drawImage(img, dx, dy, xw, yw);
  }

  const dragEnd = (event: DragEvent<HTMLCanvasElement>) => {
    const { canvas } = getCanvas();
    canvas.style.cursor = 'auto';
    canvas.onmousemove = null;
    console.log(`Drag ended in x ${event.pageX} and y ${event.pageY}`)
  }

  useEffect(() => {
    loadImage(file);
  }, [file]);

  return (
    <div id="image-preview" className="w-full h-auto">
      {
        blobUrl ?
          <canvas
            id="image-canvas"
            width={1000}
            height={1000}
            onLoad={setCanvasData}
            draggable={true}
            onDragStart={(e) => dragStart(e)}
            onDragEnd={(e) => dragEnd(e)}
          ></canvas>
          : null
      }
    </div>
  );
}
