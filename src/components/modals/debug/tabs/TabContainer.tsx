export default function TabContainer({ children }: { children?: React.ReactNode }) {
  return (
    <div role="tablist" className="tabs tabs-lifted">
      {children}
    </div>
  );
}
