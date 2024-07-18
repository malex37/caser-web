export default function Tab({ children, title }: { children?: React.ReactNode, title: string }) {
  return (
    <>
      <input type="radio" name={title.toLowerCase().replaceAll(' ', '-')} role="tab" className="tab" aria-label={title} />
      <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
        {children}
      </div>
    </>
  );
}
