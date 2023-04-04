import type { PlaywrightTestConfig } from '@playwright/test';

// 1. 创建测试项目
// 2. 启动测试项目
// 3. 开启无头浏览器访问
const config: PlaywrightTestConfig = {
  testDir: './e2e',
  timeout: 5000,
  webServer: {
    url: 'http://localhost:5173',
    command: 'pnpm prepare:e2e'
  },
  use: {
    headless: true //无头浏览器(无 UI 界面)
  }
};
export default config;
