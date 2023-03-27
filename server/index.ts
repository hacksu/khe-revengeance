import fastify from "fastify";
import middie from "@fastify/middie";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

async function getPublicFrontendMiddleware() {
  const publicFrontendDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../public-frontend"
  );
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
    root: publicFrontendDir,
    publicDir: path.resolve(publicFrontendDir, "public"),
  });
  console.log("vite dev server for public frontend constructed");
  return vite.middlewares;
}

async function createDevServer() {
  const app = fastify();
  await app.register(middie);
  app.use(await getPublicFrontendMiddleware());
  await app.listen({ port: 3000 }, () =>
    console.log("fastify backend server listening on port 3000")
  );
}

createDevServer();
