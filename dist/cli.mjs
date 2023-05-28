import {
  CLIENT_ENTRY_PATH,
  MASK_SPLITTER,
  SERVER_ENTRY_PATH,
  createVitePlugins
} from "./chunk-BV2BFDQO.mjs";
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
var CLIENT_OUTPUT = "build";
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
          noExternal: ["react-router-dom", "lodash-es"]
        },
        build: {
          ssr: isServer,
          outDir: isServer ? path.join(root, ".temp") : path.join(root, CLIENT_OUTPUT),
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
    const publicDir = path.join(root, "docs", "public");
    if (fs.pathExistsSync(publicDir)) {
      await fs.copy(publicDir, path.join(root, CLIENT_OUTPUT));
    }
    return [clientBundle, serverBundle];
  } catch (e) {
    console.log(e);
  }
}
async function buildIslands(root, islandPathToMap) {
  const islandsInjectCode = `
    ${Object.entries(islandPathToMap).map(
    ([islandName, islandPath]) => `import { ${islandName} } from '${islandPath}'`
  ).join("")}
window.ISLANDS = { ${Object.keys(islandPathToMap).join(", ")} };
window.ISLAND_PROPS = JSON.parse(
  document.getElementById('island-props').textContent
);
  `;
  const injectId = "island:inject";
  return viteBuild({
    mode: "production",
    build: {
      // 输出目录
      outDir: path.join(root, ".temp"),
      rollupOptions: {
        // 让rollup加载虚拟模块
        input: injectId
      }
    },
    plugins: [
      // 重点插件，用来加载我们拼接的 Islands 注册模块的代码
      {
        name: "island:inject",
        enforce: "post",
        resolveId(id) {
          if (id.includes(MASK_SPLITTER)) {
            const [originId, importer] = id.split(MASK_SPLITTER);
            return this.resolve(originId, importer, { skipSelf: true });
          }
          if (id === injectId) {
            return id;
          }
        },
        // 加载resolve(id)后的代码
        load(id) {
          if (id === injectId) {
            return islandsInjectCode;
          }
        },
        // 对于 Islands Bundle，我们只需要 JS 即可，其它资源文件可以删除
        generateBundle(_, bundle2) {
          for (const name in bundle2) {
            if (bundle2[name].type === "asset") {
              delete bundle2[name];
            }
          }
        }
      }
    ]
  });
}
async function renderPage(render, root, clientBundle, routes) {
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === "chunk" && chunk.isEntry
  );
  return Promise.all(
    routes.map(async (route) => {
      const routePath = route.path;
      const {
        appHtml,
        islandToPathMap,
        islandProps: propsData = []
      } = await render(routePath);
      const styleAssets = clientBundle.output.filter(
        (chunk) => chunk.type === "asset" && chunk.fileName.endsWith(".css")
      );
      const islandBundle = await buildIslands(root, islandToPathMap);
      const islandsCode = islandBundle.output[0].code;
      const html = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>title</title>
        <meta name="description" content="xxx">
           ${styleAssets.map((item) => `<link rel="stylesheet" href="/${item.fileName}">`).join("\n")}
      </head>
      <body>
        <div id="root">${appHtml}</div>
        <script type="module">${islandsCode}</script>
        <script id="island-props">${JSON.stringify(propsData)}</script>
        <script type="module" src="/${clientChunk?.fileName}"></script>
      </body>
    </html>`.trim();
      const fileName = routePath.endsWith("/") ? `${routePath}index.html` : `${routePath}.html`;
      await fs.ensureDir(path.join(root, "build", dirname(fileName)));
      await fs.writeFile(path.join(root, "build", fileName), html);
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
