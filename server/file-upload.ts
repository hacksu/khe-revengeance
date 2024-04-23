import type { Express, RequestHandler } from "express";
import multer from "multer";
import { nanoid } from "nanoid";
import {  projectRoot } from "./config.js";
import path from "path";
import { galleryURLPath } from "../global-includes/image-gallery.js";
import sharp from "sharp";
import { UserRole } from "../global-includes/common.js";
import { promises as fs } from "fs";
import { encode } from "blurhash";

export const imageGalleryPath = path.resolve(projectRoot, "server/uploads/gallery/");
export const galleryThumbnailsPath = path.resolve(projectRoot, "server/uploads/gallery/thumbs/");

export default function addUploads(app: Express){
  const checkAuth: RequestHandler = (req, res, next) => {
    if (!(
      req.user?.roles.includes(UserRole.Admin) ||
      req.user?.roles.includes(UserRole.Staff)
    )) {
      res.sendStatus(403);
    } else {
      next();
    }
  };
  
  app.post(
    "/newimage",
    checkAuth,
    multer({
      fileFilter(req, file, callback) {
        callback(null, file.mimetype.startsWith("image/"));
      },
      storage: multer.diskStorage({
        filename(req, file, callback) {
          const parsed = path.parse(file.originalname);
          const outputName = parsed.name + "_" + nanoid(6) + parsed.ext;
          callback(null, outputName);
        },
        destination: imageGalleryPath,
      })
    }).single("file"),
    async (req, res) => {
      if (req.file) {
        const file = sharp(req.file.path);
        const buffer = await file.clone().resize(64, 64).ensureAlpha().raw().toBuffer();
        const hash = encode(Uint8ClampedArray.from(buffer), 64, 64, 4, 4);
        await file
          .resize({width: 500, height: 500, fit: "inside"})
          .toFile(path.join(galleryThumbnailsPath, req.file.filename));
        res.json({
          hash,
          source: req.file.filename
        });
      } else {
        res.sendStatus(500);
      }
    }
  );

  app.post("/deleteImage/:filename", checkAuth, async (req, res) => {
    const imagePath = path.resolve(imageGalleryPath, req.params.filename);
    const thumbnailPath = path.resolve(galleryThumbnailsPath, req.params.filename);
    await Promise.all([
      fs.unlink(imagePath),
      fs.unlink(thumbnailPath)
    ]);
    res.sendStatus(200);
  });

  app.get(galleryURLPath+":filename", (req, res) => {
    res.sendFile(
      path.resolve(
        req.query.thumb ? galleryThumbnailsPath : imageGalleryPath,
        req.params.filename
      )
    );
  });
}
