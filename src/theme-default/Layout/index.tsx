// import { usePageData } from '../../runtime/hooks';
// src/theme-default/Layout/index.tsx
import { Nav } from '../components/Nav';
import '../styles/base.css';
import '../styles/vars.css';
import { usePageData } from 'runtime';
import 'uno.css';
import HomeLayout from './HomeLayout';
import { DocLayout } from './DocLayout';

export function Layout() {
  const pageData = usePageData();
  // 获取 pageType
  const { pageType } = pageData;

  // 根据 pageType 分发不同的页面内容
  const getContent = () => {
    if (pageType === 'home') {
      return <HomeLayout />;
    } else if (pageType === 'doc') {
      return <DocLayout />;
    } else {
      return <div>404 页面</div>;
    }
  };
  return (
    <div>
      <Nav />
      {getContent()}
    </div>
  );
}
