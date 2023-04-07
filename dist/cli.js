"use strict"; function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }



var _chunkGO7KHCRUjs = require('./chunk-GO7KHCRU.js');


var _chunk3W46IG2Ajs = require('./chunk-3W46IG2A.js');

// src/node/cli.ts
var _cac = require('cac'); var _cac2 = _interopRequireDefault(_cac);
var _path = require('path'); var path = _interopRequireWildcard(_path);

// src/node/build.ts

var _vite = require('vite');
var _fsextra = require('fs-extra'); var _fsextra2 = _interopRequireDefault(_fsextra);
var _url = require('url');
async function bundle(root, config) {
  try {
    const resolveViteConfig = async (isServer) => {
      return {
        mode: "production",
        root,
        plugins: await _chunkGO7KHCRUjs.createVitePlugins.call(void 0, config),
        ssr: {
          // 注意加上这个配置，防止 cjs 产物中 require ESM 的产物，因为 react-router-dom 的产物为 ESM 格式
          noExternal: ["react-router-dom"]
        },
        build: {
          ssr: isServer,
          outDir: isServer ? ".temp" : "build",
          rollupOptions: {
            input: isServer ? _chunkGO7KHCRUjs.SERVER_ENTRY_PATH : _chunkGO7KHCRUjs.CLIENT_ENTRY_PATH,
            output: {
              format: isServer ? "cjs" : "esm"
            }
          }
        }
      };
    };
    const clientBuild = async () => {
      return _vite.build.call(void 0, await resolveViteConfig(false));
    };
    const serverBuild = async () => {
      return _vite.build.call(void 0, await resolveViteConfig(true));
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
async function renderPage(render, root, clientBundle) {
  const appHtml = render();
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === "chunk" && chunk.isEntry
  );
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
        <script type="module" src="/${_optionalChain([clientChunk, 'optionalAccess', _ => _.fileName])}"></script>
      </body>
    </html>`.trim();
  await _fsextra2.default.writeFile(path.join(root, "build/index.html"), html);
  await _fsextra2.default.remove(path.join(root, ".temp"));
}
async function build(root = process.cwd(), config) {
  const [clientBundle] = await bundle(root, config);
  const serverEntryPath = path.join(root, ".temp", "ssr-entry.js");
  const { render } = await Promise.resolve().then(() => _interopRequireWildcard(require(_url.pathToFileURL.call(void 0, serverEntryPath).toString())));
  await renderPage(render, root, clientBundle);
}

// src/node/cli.ts
var cli = _cac2.default.call(void 0, "island").version("0.0.1").help();
cli.command("dev [root]", "start dev server").action(async (root) => {
  const createServer = async () => {
    const { createDevServer } = await Promise.resolve().then(() => _interopRequireWildcard(require("./dev.js")));
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
    root = _path.resolve.call(void 0, root);
    const config = await _chunk3W46IG2Ajs.resolveConfig.call(void 0, root, "build", "production");
    await build(process.cwd(), config);
  } catch (e) {
    console.log(e);
  }
});
cli.parse();
