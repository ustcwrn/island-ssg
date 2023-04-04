import * as path from 'path';
import { build as viteBuild, InlineConfig } from 'vite';
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants';
import type { RollupOutput } from 'rollup';
import fs from 'fs-extra';
import { pathToFileURL } from 'url'; //兼容 Windows 系统

// SSG 的核心逻辑
export async function bundle(root: string) {
  // const spinner = ora()
  // console.log('Build client + server bundles...');
  try {
    const resolveViteConfig = (isServer: boolean): InlineConfig => {
      return {
        mode: 'production',
        root,
        build: {
          ssr: isServer,
          outDir: isServer ? '.temp' : 'build',
          rollupOptions: {
            input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
            output: {
              format: isServer ? 'cjs' : 'esm'
            }
          }
        }
      };
    };
    // client build
    const clientBuild = async () => {
      return viteBuild(resolveViteConfig(false));
    };
    // server build
    const serverBuild = async () => {
      return viteBuild(resolveViteConfig(true));
    };

    const [clientBundle, serverBundle] = await Promise.all([
      clientBuild(),
      serverBuild()
    ]);
    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
  } catch (e) {
    console.log(e);
  }
}
export async function renderPage(
  render: () => string,
  root: string,
  clientBundle: RollupOutput
) {
  const appHtml = render();
  // 找到入口chunk
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  );

  // console.log(`Rendering page in server side...`);
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

export async function build(root: string) {
  // 1. 打包代码，包括 client 端 + server 端
  const [clientBundle] = await bundle(root);
  // 2. 引入 server-entry 模块    引入 ssr 入口模块
  const serverEntryPath = path.join(root, '.temp', 'ssr-entry.js');
  // 3. 服务端渲染，产出HTML
  const { render } = await import(pathToFileURL(serverEntryPath).toString());
  // 服务端渲染，产出完整的 HTML 内容
  await renderPage(render, root, clientBundle);
}
