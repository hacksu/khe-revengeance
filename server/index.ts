import path from "path";
import { fileURLToPath } from "url";
import fastify from "fastify";
import { IncomingMessage, ServerResponse } from "http";
import middie, { IncomingMessageExtended } from "@fastify/middie";
import { createServer as createViteServer } from "vite";
import next from "next";
import { remultFastify } from "remult/remult-fastify";
import { Email } from "../global-includes/email-address.js";

const dev = process.env.NODE_ENV !== "production";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

async function getPublicFrontendMiddleware() {
  const publicFrontendDir = path.resolve(projectRoot, "../public-frontend");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
    root: publicFrontendDir,
    publicDir: path.resolve(publicFrontendDir, "public"),
  });
  console.log("vite dev server for public frontend constructed");
  return vite.middlewares;
}

async function getStaffFrontendMiddleware() {
  const staffFrontendDir = path.resolve(projectRoot, "../staff-frontend");
  const hostname = "staff.localhost";
  const port = 3000;
  // when using middleware `hostname` and `port` must be provided below
  const app = next({
    dev,
    hostname,
    port,
    dir: staffFrontendDir,
  });
  console.log("i disagree with the following warning:");
  await app.prepare();
  console.log("next.js server for staff frontend constructed");
  return app.getRequestHandler();
}

async function createDevServer() {
  const publicDevServer = await getPublicFrontendMiddleware();
  const staffDevServer = await getStaffFrontendMiddleware();
  const app = fastify();
  await app.register(middie);
  await app.register(
    remultFastify({
      entities: [Email],
    })
  );
  app.use(
    async (
      req: IncomingMessage & IncomingMessageExtended,
      res: ServerResponse
    ) => {
      if (!req.headers.host) {
        console.error("received request without Host header??");
        return;
      }
      if (req.headers.host.startsWith("staff.")) {
        await staffDevServer(req, res);
      } else {
        publicDevServer(req, res);
      }
    }
  );
  app.listen({ port: 3000 }, () =>
    console.log(
      "fastify backend server extant at http://localhost:3000 " +
        "and http://staff.localhost:3000"
    )
  );
}

createDevServer();
