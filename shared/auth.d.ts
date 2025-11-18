import type { SessionType } from "./types";

declare module "#auth-utils" {
  interface User {
    id: string;
    type: SessionType;
  }
}

export {};
