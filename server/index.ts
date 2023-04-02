// built-in node.js modules
import path from "path";
import { fileURLToPath, parse as parseURL } from "url";
import { IncomingMessage, ServerResponse } from "http";
import { exec } from "child_process";

// dependencies installed from npm
import express from "express";
import fileServer from "serve-static";
import { createServer as createViteServer } from "vite";
import next from "next";

// local modules
import { defineRemoteProcedures } from "./rpc-definitions.ts";
import { remultConfig } from "./db.ts";
import { registerAuthMiddleware } from "./auth.ts";
import { config } from "./config.ts";
import { UserRole } from "../global-includes/users.ts";

// checking environment variable to see if we're in production or development
// mode; this variable NODE_ENV should be set on the command line by the tool
// "cross-env" like it is in the scripts in package.json
const dev = process.env.NODE_ENV !== "production";
console.log("dev mode:", dev);

// find the directory at the root of the repository; it is the parent of the
// parent of this file
const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
console.log("project root directory:", projectRoot);

function isHostnameStaff(host: string) {
  return host.startsWith("staff.");
}

// create a vite server that will constantly rebuild the public frontend code
// for fast development
async function getPublicDevServer() {
  const publicFrontendDir = path.resolve(projectRoot, "public-frontend");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    root: publicFrontendDir,
    publicDir: path.resolve(publicFrontendDir, "public"),
  });
  console.log("vite dev server for public frontend constructed");
  return vite.middlewares;
}

// create a next.js server that will constantly rebuild the staff frontend code
// for fast development
async function getStaffDevServer() {
  const staffFrontendDir = path.resolve(projectRoot, "staff-frontend");
  const app = next({
    hostname: parseURL(config.staffSite).host!,
    port: config.port,
    dir: staffFrontendDir,
    dev,
  });
  console.log("i disagree with the following warning:");
  await app.prepare();
  console.log("next.js server for staff frontend constructed");
  return app.getRequestHandler();
}

// create the top-level express app that will route traffic to the appropriate
// place
async function createServer() {
  const app = express();
  registerAuthMiddleware(app, remultConfig);
  // create api routes for database stuff
  app.use(remultConfig);
  // for sanity checks
  app.get("/api/exists", (_req, res, _next) => res.end("yes"));
  app.get("/meta/log/:logtype", (req, res) => {
    if (req.user?.roles?.includes(UserRole.Admin)) {
      res.sendFile(`/opt/pm2/logs/khe-revengeance-${req.params.logtype}.log`);
    } else {
      res.sendStatus(403);
    }
  });
  defineRemoteProcedures();
  if (dev) {
    // in development mode, we create and use the vite and next.js development
    // servers and route traffic to them based on the subdomain for the request
    const publicDevServer = await getPublicDevServer();
    const staffDevServer = await getStaffDevServer();

    app.get("*", async (req, res) => {
      if (!req.headers.host) {
        console.error("received request without Host header??");
        return;
      } else if (isHostnameStaff(req.headers.host)) {
        await staffDevServer(req, res);
      } else {
        publicDevServer(req, res);
      }
    });
  } else {
    // in production mode, we build our frontend code to HTML/CSS/JS and then
    // serve those files statically
    console.log("building site html for production...");

    exec("yarn build-public", (err, stdout, stderr) => {
      if (err) {
        console.error("could not build public site!");
        console.error(stderr);
      } else {
        console.log("built public site:");
        console.log(stdout);
      }
    });
    const publicFiles = fileServer(
      path.resolve(projectRoot, "public-frontend/dist"),
      { extensions: ["html"] }
    );

    exec("yarn build-staff", (err, stdout, stderr) => {
      if (err) {
        console.error("could not build staff site!");
        console.error(stderr);
      } else {
        console.log("built staff site:");
        console.log(stdout);
      }
    });
    const staffFiles = fileServer(
      path.resolve(projectRoot, "staff-frontend/dist"),
      { extensions: ["html"] }
    );

    // serve the built files if necessary; caddy or nginx could be set up to do
    // this in production
    app.get("*", async (req: IncomingMessage, res: ServerResponse, next) => {
      // add a header just so i can see that the request made it this far
      res.setHeader("X-File-Server", "Express-Static-Server");
      const host = req.headers.host;
      if (!host) {
        console.error("received request without Host header??");
        return;
      } else if (isHostnameStaff(host)) {
        staffFiles(req, res, next);
      } else {
        publicFiles(req, res, next);
      }
    });
  }

  app.listen({ port: config.port }, () => {
    console.log(
      `express server in existence at ${config.publicSite} ` +
        `and ${config.staffSite}`
    );
  });
}

createServer();
