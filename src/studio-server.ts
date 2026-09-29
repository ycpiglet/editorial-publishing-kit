import { access, readFile, stat } from "node:fs/promises";
import { createServer, type ServerResponse } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_STUDIO_ROOT = fileURLToPath(
  new URL("../../studio-dist/", import.meta.url),
);

const CONTENT_TYPES: Readonly<Record<string, string>> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

export interface StudioServerOptions {
  readonly host?: string;
  readonly port?: number;
  readonly staticRoot?: string;
}

export interface RunningStudioServer {
  readonly host: string;
  readonly port: number;
  readonly url: string;
  close(): Promise<void>;
}

function safeFilePath(root: string, requestPath: string): string | undefined {
  let decoded: string;
  try {
    decoded = decodeURIComponent(requestPath);
  } catch {
    return undefined;
  }
  const relative = decoded === "/" ? "index.html" : decoded.replace(/^\/+/u, "");
  const resolved = path.resolve(root, relative);
  const rootPrefix = `${path.resolve(root)}${path.sep}`;
  return resolved === path.resolve(root) || resolved.startsWith(rootPrefix)
    ? resolved
    : undefined;
}

function addSecurityHeaders(response: ServerResponse): void {
  response.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
  );
  response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  response.setHeader("Referrer-Policy", "no-referrer");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "DENY");
}

async function resolveRequestFile(
  root: string,
  requestPath: string,
): Promise<string | undefined> {
  const candidate = safeFilePath(root, requestPath);
  if (candidate === undefined) {
    return undefined;
  }
  try {
    const metadata = await stat(candidate);
    if (metadata.isFile()) {
      return candidate;
    }
    if (metadata.isDirectory()) {
      const indexPath = path.join(candidate, "index.html");
      await access(indexPath);
      return indexPath;
    }
  } catch {
    if (!path.extname(requestPath)) {
      const fallback = path.join(root, "index.html");
      try {
        await access(fallback);
        return fallback;
      } catch {
        return undefined;
      }
    }
  }
  return undefined;
}

export async function serveStudio(
  options: StudioServerOptions = {},
): Promise<RunningStudioServer> {
  const host = options.host ?? "127.0.0.1";
  const requestedPort = options.port ?? 4317;
  const staticRoot = path.resolve(options.staticRoot ?? DEFAULT_STUDIO_ROOT);
  await access(path.join(staticRoot, "index.html")).catch(() => {
    throw new Error(
      `Profile Studio build is missing at ${staticRoot}. Run npm run studio:build first.`,
    );
  });

  const server = createServer((request, response) => {
    void (async () => {
      addSecurityHeaders(response);
      if (request.method !== "GET" && request.method !== "HEAD") {
        response.writeHead(405, { Allow: "GET, HEAD" });
        response.end("Method not allowed");
        return;
      }

      const requestUrl = new URL(
        request.url ?? "/",
        `http://${request.headers.host ?? host}`,
      );
      const filePath = await resolveRequestFile(staticRoot, requestUrl.pathname);
      if (filePath === undefined) {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Not found");
        return;
      }

      const extension = path.extname(filePath).toLocaleLowerCase();
      const content = await readFile(filePath);
      response.setHeader(
        "Cache-Control",
        path.basename(filePath) === "index.html"
          ? "no-cache"
          : "public, max-age=31536000, immutable",
      );
      response.writeHead(200, {
        "Content-Type":
          CONTENT_TYPES[extension] ?? "application/octet-stream",
        "Content-Length": String(content.byteLength),
      });
      response.end(request.method === "HEAD" ? undefined : content);
    })().catch((error: unknown) => {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end(error instanceof Error ? error.message : "Server error");
    });
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(requestedPort, host, () => {
      server.off("error", reject);
      resolve();
    });
  });

  const address = server.address();
  if (address === null || typeof address === "string") {
    server.close();
    throw new Error("Profile Studio server did not expose a TCP address.");
  }
  const port = address.port;
  return {
    host,
    port,
    url: `http://${host}:${port}`,
    close: async () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error === undefined) {
            resolve();
          } else {
            reject(error);
          }
        });
      }),
  };
}
