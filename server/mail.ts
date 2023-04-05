import type { Express } from "express";
import type { RemultServer } from "remult/server/expressBridge";
import multer from "multer";
import { Message } from "../global-includes/support-ticket";
import { SupportTicketController } from "../global-includes/support-ticket";

const parseForm = multer({ dest: "./uploads/email-attachments/" });

export default function enableMail(app: Express, remultConfig: RemultServer) {
  app.post(
    "/obtainMail",
    remultConfig.withRemult,
    parseForm.any(),
    async (req, res) => {
      const plusCode = parseInt(req.body.to.split("@")[0].split("+")[1]);
      console.log(req.files);
      const message: Message = {
        subject: req.body.subject,
        html: req.body.html,
        text: req.body.text,
        date: new Date(),
        attachments: [],
        incoming: true,
        plusCode,
      };
      await SupportTicketController.addToConversation(message);
    }
  );
}
