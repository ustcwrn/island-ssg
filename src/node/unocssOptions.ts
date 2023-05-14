import { VitePluginConfig } from 'unocss/vite';
import { presetAttributify, presetWind, presetIcons } from 'unocss';

const options: VitePluginConfig = {
  // presetAttributify: 属性化功能支持
  // presetWind： 兼容Tailwind、windi的语法
  // presetIcons： 接入图标的功能
  presets: [presetAttributify(), presetWind({}), presetIcons()],
  // 可以编写unocss的语法
  shortcuts: {
    'flex-center': 'flex justify-center items-center'
  },
  // 主题变量
  theme: {
    colors: {
      brandLight: 'var(--island-c-brand-light)',
      brandDark: 'var(--island-c-brand-dark)',
      brand: 'var(--island-c-brand)',
      text: {
        1: 'var(--island-c-text-1)',
        2: 'var(--island-c-text-2)',
        3: 'var(--island-c-text-3)',
        4: 'var(--island-c-text-4)'
      },
      divider: {
        default: 'var(--island-c-divider)',
        light: 'var(--island-c-divider-light)',
        dark: 'var(--island-c-divider-dark)'
      },
      gray: {
        light: {
          1: 'var(--island-c-gray-light-1)',
          2: 'var(--island-c-gray-light-2)',
          3: 'var(--island-c-gray-light-3)',
          4: 'var(--island-c-gray-light-4)'
        }
      },
      bg: {
        default: 'var(--island-c-bg)',
        soft: 'var(--island-c-bg-soft)',
        mute: 'var(--island-c-bg-mute)'
      }
    }
  },
  rules: [
    [
      /^divider-(\w+)$/,
      ([, w]) => ({
        [`border-${w}`]: '1px solid var(--island-c-divider-light)'
      })
    ],
    [
      'menu-item-before',
      {
        'margin-right': '12px',
        'margin-left': '12px',
        width: '1px',
        height: '24px',
        'background-color': 'var(--island-c-divider-light)',
        content: '" "'
      }
    ]
  ]
};

export default options;
