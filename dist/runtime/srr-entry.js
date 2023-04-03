"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const App_1 = require("./App");
const server_1 = require("react-dom/server");
// 服务端即 SSR 的入口
// For ssr component render
function render() {
    return (0, server_1.renderToString)((0, jsx_runtime_1.jsx)(App_1.App, {}));
}
exports.render = render;
