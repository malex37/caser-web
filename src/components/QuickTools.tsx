'use client'
import NewTask from "../app/(authenticated)/@modal/(...)dashboard/page";

export default function QuickTools() {
  // TODO: change this to be a parallel route from NextJs
  const openPopup = () => {
    // @ts-ignore next-line
    document.getElementById('create-form').showModal();
  }
  return (
    <div>
      <button onClick={openPopup} className="btn btn-primary">New Task</button>
      <NewTask />
    </div>
  );
}
