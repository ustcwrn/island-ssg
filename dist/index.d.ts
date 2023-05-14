import { UserConfig as UserConfig$1 } from 'vite';

type NavItemWithLink = {
    text: string;
    link: string;
};
interface SidebarGroup {
    text: string;
    items: SidebarItem[];
}
type SidebarItem = {
    text: string;
    link: string;
};
interface SideBar {
    [path: string]: SidebarGroup[];
}
interface Footer {
    message: string;
}
interface Themeconfig {
    nav?: NavItemWithLink[];
    sidebar?: SideBar;
    footer?: Footer;
}
interface UserConfig {
    title?: string;
    description?: string;
    themeConfig?: Themeconfig;
    vite?: UserConfig$1;
}

declare function defineConfig(config: UserConfig): UserConfig;

export { defineConfig };
