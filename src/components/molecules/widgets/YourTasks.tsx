const debugBorderStyle = process.env.NODE_ENV === 'production' ? '' : 'border';
export default function YourTasks() {
  return (
    <div className={`w-full ${debugBorderStyle}`}>
      Widgets
    </div>
  );
}
