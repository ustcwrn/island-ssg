import {
  PACKAGE_ROOT,
  createVitePlugins
} from "./chunk-DSKNQILG.mjs";
import {
  resolveConfig
} from "./chunk-I7RX6JT6.mjs";

// src/node/dev.ts
import { createServer as creatViteDevServer } from "vite";
async function createDevServer(root, restartServer) {
  const config = await resolveConfig(root, "serve", "development");
  return creatViteDevServer({
    root,
    plugins: await createVitePlugins(config, restartServer),
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
