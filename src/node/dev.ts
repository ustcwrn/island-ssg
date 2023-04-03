import { createServer as creatViteDevServer } from 'vite';
import { pluginIndexHtml } from './plugin-island/indexHtml';
// 局部热更新插件
import pluginReact from '@vitejs/plugin-react';

export async function createDevServer(root = process.cwd()) {
  return creatViteDevServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact()]
  });
}
