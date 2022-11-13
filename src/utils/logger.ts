/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGtag } from "vue-gtag-next";

export function logEvent(eventName: string, options?: any) {
  const { event } = useGtag();
  event(eventName, options);
}

export function logError(e: any, ...data: any[]): void {
  const { exception } = useGtag();
  exception(e);
  console.error(e, ...data);
}
