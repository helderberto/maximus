export type EventArgs<Payload> = [Payload] extends [undefined] ? [] : [payload: Payload];

export type Listener<Payload> = (...args: EventArgs<Payload>) => void;

export interface TypedEmitter<Events> {
  /** Adds a listener for one event. Returns the function that removes it. */
  on: <K extends keyof Events>(name: K, listener: Listener<Events[K]>) => () => void;
  /** Calls every listener of the event. Events with an `undefined` payload take no payload. */
  emit: <K extends keyof Events>(name: K, ...args: EventArgs<Events[K]>) => void;
}
