import { UserConfig as viteConfiguration } from 'vite';
import { ComponentType } from 'react';

// 导航栏结构
export type NavItemWithLink = {
  text: string;
  link: string;
};

export interface SidebarGroup {
  text: string;
  items: SidebarItem[];
}

// 侧边栏子项类型
export type SidebarItem = {
  text: string;
  link: string;
};

// 侧边栏
export interface SideBar {
  [path: string]: SidebarGroup[];
}

// 页脚
export interface Footer {
  message: string;
}

// 主题配置
export interface Themeconfig {
  nav?: NavItemWithLink[];
  sidebar?: SideBar;
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

export interface Feature {
  icon: string;
  title: string;
  details: string;
}

export interface Hero {
  name: string;
  text: string;
  tagline: string;
  image?: {
    src: string;
    alt: string;
  };
  actions: {
    text: string;
    link: string;
    theme: 'brand' | 'alt';
  }[];
}

export interface FrontMatter {
  title?: string;
  descripiton?: string;
  pageType?: PageType;
  siderbar?: boolean;
  outline?: boolean;
  features?: Feature[];
  hero?: Hero;
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
  toc?: Header[];
  [key: string]: unknown;
}

export type PropsWithIsland = {
  __island?: boolean;
};
