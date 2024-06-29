const debugBorderStyle = process.env.NODE_ENV === 'production' ? '' : '';
export default function ScrollArea({ children }: { children?: React.ReactNode }) {
  return (
    <div className={`h-full w-full flex flex-col columns-1 ${debugBorderStyle} gap-3 p-3`}>
      {children}
    </div>
  );
}
