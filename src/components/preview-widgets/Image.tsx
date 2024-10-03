'use client'
import { FileManager } from "@storage/FileManager";
import { useEffect, useState, DragEvent, useCallback, useRef, MouseEvent as ME } from "react";

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
    log(`Crosshair [${color}] is at (${dx}, ${dy})`);
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
    context.drawImage(imageHolder.current, viewport.x, viewport.y, canvas.width, canvas.height, xmove, ymove, canvas.width, canvas.height);
    drawCrosshair(context, realPosition.x, realPosition.y, canvas.width, canvas.height);
    markCenter(context, canvas.width, canvas.height);
  };

  const mouseDown = (event: ME<HTMLCanvasElement, MouseEvent>) => {
    log('Mouse down');
    const { canvas } = getCanvas();
    if (!canvasComponent.current) {
      log('No canvas to attach event');
      return;
    }
    canvasComponent.current.addEventListener("mousemove", (e) => mouseMove(event));
  };

  const mouseUp = (event: ME<HTMLCanvasElement, MouseEvent>) => {
    const { canvas } = getCanvas();
    log('Mouse up');
    canvas.removeEventListener("mousemove", () => mouseMove(event));
  }

  // Needs to be callbacked so it remains across re-renders and removelistener cand identify
  // when looking through the attached listeners
  const mouseMove = useCallback((e: ME<HTMLCanvasElement, MouseEvent>) => {
    log('Mouse move');
    if (e.currentTarget) {
      log(`Move triggered on ${e.currentTarget.id}`);
      realPosition.x = e.nativeEvent.offsetX;
      realPosition.y = e.nativeEvent.offsetY;
      drawOnCanvas();
      previousCoords.x = realPosition.x;
      previousCoords.y = realPosition.y;
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
          onMouseDown={(e) => mouseDown(e)}
          onMouseUp={(e) => mouseUp(e)}
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
