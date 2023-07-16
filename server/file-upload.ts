import type { Express } from "express";
import multer from "multer";
import { nanoid } from "nanoid";
import {  projectRoot } from "./config.js";
import path from "path";

import { accessImagePath } from "../global-includes/image-grid.js";

export const gridImagePath = path.resolve(projectRoot, "server/uploads/grid-images/");

export default function addUploads(app: Express){
app.post(
    "/newimage",
    multer({
      fileFilter(req, file, callback) {
        callback(null, file.mimetype.startsWith("image/"));
      },
        storage: multer.diskStorage({
          filename(req, file, callback) {
            callback(null, nanoid(6)+file.originalname);
          },
          destination: gridImagePath,
      })
    }).single("image"),
    (req, res) => {
      if (req.file) {
        res.contentType("text/plain");
        res.send(req.file.filename);
      } else {
        res.sendStatus(500);
      }
    }
  );
  app.get(accessImagePath+":filename", (req, res)=> {
    res.sendFile(path.resolve(gridImagePath, req.params.filename));
  });
}
