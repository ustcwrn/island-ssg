import { cac } from "cac";
import { createDevServer } from "./dev";
const path = require('path');

const version = require("../../package.json").version;

const cli = cac("island").version(version).help();

cli
  .command("[root]", "start dev server")
  .alias("dev")
  .action(async (root: string) => {
    // 添加以下逻辑
    root = root ? path.resolve(root) : process.cwd();
    console.log(root)
    const server = await createDevServer(root);
    // 监听
    await server.listen();
    // 打印网址
    server.printUrls();
  });

cli
  .command("build [root]", "build for production")
  .action(async (root: string) => {
    console.log("build", root);
  });

cli.parse();