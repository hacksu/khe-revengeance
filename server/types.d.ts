import type { User as CustomUser } from "../global-includes/users.ts";

export {};

declare global {
  namespace Express {
    export interface User extends CustomUser {}
  }
}

declare module "remult" {
  export interface RemultContext {
    incomingIP: string;
  }
}
