import { createServer as creatViteDevServer } from 'vite';
import { pluginIndexHtml } from './plugin-island/indexHtml';
// 局部热更新插件
import pluginReact from '@vitejs/plugin-react';
import { PACKAGE_ROOT } from './constants';
import { resolveConfig } from './config';
import { pluginConfig } from './plugin-island/config';
import { pluginRoutes } from './plugin-routes';

export async function createDevServer(
  root: string,
  restartServer: () => Promise<void>
) {
  const config = await resolveConfig(root, 'serve', 'development');
  return creatViteDevServer({
    root,
    plugins: [
      pluginIndexHtml(),
      pluginReact({ jsxRuntime: 'automatic' }),
      pluginConfig(config, restartServer),
      pluginRoutes({ root: config.root })
    ],
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  });
}
