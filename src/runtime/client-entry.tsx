import { createRoot, hydrateRoot } from 'react-dom/client';
import { App, initPageData } from './App';
import { BrowserRouter } from 'react-router-dom';
import { DataContext } from './hooks';
import { ComponentType } from 'react';

declare global {
  interface Window {
    ISLANDS: Record<string, ComponentType<unknown>>;
    ISLAND_PROPS: unknown[];
  }
}

async function renderInBrowser() {
  const containerEl = document.getElementById('root');
  if (!containerEl) {
    throw new Error('#root element not found');
  }

  console.log('当前环境为：', import.meta.env);

  if (import.meta.env.DEV) {
    // 如果是开发环境
    // 初始化 PageData
    const pageData = await initPageData(location.pathname);
    // console.log('client', location.pathname);
    createRoot(containerEl).render(
      <DataContext.Provider value={pageData}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </DataContext.Provider>
    );
  } else {
    // 生产环境下的Partia hydration
    // 找到各个 Islands 容器元素，然后分别对齐进行 Hydration
    const islands = document.querySelectorAll('[__island]');
    if (!islands.length) {
      return;
    }
    for (const island of islands) {
      // Aside:0
      const [id, index] = island.getAttribute('__island').split(':');
      const Element = window.ISLANDS[id] as ComponentType<unknown>;
      hydrateRoot(island, <Element {...window.ISLAND_PROPS[index]} />);
    }
  }
}

renderInBrowser();
