import { pluginMdxRollup } from './pluginMdxRollup';
import { Plugin } from 'vite';
import { pluginMdxHMR } from './pluginMdxHmr';

export async function createMdxPlugins(): Promise<Plugin[]> {
  return [await pluginMdxRollup(), pluginMdxHMR()];
}
