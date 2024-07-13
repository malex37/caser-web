'use client'

import { CheckIcon } from "@heroicons/react/24/outline";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { NoSymbolIcon } from "@heroicons/react/24/outline";
// import { GlobalEmitter } from "@source/EventEmitter";
import { useEffect, useState } from "react";

export type ToastTypeInterface = {
  info: 'info',
  success: 'success',
  error: 'error',
  warning: 'warning'
}

export type ToastType = keyof ToastTypeInterface;

export interface ToastProps {
  message: string,
  type: ToastType,
}

export const ToastEventName = 'show-toast';

export function ShowToast({ type, message }: ToastProps) {
  const event = new CustomEvent<ToastProps>(ToastEventName, { detail: { type: type, message: message } });
  console.log(`Dispatichon ${ToastEventName} with data ${type}, ${message}`)
  const toast = document.getElementById('toast-message');
  if (!toast) {
    return;
  }
  toast.dispatchEvent(event);
  // GlobalEmitter.emit('ToastMessage', { detail: { type: type, message: message } });
};

function chooseIcon(notificationType: ToastType) {
  // Make icon be square
  const iconClassName = 'h-full w-auto min-h-5';
  switch (notificationType) {
    case 'info':
      return <ExclamationCircleIcon className={iconClassName} />;
    case 'error':
      return <NoSymbolIcon className={iconClassName} />;
    case 'warning':
      return <ExclamationTriangleIcon className={iconClassName} />;
    case 'success':
    default:
      return <CheckIcon className={iconClassName} />;
  }
}

export default function ToastMessage() {

  const [toastMessage, setMessage] = useState(undefined || '');
  const [toastType, setToastType] = useState('success' as ToastType);
  const [visible, setVisible] = useState('invisible');
  const [animation, setAnimation] = useState('animate-fadeInto')

  const dismiss = () => {
    setVisible('invisible');
    setAnimation('animate-fadeOut')
    console.log(`Dismissing toast`);
  }

  const toastCallback = (evt: Event) => {
    const message = (evt as CustomEvent<ToastProps>).detail.message;
    const toast_type = (evt as CustomEvent<ToastProps>).detail.type
    console.log(`Handling ${ToastEventName} with data ${toast_type} ${message}`);
    setMessage(message);
    setToastType(toast_type);
    setVisible('visible')
    setTimeout(() => dismiss(), 4000);
  }
  useEffect(() => {
    // setup event listener on mount
    const toastElement = document.getElementById('toast-message');
    if (!toastElement) {
      console.warn('Toast element not mounted');
      return;
    }
    // GlobalEmitter.subscribe('ToastMessage', 'toast-message', toastElement, toastCallback);
    toastElement.addEventListener(ToastEventName, toastCallback);
    console.log('Set up toast message listener');
  }, []);

  return (
    <div id='toast-message' className={`toast toast-top toast-end mt-[5%] ${visible} h-min min-w-[20%] transition ${animation}`}>
      <div className={`alert alert-${toastType} gap-7 h-min`}>
        {chooseIcon(toastType)}
        <div>
          {toastMessage ? <p>{toastMessage}</p> : null}
        </div>
      </div>
    </div>
  );
}
