import path from "path";
import { fileURLToPath } from "url";
import fastify from "fastify";
import { IncomingMessage, ServerResponse } from "http";
import middie, { IncomingMessageExtended } from "@fastify/middie";
import { createServer as createViteServer } from "vite";
import next from "next";

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
  const app = next({ dev, hostname, port, dir: staffFrontendDir });
  await app.prepare();
  console.log("next.js server for staff frontend constructed");
  return app.getRequestHandler();
}

async function createDevServer() {
  const publicDevServer = await getPublicFrontendMiddleware();
  const staffDevServer = await getStaffFrontendMiddleware();
  const app = fastify();
  await app.register(middie);
  app.use(
    async (
      req: IncomingMessage & IncomingMessageExtended,
      res: ServerResponse
    ) => {
      if (!req.headers.host) {
        console.error("received request without Host header??");
        return;
      }
      // console.log(req);
      if (req.headers.host.startsWith("staff.")) {
        await staffDevServer(req, res);
      } else {
        publicDevServer(req, res);
      }
    }
  );
  app.listen({ port: 3000 }, () =>
    console.log("fastify backend server listening on port 3000")
  );
}

createDevServer();
