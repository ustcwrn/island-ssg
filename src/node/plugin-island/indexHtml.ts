import { readFile } from "fs/promises";
import { Plugin } from 'vite';
import { DEFAULT_HTML_PATH, CLIENT_ENTRY_PATH } from "../constants";

export function pluginIndexHtml(): Plugin {
   return {
      // 插件名
      name: 'island: index-html',
      apply: "serve",
      // 插入入口script标签
      transformIndexHtml(html) {
         return {
            html,
            tags: [
               {
                  tag: "script",
                  attrs: {
                     type: 'module',
                     src: `/@fs/${CLIENT_ENTRY_PATH}`,
                  },
                  injectTo: 'body',
               }
            ]
         }
      },
      // 配置devServer
      configureServer(server) {
         // configureServer 钩子将在内部中间件被安装前调用
         // 所以自定义的中间件将会默认会比内部中间件早运行
         // 如果你想注入一个在内部中间件 之后 运行的中间件
         // 你可以从 configureServer 返回一个函数，将会在内部中间件安装后被调用
   
         return () => {
            server.middlewares.use(async (req, res, next) => {
               // 1. 读取template.html的内容
               let html = await readFile(DEFAULT_HTML_PATH, 'utf-8');

               // 2.响应html给浏览器
               try {
                  // 热更新
                  html = await server.transformIndexHtml(
                     req.url,
                     html,
                     req.originalUrl
                  );
                  res.statusCode = 200;
                  res.setHeader("Content-Type", 'text/html');
                  res.end(html);
               } catch (e) {
                  return next(e);
               }
            })
         }
      }
   }
}