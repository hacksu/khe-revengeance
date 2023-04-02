import type { User as CustomUser } from "../global-includes/users.js";

export {};

declare global {
  namespace Express {
    export interface User extends CustomUser {}
  }
}
