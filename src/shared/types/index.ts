import { Page } from '@playwright/test';
import { UserConfig as viteConfiguration } from 'vite';
import { ComponentType } from 'react';

// 导航栏结构
export type NavItemWithLink = {
  text: string;
  link: string;
};

export interface SiderBarGroup {
  text: string;
  items: SiderBarItem[];
}

// 侧边栏子项类型
export type SiderBarItem = {
  text: string;
  link: string;
};

// 侧边栏
export interface SiderBar {
  [path: string]: SiderBarGroup[];
}

// 页脚
export interface Footer {
  message: string;
}

// 主题配置
export interface Themeconfig {
  nav?: NavItemWithLink[];
  siderbar?: SiderBar;
  footer?: Footer;
}

// 用户配置
export interface UserConfig {
  title?: string;
  description?: string;
  themeConfig?: Themeconfig;
  vite?: viteConfiguration;
}

export interface SiteConfig {
  root: string;
  configPath: string;
  siteData: UserConfig;
}

export type PageType = 'home' | 'doc' | 'custom' | '404';

export interface Header {
  id: string;
  text: string;
  depth: number;
}

export interface FrontMatter {
  title?: string;
  descripiton?: string;
  pageType?: PageType;
  siderbar?: boolean;
  outline?: boolean;
}

export interface PageData {
  siteData: UserConfig;
  pagePath: string;
  frontmatter: FrontMatter;
  pageType: PageType;
  toc?: Header[];
}

export interface PageModule {
  default: ComponentType;
  frontmatter?: FrontMatter;
  [key: string]: unknown;
}
