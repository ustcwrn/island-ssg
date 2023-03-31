"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cac_1 = require("cac");
const dev_1 = require("./dev");
const path = require('path');
const version = require("../../package.json").version;
const cli = (0, cac_1.cac)("island").version(version).help();
cli
    .command("[root]", "start dev server")
    .alias("dev")
    .action(async (root) => {
    // 添加以下逻辑
    root = root ? path.resolve(root) : process.cwd();
    console.log(root);
    const server = await (0, dev_1.createDevServer)(root);
    // 监听
    await server.listen();
    // 打印网址
    server.printUrls();
});
cli
    .command("build [root]", "build for production")
    .action(async (root) => {
    console.log("build", root);
});
cli.parse();
