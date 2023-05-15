import { Layout } from '../theme-default';
import { matchRoutes } from 'react-router-dom';
import { Header, PageData } from '../shared/types';
import siteData from 'island:site-data';
import { routes } from 'island:routes';
import { Route } from '../node/plugin-routes';

export async function initPageData(routePath: string): Promise<PageData> {
  // 获取路由组件编译后的模块内容
  const matched = matchRoutes(routes, routePath);

  console.log('matched:', matched);
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
    console.log(moduleInfo);
    return {
      pageType: moduleInfo.frontmatter?.pageType ?? 'doc',
      siteData,
      frontmatter: moduleInfo.frontmatter,
      pagePath: routePath,
      toc: moduleInfo.Toc as Header[]
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
