import type { SessionType } from "./types";

declare module "#auth-utils" {
  interface User {
    id: number;
    type: SessionType;
  }
}

export {};
