// built-in node.js modules
import path from "path";
import { fileURLToPath } from "url";
import { IncomingMessage, ServerResponse } from "http";
import { execSync } from "child_process";

// dependencies installed from npm
import fastify from "fastify";
import middie from "@fastify/middie";
import fileServer from "serve-static";
import { createServer as createViteServer } from "vite";
import next from "next";
import { remultFastify } from "remult/remult-fastify";

// local modules
import { defineRemoteProcedures } from "./rpc-definitions.js";
import { dbConfig } from "../global-includes/exports.js";

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
    hostname: "staff.localhost",
    port: 3000,
    dir: staffFrontendDir,
    dev,
  });
  console.log("i disagree with the following warning:");
  await app.prepare();
  console.log("next.js server for staff frontend constructed");
  return app.getRequestHandler();
}

// create the top-level fastify app that will route traffic to the appropriate
// place
async function createServer() {
  const app = fastify();
  // enable express-style middleware
  await app.register(middie);
  // create api routes for database stuff
  await app.register(remultFastify(dbConfig));
  // for sanity checks
  app.get("/api/exists", (_, res) => res.send("yes"));
  defineRemoteProcedures();
  if (dev) {
    // in development mode, we create and use the vite and next.js development
    // servers and route traffic to them based on the subdomain for the request
    const publicDevServer = await getPublicDevServer();
    const staffDevServer = await getStaffDevServer();

    app.use(async (req: IncomingMessage, res: ServerResponse) => {
      if (!req.headers.host) {
        console.error("received request without Host header??");
        return;
      } else if (req.headers.host.startsWith("staff.")) {
        await staffDevServer(req, res);
      } else {
        publicDevServer(req, res);
      }
    });
  } else {
    // in production mode, we build our frontend code to HTML/CSS/JS and then
    // serve those files statically
    console.log("building public site for production...");
    console.log(execSync("yarn build-public").toString());
    const publicFiles = fileServer(
      path.resolve(projectRoot, "public-frontend/dist"),
      { extensions: ["html"] }
    );

    // TODO: exec next.js build
    const staffFiles = fileServer(
      path.resolve(projectRoot, "staff-frontend/dist"),
      { extensions: ["html"] }
    );

    // serve the built files if necessary; caddy or nginx could be set up to do
    // this in production
    app.use(async (req: IncomingMessage, res: ServerResponse, next) => {
      // add a header just so i can see that the request made it this far
      res.setHeader("X-File-Server", "Fastify-Static-Server");
      if (!req.headers.host) {
        console.error("received request without Host header??");
        return;
      } else if (req.headers.host.startsWith("staff.")) {
        staffFiles(req, res, next);
      } else {
        publicFiles(req, res, next);
      }
    });
  }

  app.listen({ port: 3000 }, () =>
    console.log(
      "fastify server in existence at http://localhost:3000 " +
        "and http://staff.localhost:3000"
    )
  );
}

createServer();
