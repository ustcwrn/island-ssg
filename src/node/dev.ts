import { createServer as creatViteDevServer } from 'vite';
import { pluginIndexHtml } from './plugin-island/indexHtml';
// 局部热更新插件
import pluginReact from '@vitejs/plugin-react';
import { PACKAGE_ROOT } from './constants';
import { resolveConfig } from './config';

export async function createDevServer(root = process.cwd()) {
  const config = await resolveConfig(root, 'serve', 'development');
  console.log(config);
  return creatViteDevServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact()],
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  });
}
