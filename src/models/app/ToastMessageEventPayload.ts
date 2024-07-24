export const ToastMessageType = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error'
}
export interface ToastMessageEventPayload {
  message: string;
  type: keyof typeof ToastMessageType;
}
