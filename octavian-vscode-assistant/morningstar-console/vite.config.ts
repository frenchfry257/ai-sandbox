import { defineConfig, type Plugin } from "vite";
import type { IncomingMessage, ServerResponse } from "node:http";

// Read JSON body for POST requests
function readJson(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

function morningstarLocalApi(): Plugin {
  return {
    name: "morningstar-local-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          const method = req.method || "GET";
          const url = new URL(req.url ?? "/", "http://localhost");
          const path = url.pathname;

          // GET /health
          if (method === "GET" && path === "/health") {
            (res as ServerResponse).statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                ok: true,
                service: "morningstar-console (vite)",
                time: new Date().toISOString(),
              })
            );
            return;
          }

          // POST /echo
          if (method === "POST" && path === "/echo") {
            const body = await readJson(req as IncomingMessage);

            (res as ServerResponse).statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                ok: true,
                received: body,
                time: new Date().toISOString(),
              })
            );
            return;
          }

          next();
        } catch (err) {
          (res as ServerResponse).statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              ok: false,
              error: String(err),
            })
          );
        }
      });
    },
  };
}

export default defineConfig({
  server: {
    port: 1420,
    strictPort: true,
  },
  plugins: [morningstarLocalApi()],
});