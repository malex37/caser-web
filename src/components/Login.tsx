'use client'
import { Authenticate } from "@/api/Authenticate";
import { useFormState, useFormStatus } from "react-dom";

function LoginButton() {
  const { pending } = useFormStatus();
  const handleSubmit = (event: any) => {
    if (pending) {
      event.preventDefault();
    }
  }
  return (
    <button type="submit" aria-disabled={pending} onClick={handleSubmit} className="border p-3">Log In</button>
  );
}

export default function Login() {
  const [result, dispatch] = useFormState(Authenticate, undefined);
  return (
    <div className="w-1/3 h-1/2">
      <form action={dispatch} className="w-4/6 flex flex-col gap-3 items-center border rounded border-blue-500 p-3">
        <label>Login</label>
        <input name="username" className="border rouned border-gray-4 p-2" type="text" placeholder="Username" required />
        <input name="password" className="border rouned border-gray-4 p-2" type="password" required />
        <div>{result ? <p>{result}</p> : <></>}</div>
        <LoginButton />
      </form>
    </div>
  );
}
