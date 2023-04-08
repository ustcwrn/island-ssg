import { pluginIndexHtml } from './plugin-island/indexHtml';
// 局部热更新插件
import pluginReact from '@vitejs/plugin-react';
import { pluginConfig } from './plugin-island/config';
import { pluginRoutes } from './plugin-routes';
import { SiteConfig } from 'shared/types';
import { createMdxPlugins } from './plugin-mdx';
import pluginUnocss from 'unocss/vite';
import unocssOptions from './unocssOptions';

export async function createVitePlugins(
  config: SiteConfig,
  restartServer?: () => Promise<void>,
  isSSR = false
) {
  return [
    pluginUnocss(unocssOptions),
    pluginIndexHtml(),
    pluginReact({ jsxRuntime: 'automatic' }),
    pluginConfig(config, restartServer),
    pluginRoutes({ root: config.root, isSSR }),
    await createMdxPlugins()
  ];
}
