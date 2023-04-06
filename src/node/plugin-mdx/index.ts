import { pluginMdxRollup } from './pluginMdxRollup';
import { Plugin } from 'vite';

export function createMdxPlugins(): Plugin[] {
  return [pluginMdxRollup()];
}
