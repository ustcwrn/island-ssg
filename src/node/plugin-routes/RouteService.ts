import fastGlob from 'fast-glob';
import { normalizePath } from 'vite';
import path from 'path';

interface RouteMeta {
  // 路由路径和绝对路径
  routePath: string;
  absolutePath: string;
}

export class RouteService {
  #scanDir: string;
  #routeData: RouteMeta[] = [];

  constructor(scanDir: string) {
    this.#scanDir = scanDir;
  }

  async init() {
    const files = fastGlob
      .sync(['**/*.{js,jsx,ts,tsx,md,mdx}'], {
        // 制指定工作目录
        cwd: this.#scanDir,
        absolute: true,
        ignore: ['**/node_modules/**', '**/build/**', 'config.ts']
      })
      .sort(); // 保证每次生成的文件顺序都是稳定的
    files.forEach((file) => {
      const fileRelativePath = normalizePath(
        path.relative(this.#scanDir, file)
      );
      // 1. 路由路径
      const routePath = this.normalizeRoutePath(fileRelativePath);
      // 2. 文件绝对路径
      this.#routeData.push({
        routePath,
        absolutePath: file
      });
    });
  }
  /**
   *  
   *  import React from 'react';
      import loadable from '@loadable/component';
      const Route0 = loadable(() => import('TEST_DIR/a.mdx'));
      const Route1 = loadable(() => import('TEST_DIR/guide/b.mdx'));
      export const routes = [
          { path: '/a', element: React.createElement(Route0) },
          { path: '/guide/b', element: React.createElement(Route1) }
      ];
   */

  /**
   *
   * ssr 之前我们通过 @loadable/component 进行浏览器端的按需加载
   * 避免请求全量的组件代码，可以降低网络 IO 的开销
   * 但在 SSR/SSG 阶段，所有的 JS 都通过本地磁盘进行读取
   * 并没有网络 IO 开销相关的负担
   * 因此我们可以通过静态 import 来导入组件
   */
  generateRoutesCode(srr = false) {
    return `
  import React from 'react';
  ${srr ? '' : 'import loadable from "@loadable/component";'}

  ${this.#routeData
    .map((route, index) => {
      // 生成import信息,动态import，按需加载
      return srr
        ? `import Route${index} from "${route.absolutePath}";`
        : `const Route${index} = loadable(() => import('${route.absolutePath}'));`;
    })
    .join('\n')}
  export const routes = [
  ${this.#routeData
    .map((route, index) => {
      return `{ path: '${route.routePath}', element: React.createElement(Route${index}), preload: () => import('${route.absolutePath}') }`;
    })
    .join(',\n')}
  ];
  `;
  }

  // 获取路由数据，方便测试
  getRouteMeta(): RouteMeta[] {
    return this.#routeData;
  }

  normalizeRoutePath(rawPath: string) {
    const routePath = rawPath.replace(/\.(.*)?$/, '').replace(/index$/, '');
    return routePath.startsWith('/') ? routePath : `/${routePath}`;
  }
}
