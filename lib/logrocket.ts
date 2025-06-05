// lib/logrocket.ts
import LogRocket from "logrocket";

export function initLogRocket() {
  if (typeof window !== "undefined") {
    LogRocket.init("rix9j9/gamo");
  }
}

export function identifyUser(user: { id: string; email: string }) {
  LogRocket.identify(user.id, {
    email: user.email,
  });
}
