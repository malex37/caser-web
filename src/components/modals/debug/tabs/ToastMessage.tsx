'use client'
import { ShowToast } from "@components/molecules/ToastMessageHandler";
import Tab from "./Tab";
import { ChangeEvent, useState } from "react";
import { ToastMessageType } from "@models/app/ToastMessageEventPayload";

export default function ToastMessage() {
  const [toastType, setToastType] = useState<keyof typeof ToastMessageType>('info');

  const [message, setMessage] = useState('');
  const showMessage = () => {
    ShowToast({ type: toastType, message: message });
  }
  const setMessageState = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.currentTarget.value);
  }
  return (
    <>
      <input type="radio" name="toast-message" role="tab" className="tab" aria-label="Toasts" />
      <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
        <div className="flex flex-col gap-3">
          <input type="text" className="input border border-amethyst" onChange={(e) => setMessageState(e)} />
          <label htmlFor="type-success">Success</label>
          <input id="type-success" name="type-radio" type="radio" onChange={() => setToastType('success')} />
          <label htmlFor="type-info">Info</label>
          <input id="type-info" name="type-radio" type="radio" onChange={() => setToastType('info')} />
          <label htmlFor="type-warning">Warning</label>
          <input id="type-warning" name="type-radio" type="radio" onChange={() => setToastType('warning')} />
          <label htmlFor="type-error">Error</label>
          <input id="type-error" name="type-radio" type="radio" onChange={() => setToastType('error')} />
          <button onClick={showMessage} className="btn btn-primary w-1/2 mt-3">Dispatch</button>
        </div>
      </div>
    </>
  );
}
