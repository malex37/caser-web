'use client'
import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";

export interface ComposableFormProps {
  action: (_currentState: unknown, formData: FormData) => void;
  onError?: any;
  onSuccess?: any | 'dismiss';
  children: React.ReactNode;
  submitButtonText: string;
  modalId: string;
}

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  const handleSumbit = async (event: any) => {
    if (pending) {
      event.preventDefault();
    }
  }
  return <button type="submit" aria-disabled={pending} onClick={handleSumbit} className="btn">{text}</button>
}

export default function ComposableForm(props: ComposableFormProps): JSX.Element {
  const [result, dispatch] = useFormState(props.action, undefined);
  useEffect(() => {
    if (result) {
      const form = document.getElementById('composable-form');
      if (form) {
        const inputs = form.getElementsByTagName('input');
        for (let i = 0; i < inputs.length; ++i) {
          const item = inputs.item(i)
          if (item) {
            item.value = '';
          }
        }
      }
      if (props.onSuccess === 'dismiss') {
        //@ts-ignore next-line
        document.getElementById(props.modalId).close();
      }
    }
  }, [result] || '');
  return (
    <form id="composable-form" action={dispatch} className="flex flex-col gap-3">
      {props.children}
      <SubmitButton text={props.submitButtonText} />
    </form>
  );
}
