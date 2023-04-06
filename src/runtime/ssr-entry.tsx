import { App } from './App';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
// 服务端即 SSR 的入口
// For ssr component render
export function render() {
  return renderToString(
    <StaticRouter location={'/guide'}>
      <App />
    </StaticRouter>
  );
}
