import {
  __dirname
} from "./chunk-I7RX6JT6.mjs";

// src/node/constants/index.ts
import * as path from "path";
var PACKAGE_ROOT = path.join(__dirname, "..");
var DEFAULT_HTML_PATH = path.join(PACKAGE_ROOT, "template.html");
var CLIENT_ENTRY_PATH = path.join(
  PACKAGE_ROOT,
  "src",
  "runtime",
  "client-entry.tsx"
);
var SERVER_ENTRY_PATH = path.join(
  PACKAGE_ROOT,
  "src",
  "runtime",
  "ssr-entry.tsx"
);

// src/node/plugin-island/config.ts
import { relative } from "path";
import { normalizePath } from "vite";
import { join as join2 } from "path";
var SITE_DATA_ID = "island:site-data";
function pluginConfig(config, restartServer) {
  return {
    name: "island:config",
    resolveId(id) {
      if (id === SITE_DATA_ID) {
        return "\0" + SITE_DATA_ID;
      }
    },
    load(id) {
      if (id === "\0" + SITE_DATA_ID) {
        return `export default ${JSON.stringify(config.siteData)}`;
      }
    },
    config() {
      return {
        root: PACKAGE_ROOT,
        resolve: {
          alias: {
            "@runtime": join2(PACKAGE_ROOT, "src", "runtime", "index.ts")
          }
        }
      };
    },
    // configureServer(s) {
    //   server = s;
    // },
    async handleHotUpdate(ctx) {
      const customWatchedFiles = [normalizePath(config.configPath)];
      const include = (id) => customWatchedFiles.some((file) => id.includes(file));
      if (include(ctx.file)) {
        console.log(
          `
${relative(config.root, ctx.file)} changed, restarting server...`
        );
        await restartServer();
      }
    }
  };
}

export {
  PACKAGE_ROOT,
  DEFAULT_HTML_PATH,
  CLIENT_ENTRY_PATH,
  SERVER_ENTRY_PATH,
  pluginConfig
};
