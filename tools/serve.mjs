// Servidor estático de desenvolvimento. Não é um backend da aplicação.
import http from "node:http";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const port = Number(process.env.PORT || 8080);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT deve ser uma porta inteira entre 1 e 65535.");
}
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
};
const server = http.createServer(async (request, response) => {
  if (!["GET", "HEAD"].includes(request.method)) {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    const file = path.resolve(
      root,
      "." + (pathname === "/" ? "/index.html" : pathname),
    );
    if (!file.startsWith(root) || pathname.includes("\0")) {
      response.writeHead(403);
      response.end("Acesso negado");
      return;
    }
    const data = await readFile(file);
    response.writeHead(200, {
      "Content-Type": types[path.extname(file)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    response.end(request.method === "HEAD" ? undefined : data);
  } catch {
    response.writeHead(404);
    response.end("Arquivo não encontrado");
  }
});
server.listen(port, "127.0.0.1", () => {
  console.log(
    `T.A.R.S. disponível localmente na porta ${port}. Pressione Ctrl+C para parar.`,
  );
  if (process.argv.includes("--open")) {
    const address = `http://127.0.0.1:${port}/`;
    const command =
      process.platform === "win32"
        ? "rundll32"
        : process.platform === "darwin"
          ? "open"
          : "xdg-open";
    const args =
      process.platform === "win32"
        ? ["url.dll,FileProtocolHandler", address]
        : [address];
    const child = spawn(command, args, { stdio: "ignore", detached: true });
    child.on("error", () => console.log(`Abra manualmente: ${address}`));
    child.unref();
  }
});
server.on("error", (error) => {
  console.error(
    error.code === "EADDRINUSE"
      ? `A porta ${port} já está ocupada. Feche a janela anterior do T.A.R.S. ou defina outra PORT.`
      : `Não foi possível iniciar: ${error.message}`,
  );
  process.exitCode = 1;
});
