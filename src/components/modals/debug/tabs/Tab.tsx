export default function Tab({ children, title, defaultCheck=false}: { children?: React.ReactNode, title: string, defaultCheck?: boolean}) {
  const condencedId = title.toLowerCase().replaceAll(' ', '-');
  return (
    <>
      <input type="radio" name={condencedId} key={condencedId} role="tab" className="tab" aria-label={title} defaultChecked={defaultCheck}/>
      <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
        {children}
      </div>
    </>
  );
}
