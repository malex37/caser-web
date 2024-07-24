'use client'

import { CheckIcon } from "@heroicons/react/24/outline";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { NoSymbolIcon } from "@heroicons/react/24/outline";
import { ToastMessageType } from "@models/app/ToastMessageEventPayload";


function ToastVar(type: keyof typeof ToastMessageType, message: string) {
  // Make icon be square
  const iconClassName = 'h-full w-auto min-h-5';
  switch (type) {
    case 'info':
      return (<div role="alert" className='alert alert-info gap-7 h-min'>
        <ExclamationCircleIcon className={iconClassName} />
        <div>
          {message}
        </div>
      </div>);
    case 'error':
      return (
        <div role="alert" className="alert alert-error gap-7 h-min">
          <NoSymbolIcon className={iconClassName} />
          <div>
            {message}
          </div>
        </div>
      );
    case 'warning':
      return (<div role="alert" className='alert alert-warning gap-7 h-min'>
        <NoSymbolIcon className={iconClassName} />
        <div>
          {message}
        </div>
      </div>);
    case 'success':
    default:
      return (
        <div role="alert" className='alert alert-success gap-7 h-min'>
          <CheckIcon className={iconClassName} />
          <div>
            {message}
          </div>
        </div>
      );

  }
}

export default function ToastMessage({ Key, type, message }: { type: keyof typeof ToastMessageType, message: string, Key: string | number }) {

  return (
    <>
      {ToastVar(type, message)}
    </>
  );
}
