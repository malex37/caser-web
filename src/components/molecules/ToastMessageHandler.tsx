'use client'
import ToastMessage from "@components/ToastMessage";
import { ToastMessageEventPayload } from "@models/app/ToastMessageEventPayload";
import { useEffect, useState } from "react";
import { v4 as uuid } from 'uuid';

export const ToastEventName = 'show-toast';
export const ToastMessageHandlerId = 'toast-message-handler';
export function ShowToast({ type, message }: ToastMessageEventPayload) {
  const event = new CustomEvent<ToastMessageEventPayload>(
    ToastEventName,
    { detail: { type: type, message: message } }
  );
  const toast = document.getElementById(ToastMessageHandlerId);
  if (!toast) {
    console.log('Uh oh no toast handler?!')
    return;
  }
  console.log(`Dispatching ${ToastEventName} with data ${type}, ${message}`)
  toast.dispatchEvent(event);
};

export default function ToastMessageHandler() {
  const [messages, setMessages] = useState<{ [id: string]: ToastMessageEventPayload }>({});

  const addMessage = (toast: ToastMessageEventPayload) => {
    const id = uuid();
    const idTail = process.env.NODE_ENV === 'development' ? ' '+id : '';
    setMessages((messagesState) => {
      return {
        [`${id}`]: {
          type: toast.type,
          message: toast.message + idTail,
        }, ...messagesState
      };
    });
    const newTimeout = () => {
      setMessages((messageState) => {
        const newState: any = {};
        Object.keys(messageState).map((messageKey) => {
          if (messageKey !== id) {
            newState[messageKey] = messageState[messageKey];
          }
        }
      );
      return newState;
    });
    }
    setTimeout(newTimeout, 5000);
  }

  const addToast = (event: Event) => {
    addMessage((event as CustomEvent<ToastMessageEventPayload>).detail);
  };

  useEffect(() => {
    const toastHandler = document.getElementById(ToastMessageHandlerId);
    if (!toastHandler) {
      console.error('Toast message handler is not mounted');
      return
    }
    toastHandler.addEventListener(ToastEventName, addToast);
  }, []);

  return (
    <div id={ToastMessageHandlerId} className="toast toast-top toast-end mt-[5%] h-min min-w-[20%] transition z-[100]">
      {
        Object.values(messages).map((toast: ToastMessageEventPayload, index: number) => {
          console.log(`Rendering ${index} and toast type ${toast.type}`);
          return (
            <ToastMessage
              key={uuid()}
              Key={index}
              type={toast.type}
              message={toast.message}
            />
          )
        })
      }
    </div>
  );
}
