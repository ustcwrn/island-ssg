import { App } from './App';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { DataContext } from './hooks';
import { initPageData } from './App';

// 服务端即 SSR 的入口
// For ssr component render
export async function render(pagePath: string) {
  // 生产pageData
  const pageData = await initPageData(pagePath);
  const { clearIslandData, data } = await import('./jsx-runtime');
  // 拿到 islands 组件相关数据
  const { islandProps, islandToPathMap } = data;
  clearIslandData();
  const appHtml = renderToString(
    <DataContext.Provider value={pageData}>
      <StaticRouter location={pagePath}>
        <App />
      </StaticRouter>
    </DataContext.Provider>
  );
  return { appHtml, islandProps, islandToPathMap };
}

// 导出路由数据
export { routes } from 'island:routes';
