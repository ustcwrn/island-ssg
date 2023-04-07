import {
  CLIENT_ENTRY_PATH,
  SERVER_ENTRY_PATH,
  createVitePlugins
} from "./chunk-WNLXLGT4.mjs";
import {
  resolveConfig
} from "./chunk-I7RX6JT6.mjs";

// src/node/cli.ts
import cac from "cac";
import { resolve } from "path";

// src/node/build.ts
import path, { dirname } from "path";
import { build as viteBuild } from "vite";
import fs from "fs-extra";
import { pathToFileURL } from "url";
async function bundle(root, config) {
  try {
    const resolveViteConfig = async (isServer) => {
      return {
        mode: "production",
        root,
        // 传入isServer参数
        plugins: await createVitePlugins(config, void 0, isServer),
        ssr: {
          // 注意加上这个配置，防止 cjs 产物中 require ESM 的产物，因为 react-router-dom 的产物为 ESM 格式
          noExternal: ["react-router-dom"]
        },
        build: {
          ssr: isServer,
          outDir: isServer ? path.join(root, ".temp") : path.join(root, "build"),
          rollupOptions: {
            input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
            output: {
              format: isServer ? "cjs" : "esm"
            }
          }
        }
      };
    };
    const clientBuild = async () => {
      return viteBuild(await resolveViteConfig(false));
    };
    const serverBuild = async () => {
      return viteBuild(await resolveViteConfig(true));
    };
    const [clientBundle, serverBundle] = await Promise.all([
      clientBuild(),
      serverBuild()
    ]);
    return [clientBundle, serverBundle];
  } catch (e) {
    console.log(e);
  }
}
async function renderPage(render, root, clientBundle, routes) {
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === "chunk" && chunk.isEntry
  );
  console.log(routes);
  return Promise.all(
    routes.map(async (route) => {
      const routePath = route.path;
      const appHtml = render(routePath);
      const html = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>title</title>
        <meta name="description" content="xxx">
      </head>
      <body>
        <div id="root">${appHtml}</div>
        <script type="module" src="/${clientChunk?.fileName}"></script>
      </body>
    </html>`.trim();
      const fileName = routePath.endsWith("/") ? `${routePath}index.html` : `${routePath}.html`;
      await fs.ensureDir(path.join(root, "build", dirname(fileName)));
      await fs.writeFile(path.join(root, "build", fileName), html);
      await fs.remove(path.join(root, ".temp"));
    })
  );
}
async function build(root = process.cwd(), config) {
  const [clientBundle] = await bundle(root, config);
  const serverEntryPath = path.join(root, ".temp", "ssr-entry.js");
  const { render, routes } = await import(pathToFileURL(serverEntryPath).toString());
  await renderPage(render, root, clientBundle, routes);
}

// src/node/cli.ts
var cli = cac("island").version("0.0.1").help();
cli.command("dev [root]", "start dev server").action(async (root) => {
  const createServer = async () => {
    const { createDevServer } = await import("./dev.mjs");
    const server = await createDevServer(root, async () => {
      await server.close();
      await createServer();
    });
    await server.listen();
    server.printUrls();
  };
  await createServer();
});
cli.command("build [root]", "build in production").action(async (root) => {
  try {
    root = resolve(root);
    const config = await resolveConfig(root, "build", "production");
    await build(process.cwd(), config);
  } catch (e) {
    console.log(e);
  }
});
cli.parse();
