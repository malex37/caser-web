'use client'
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { KeyIcon } from "@heroicons/react/24/solid";
import { SessionControl } from "@middleware/session";

function LoginButton() {
  const { pending } = useFormStatus();
  const handleSubmit = async (event: any) => {
    if (pending) {
      event.preventDefault();
    }
  }
  return (
    <button type="submit" aria-disabled={pending} onClick={handleSubmit} className="btn btn-primary text-xl">Log In</button>
  );
}

export default function Login() {
  const [result, dispatch] = useFormState(SessionControl, undefined);
  let [showPswd, setShowPswd] = useState(false);
  useEffect(() => {
    if (result && result !== 'DENIED') {
      redirect('/dashboard');
    }
  }, [result] || '')

  return (
    <div className="w-5/12 flex justify-center flex-col border rounded border-moonstone shadow-xl" >
      <div className="flex justify-center p-3"><p className="text-xl">Login</p></div>
      <form action={dispatch} className="w-full flex flex-col gap-3 items-center p-3">
        <label className="input input-bordered flex items-center gap-3 w-3/4 mb-2">
          <input type="text" className="w-full" name="username" required />
        </label>
        <label className="input input-bordered flex items-center gap-3 w-3/4 mb-1">
          <KeyIcon className="h-6" />
          <input className="w-full" type={showPswd ? 'text' : 'password'} name="password" required />
        </label>
        <p onClick={() => setShowPswd(!showPswd)}>Show password</p>
        <div>{result ? <p className={`${result === 'APPROVED' ? 'bg-green-300' : 'bg-red-300'}`} >{result}</p> : <></>}</div>
        <LoginButton />
      </form>
    </div>
  );
}




