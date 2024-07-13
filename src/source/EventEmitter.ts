export const EventNames = {
  FileUploaded: 'FileUploaded',
  ToastMessage: 'ToastMessage'
} as const;
type EventKeys = keyof typeof EventNames;

type EventMap = Partial<{
  [Key in EventKeys]: {
    subscribers: {
      [subscriberId: string]: {
        callback: (e: any) => any,
        element: HTMLElement
      }
    }
  }
}>;

export class EventEmitter {
  private static connections: EventMap = {};
  constructor() {

  };
  subscribe(event: EventKeys, subscriberId: string, subscribingElement: HTMLElement, callback: (e: any) => any) {
    if (!window) {
      throw new Error('Window is undefined');
    }
    const check = EventEmitter.connections[event];
    if (!check || !check.subscribers) {
      EventEmitter.connections[event] = {
        subscribers: {}
      }
    } else {
      check.subscribers[subscriberId] = {
        callback: callback,
        element: subscribingElement,
      }
    }
  }
  emit(event: keyof typeof EventNames, data: any) {
    console.log(`Emitting ${event}`);
    Object.keys(EventEmitter.connections[event]?.subscribers || []).map(key => {
      console.log(`Emitting ${event} on ${key}`)
      EventEmitter.connections[event]?.subscribers[key].element.dispatchEvent(new CustomEvent<typeof data>(event, data));
    });
  }
}

export const GlobalEmitter = new EventEmitter();
