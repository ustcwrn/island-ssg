import { Layout } from '../theme-default';
import { matchRoutes } from 'react-router-dom';
import { PageData } from '../shared/types';
import siteData from 'island:site-data';
import { routes } from 'island:routes';
import { Route } from '../node/plugin-routes';

export async function initPageData(routePath: string): Promise<PageData> {
  // 获取路由组件编译后的模块内容
  const matched = matchRoutes(routes, routePath);
  // console.log(routes, routePath, matched);
  /** matched的结构
   * [
      {
        "params": {},
        "pathname": "/",
        "pathnameBase": "/",
        "route": {
            "path": "/",
            "element": {
                "type": {},
                "key": null,
                "ref": null,
                "props": {},
                "_owner": null,
                "_store": {}
              }
        }
      }
    ]   
  */
  if (matched) {
    // Preload route component
    const route = matched[0].route as Route;
    //  preload 方法，它的作用就是为了获取路由组件编译后的模块内容
    const moduleInfo = await route.preload();
    console.log(route, moduleInfo);
    // console.log(import('/docs/guide/a.tsx'));
    return {
      pageType: 'doc',
      siteData,
      frontmatter: moduleInfo.frontmatter,
      pagePath: routePath
    };
  }
  return {
    pageType: '404',
    siteData,
    pagePath: routePath,
    frontmatter: {}
  };
}
export function App() {
  return <Layout />;
}
