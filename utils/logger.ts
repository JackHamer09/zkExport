import { Gtag } from "nuxt-gtag/dist/runtime/types";

export const trackEvent = (gtag: Gtag, name: string, data?: Record<string, any>) => {
  gtag("event", name, data);
};
