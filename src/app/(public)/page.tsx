'use client'

export default function Page() {

  return (
    <div className="h-full w-full m-3 flex flex-col items-center justify-center">
      <div>
        Hello and welcome!
      </div>
      <button onClick={() => window.location.assign('/login')} className="w-1/6 p-3 text-2xl border rounded border-blue-300 items-center justify-center"><p>Login</p></button>
    </div>);
}
