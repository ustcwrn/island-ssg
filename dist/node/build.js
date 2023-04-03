"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = exports.renderPage = exports.bundle = void 0;
const path = require("path");
const vite_1 = require("vite");
const constants_1 = require("./constants");
const fs = require("fs-extra");
const dynamicImport = new Function("m", "return import(m)");
// SSG 的核心逻辑
async function bundle(root) {
    const { default: ora } = await dynamicImport("ora");
    const spinner = ora();
    console.log('Build client + server bundles...');
    try {
        const resolveViteConfig = (isServer) => {
            return {
                mode: 'production', root,
                build: {
                    ssr: isServer,
                    outDir: isServer ? '.temp' : 'build',
                    rollupOptions: {
                        input: isServer ? constants_1.SERVER_ENTRY_PATH : constants_1.CLIENT_ENTRY_PATH,
                        output: {
                            format: isServer ? 'cjs' : 'esm',
                        }
                    }
                }
            };
        };
        // client build
        const clientBuild = async () => {
            return (0, vite_1.build)(resolveViteConfig(false));
        };
        // server build 
        const serverBuild = async () => {
            return (0, vite_1.build)(resolveViteConfig(true));
        };
        const [clientBundle, serverBundle] = await Promise.all([clientBuild(), serverBuild()]);
        return [clientBundle, serverBundle];
    }
    catch (e) {
        console.log(e);
    }
}
exports.bundle = bundle;
async function renderPage(render, root, clientBundle) {
    const appHtml = render();
    // 找到入口chunk
    const clientChunk = clientBundle.output.find(chunk => chunk.type === 'chunk' && chunk.isEntry);
    console.log(`Rendering page in server side...`);
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
    // 将产物写入'build/index.html'
    await fs.writeFile(path.join(root, 'build/index.html'), html);
    // 删除.temp
    await fs.remove(path.join(root, '.temp'));
}
exports.renderPage = renderPage;
async function build(root) {
    // 1. 打包代码，包括 client 端 + server 端
    const [clientBundle] = await bundle(root);
    debugger;
    // 2. 引入 server-entry 模块    引入 ssr 入口模块
    const serverEntryPath = path.join(root, '.temp', 'ssr-entry.js');
    // 3. 服务端渲染，产出HTML
    const { render } = require(serverEntryPath);
    // 服务端渲染，产出完整的 HTML 内容
    await renderPage(render, root, clientBundle);
}
exports.build = build;
