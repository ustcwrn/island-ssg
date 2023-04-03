import { defineConfig } from "tsup";

export default defineConfig({
    entry: ['src/node/cli.ts'],
    bundle:true,
    splitting: true, // 拆包
    outDir: 'dist',
    format: ['cjs', 'esm'],
    dts: true,
    shims: true
});