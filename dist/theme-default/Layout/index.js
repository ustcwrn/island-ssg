"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layout = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
// 这是一个包含脚本和交互按钮的简单组件，
function Layout() {
    const [count, setCount] = (0, react_1.useState)(0);
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { children: "This is Layout component 125" }), (0, jsx_runtime_1.jsxs)("div", { children: [count, (0, jsx_runtime_1.jsx)("button", { onClick: () => setCount(count + 1), children: "Add Count" })] })] }));
}
exports.Layout = Layout;
