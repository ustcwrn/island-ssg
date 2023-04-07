import { useRoutes } from 'react-router-dom';
// 虚拟模块返回所有的route的数据
import { routes } from 'island:routes';
// import A from '../../docs/guide/a';
// import B from '../../docs/b';
// import Index from '../../docs/guide/index';

// const routes = [
//   {
//     path: '/guide',
//     element: <Index />
//   },
//   {
//     path: '/guide/a',
//     element: <A />
//   },
//   {
//     path: '/b',
//     element: <B />
//   }
// ];
export const Content = () => {
  // console.log(routes);
  const routeElement = useRoutes(routes);
  return routeElement;
};
