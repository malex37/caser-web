'use client'
import { FileManager } from "@storage/FileManager";
import { useEffect, useState, DragEvent, useCallback, useRef } from "react";

interface Point {
  x: number;
  y: number;
}

interface ViewPort {
  x: number;
  y: number;
  scale: number;
}

function log(message: string) {
  console.log(`[ImagePreview] ${message}`);
}

function error(message: string) {
  console.error(`[ImagePreview] ${message}`);
}

const viewportTransform: ViewPort = {
  x: 0,
  y: 0,
  scale: 1,
};

const viewport: Point = {
  x: 0,
  y: 0,
};

const realPosition: Point = {
  x: 0,
  y: 0
};
// Based a lot on
// https://harrisonmilbradt.com/articles/canvas-panning-and-zooming
const previousCoords: Point = { x: 0, y: 0 };
export default function ImagePreview({ file }: { file: File }) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const canvasComponent = useRef<HTMLCanvasElement>(null);
  const imageHolder = useRef<HTMLImageElement>(null);
  const loadImage = async (file: File) => {
    log('Starting image loading');
    const nFile = await FileManager.getFile(file.name);
    if (!nFile) {
      log(`Failed to load cache image ${file.name}`);
      return;
    }
    console.log(`[ImagePreview] Rendering image for file ${file.name}`);
    const blb = URL.createObjectURL(nFile);
    setBlobUrl(blb);
  }

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
    canvas.onmousemove = (e) => { panImage() };
  };

  const getCanvas = useCallback((): { context: CanvasRenderingContext2D, canvas: HTMLCanvasElement } => {
    if (!canvasComponent.current) {
      error('No current canvas component');
      throw new Error();
    }
    const context = (canvasComponent.current as HTMLCanvasElement).getContext('2d');
    if (!context) {
      error('Failed to load canvas context');
      throw new Error('Undefined canvas context');
    }
    return { context, canvas: (canvasComponent.current as HTMLCanvasElement) };
  }, []);

  const drawCrosshair = (
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    xl: number,
    yl: number,
    color: 'red' | 'blue' = 'red'
  ) => {
    //const dx = xl / 2;
    const dx = x;
    const dy = y;
    // log(`Crosshair is at (${dx}, ${dy})`);
    // log(`Crosshair lengths: x ${xl}, y ${yl}`);
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(dx, yl);
    context.closePath();
    context.stroke();
    // draw x line
    context.beginPath();
    context.moveTo(0, dy);
    context.lineTo(xl, dy);
    context.closePath();
    context.stroke();
  }

  const markCenter = (context: CanvasRenderingContext2D, w: number, h: number) => {
    drawCrosshair(context, w / 2, h / 2, w, h, 'blue');
  }

  const drawOnCanvas = () => {
    if (!canvasComponent.current) {
      log('No canvas to render on, returning');
      return;
    }
    const canvas = (canvasComponent.current as HTMLCanvasElement);
    const context = canvas.getContext('2d');
    if (!context) {
      error('Canvas ref did not generate a context');
      return;
    }
    if (!imageHolder.current) {
      error('Image holder is not loaded');
      return;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    // This says the difference/movement in coordinates
    log(`Previous (${JSON.stringify(previousCoords)}) real (${JSON.stringify(realPosition)})`);
    const xmove = previousCoords.x - realPosition.x;
    const ymove = previousCoords.y - realPosition.y;
    log(`Move delta (${xmove}, ${ymove})`);
    viewport.x += xmove;
    viewport.y += ymove;
    log(`Target srcOrigin (${viewport.x}, ${viewport.y})`);
    context.drawImage(imageHolder.current, viewport.x, viewport.y, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    drawCrosshair(context, realPosition.x, realPosition.y, canvas.width, canvas.height);
    markCenter(context, canvas.width, canvas.height);
  };

  const mouseDown = (e: any) => {
    const { canvas } = getCanvas();
    canvas.addEventListener("mousemove", mouseMove);
  };

  const mouseUp = () => {
    const { canvas } = getCanvas();
    canvas.removeEventListener("mousemove", mouseMove);
  }

  // Needs to be callbacked so it remains across re-renders and removelistener cand identify
  // when looking through the attached listeners
  const mouseMove = useCallback((e: any) => {
    if (e.currentTarget) {
      const { left, top } = e.currentTarget.getBoundingClientRect();
      realPosition.x = e.clientX - left;
      realPosition.y = e.clientY - top;
      if (previousCoords.x === 0 && previousCoords.y === 0) {
        previousCoords.x = realPosition.x;
        previousCoords.y = realPosition.y;
      }
      drawOnCanvas();
      previousCoords.x = e.clientX - left;
      previousCoords.y = e.clientY - top;
    }
  }, []);

  useEffect(() => {
    loadImage(file);
  }, [file]);

  return (
    <div id="image-preview" className="w-full h-auto">
      {
        <canvas
          id="image-canvas"
          ref={canvasComponent}
          className="w-full h-full"
          onMouseDown={mouseDown}
          onMouseUp={mouseUp}
          onMouseLeave={mouseUp}
        ></canvas>
      }
      <img
        ref={imageHolder}
        src={blobUrl || ''}
        onLoad={() => drawOnCanvas()}
        className="invisible"
      />
    </div>
  );
}
