import type { UserConfig as UserConfigs, ConfigEnv } from "vite";

declare global {
  interface UserConfig extends UserConfigs {
    [key: string]: any;
  }
  interface ViteEnv {
    VITE_PORT: number; // 端口号
    VITE_PROXY: [string, string][]; // 代理端口
    VITE_PUBLIC_PATH: string; // 默认路径
    VITE_DROP_CONSOLE: boolean; // 是否打印console.log()
    VITE_HTTPS: boolean; // 是否为HTTPS
    VITE_OPEN_BROWSER: boolean; // 是否直接打开浏览器
    VITE_SERVER_HOST: string; // 服务器打开的IP
    VITE_PUBLIC_DIR: string; // 公共路径
    VITE_PACKAGE_VERSION_PATH: string; // 打包路径
  }
}
