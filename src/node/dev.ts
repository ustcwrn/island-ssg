import { InlineConfig, createServer as creatViteDevServer } from 'vite';

import { PACKAGE_ROOT } from './constants';
import { resolveConfig } from './config';
import { createVitePlugins } from './vitePlugins';

export async function createDevServer(
  root: string,
  restartServer: () => Promise<void>
) {
  const config = await resolveConfig(root, 'serve', 'development');
  return creatViteDevServer({
    root,
    plugins: createVitePlugins(config, restartServer),
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  });
}
