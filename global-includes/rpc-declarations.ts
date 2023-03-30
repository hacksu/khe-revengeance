import { SupportTicket } from "./support-ticket.js";

/**
 * This class declares functions that can be called in remult BackendMethods to
 * do stuff on the server. they are actually defined in server/api.ts, which is
 * only imported on the backend.
 */
export class RemoteProcedures {
  static async sendAlert(ticket: SupportTicket) {}
}
