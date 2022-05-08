/* eslint-disable @typescript-eslint/no-explicit-any */

import LogRocket from "logrocket";

let isLogRocketReady = false;

export function startLogRocket(logRocketAppID?: string) {
  if (!logRocketAppID) {
    return;
  }
  LogRocket.init(logRocketAppID);
  isLogRocketReady = true;
}

export function logEvent(eventName: string, options?: any) {
  if (isLogRocketReady) {
    LogRocket.track(eventName, options);
  }
  if (process.env.NODE_ENV === "development") {
    console.log("Track Event:", eventName, options ?? "");
  }
}

export function logError(e: any, ...data: any[]): void {
  if (isLogRocketReady) {
    LogRocket.captureException(e);
  }
  console.error(e, ...data);
}
