import {
  PACKAGE_ROOT,
  createVitePlugins
} from "./chunk-STULV5AF.mjs";
import {
  resolveConfig
} from "./chunk-I7RX6JT6.mjs";

// src/node/dev.ts
import { createServer as creatViteDevServer } from "vite";
async function createDevServer(root, restartServer) {
  const config = await resolveConfig(root, "serve", "development");
  return creatViteDevServer({
    root,
    plugins: createVitePlugins(config, restartServer),
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  });
}
export {
  createDevServer
};
