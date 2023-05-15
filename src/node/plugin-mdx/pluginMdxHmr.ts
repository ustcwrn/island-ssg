import { Plugin } from 'vite';
import assert from 'assert';

export function pluginMdxHMR(): Plugin {
  let viteReactPlugin: Plugin;
  return {
    name: 'vite-plugin-mdx-hmr',
    apply: 'serve',
    // 寻找vite的react插件
    configResolved(config) {
      viteReactPlugin = config.plugins.find(
        (plugin) => plugin.name === 'vite:react-babel'
      ) as Plugin;
    },
    async transform(code, id, opts) {
      // 过滤mdx的文件
      if (/\.mdx?$/.test(id)) {
        // Inject babel refresh template code by @vitejs/plugin-react
        assert(typeof viteReactPlugin.transform === 'function');
        // mdx的文件在@vitejs/plugin-react，不会被编译
        const result = await viteReactPlugin.transform?.call(
          this,
          code,
          id + '?.jsx',
          opts
        );
        const selfAcceptCode = 'import.meta.hot.accept();';
        if (
          typeof result === 'object' &&
          !result!.code?.includes(selfAcceptCode)
        ) {
          result!.code += selfAcceptCode;
        }
        return result;
      }
    },
    // 作用就是在 mdx 文件变动时给浏览器发送通知事件
    handleHotUpdate(ctx) {
      if (/\.mdx?/.test(ctx.file)) {
        ctx.server.ws.send({
          type: 'custom',
          event: 'mdx-changed',
          data: {
            filePath: ctx.file
          }
        });
      }
    }
  };
}
/**
 * 首先，代码会对文件名进行过滤，只处理 .mdx 或 .mdx? 的文件。这是因为 mdx 文件通常是 Vue.js 组件的代码，而 Vite 的默认编译器无法处理 mdx 文件。

接着，代码会调用 viteReactPlugin 中的 transform 方法，这个方法通常会将 mdx 文件转换为 React 组件的代码。由于 mdx 文件不会被编译，因此代码会直接返回转换后的代码。

最后，代码会添加一段 import.meta.hot.accept() 代码到转换后的代码中，以便在组件挂载时自动更新组件。如果转换后的代码中包含了 selfAcceptCode,则会跳过这段代码的添加。

通过这段代码，Vite 可以将 mdx 文件转换为 React 组件，以便在单页面应用程序中使用。
 */
