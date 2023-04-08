import { VitePluginConfig } from 'unocss/vite';
import { presetAttributify, presetWind, presetIcons } from 'unocss';

const options: VitePluginConfig = {
  // presetAttributify: 属性化功能支持
  // presetWind： 兼容Tailwind、windi的语法
  // presetIcons： 接入图标的功能
  presets: [presetAttributify(), presetWind({}), presetIcons()]
};

export default options;
