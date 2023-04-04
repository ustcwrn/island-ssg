import { UserConfig as UserConfig$1 } from 'vite';

type NavItemWithLink = {
    text: string;
    link: string;
};
interface SiderBarGroup {
    text: string;
    items: SiderBarItem[];
}
type SiderBarItem = {
    text: string;
    link: string;
};
interface SiderBar {
    [path: string]: SiderBarGroup[];
}
interface Footer {
    message: string;
}
interface Themeconfig {
    nav?: NavItemWithLink[];
    siderbar?: SiderBar;
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
