"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _chunkWTLW4ADCjs = require('./chunk-WTLW4ADC.js');


var _chunk3W46IG2Ajs = require('./chunk-3W46IG2A.js');

// src/node/dev.ts
var _vite = require('vite');
async function createDevServer(root, restartServer) {
  const config = await _chunk3W46IG2Ajs.resolveConfig.call(void 0, root, "serve", "development");
  return _vite.createServer.call(void 0, {
    root,
    plugins: await _chunkWTLW4ADCjs.createVitePlugins.call(void 0, config, restartServer),
    server: {
      fs: {
        allow: [_chunkWTLW4ADCjs.PACKAGE_ROOT]
      }
    }
  });
}


exports.createDevServer = createDevServer;
