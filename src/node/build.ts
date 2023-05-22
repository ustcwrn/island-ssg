import path, { dirname } from 'path';
import { build as viteBuild, InlineConfig } from 'vite';
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants';
import type { RollupOutput } from 'rollup';
import fs from 'fs-extra';
import { pathToFileURL } from 'url'; //兼容 Windows 系统
import { SiteConfig } from 'shared/types';
import { createVitePlugins } from './vitePlugins';
import { MASK_SPLITTER } from './constants';
import { Route } from './plugin-routes';

// SSG 的核心逻辑
export async function bundle(root: string, config: SiteConfig) {
  // const spinner = ora()
  // console.log('Build client + server bundles...');
  try {
    const resolveViteConfig = async (
      isServer: boolean
    ): Promise<InlineConfig> => {
      return {
        mode: 'production',
        root,
        // 传入isServer参数
        plugins: await createVitePlugins(config, undefined, isServer),
        ssr: {
          // 注意加上这个配置，防止 cjs 产物中 require ESM 的产物，因为 react-router-dom 的产物为 ESM 格式
          noExternal: ['react-router-dom', 'lodash-es']
        },
        build: {
          ssr: isServer,
          outDir: isServer
            ? path.join(root, '.temp')
            : path.join(root, 'build'),
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
      return viteBuild(await resolveViteConfig(false));
    };
    // server build
    const serverBuild = async () => {
      return viteBuild(await resolveViteConfig(true));
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

async function buildIslands(
  root: string,
  islandPathToMap: Record<string, string>
) {
  // 根据 islandPathToMap 拼接模块代码内容
  const islandsInjectCode = `
    ${Object.entries(islandPathToMap)
      .map(
        ([islandName, islandPath]) =>
          `import { ${islandName} } from '${islandPath}'`
      )
      .join('')}
window.ISLANDS = { ${Object.keys(islandPathToMap).join(', ')} };
window.ISLAND_PROPS = JSON.parse(
  document.getElementById('island-props').textContent
);
  `;
  const injectId = 'island:inject';
  return viteBuild({
    mode: 'production',
    build: {
      // 输出目录
      outDir: path.join(root, '.temp'),
      rollupOptions: {
        // 让rollup加载虚拟模块
        input: injectId
      }
    },
    plugins: [
      // 重点插件，用来加载我们拼接的 Islands 注册模块的代码
      {
        name: 'island:inject',
        enforce: 'post',
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
        generateBundle(_, bundle) {
          for (const name in bundle) {
            if (bundle[name].type === 'asset') {
              delete bundle[name];
            }
          }
        }
      }
    ]
  });
}

export async function renderPage(
  render,
  root: string,
  clientBundle: RollupOutput,
  routes: Route[]
) {
  // 找到入口chunk
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  );
  return Promise.all(
    routes.map(async (route) => {
      const routePath = route.path;
      const { appHtml, islandToPathMap, propsData } = await render(routePath);
      // 打包island组件
      await buildIslands(root, islandToPathMap);
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
      const fileName = routePath.endsWith('/')
        ? `${routePath}index.html`
        : `${routePath}.html`;
      // 将产物写入磁盘
      await fs.ensureDir(path.join(root, 'build', dirname(fileName)));
      await fs.writeFile(path.join(root, 'build', fileName), html);
      // 删除.temp
      // await fs.remove(path.join(root, '.temp'));
    })
  );
}

export async function build(root: string = process.cwd(), config: SiteConfig) {
  // 1. 打包代码，包括 client 端 + server 端
  const [clientBundle] = await bundle(root, config);
  // 2. 引入 server-entry 模块    引入 ssr 入口模块
  const serverEntryPath = path.join(root, '.temp', 'ssr-entry.js');
  // 3. 服务端渲染，产出HTML
  const { render, routes } = await import(
    pathToFileURL(serverEntryPath).toString()
  );
  // 服务端渲染，产出完整的 HTML 内容
  await renderPage(render, root, clientBundle, routes);
}
