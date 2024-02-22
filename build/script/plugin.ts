import { PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import { pathResolve } from "./utils";
import AutoImport from "unplugin-auto-import/vite";
import UnoCSS from "unocss/vite";
import mkcert from "vite-plugin-mkcert";
import viteCompression from "vite-plugin-compression"; // 开启Gzip

import dts from "vite-plugin-dts";
import { visualizer } from "rollup-plugin-visualizer";

export function createVitePlugins(viteEnv: ViteEnv) {
  const vitePlugins: (PluginOption | PluginOption[])[] = [];
  vitePlugins.push(react());

  vitePlugins.push(
    AutoImport({
      imports: ["react"],
      dts: pathResolve("/types/AutoImportReact.d.ts"),
    })
  );

  vitePlugins.push(
    UnoCSS({
      configFile: "/build/config/uno.config.ts",
    })
  );

  if (viteEnv.VITE_HTTPS) {
    vitePlugins.push(mkcert());
  }

  return vitePlugins;
}

// 打包
export function createViteBuildPlugins(viteEnv: ViteEnv) {
  viteEnv;
  const vitePlugins: (PluginOption | PluginOption[])[] = [];

  vitePlugins.push(
    viteCompression({
      threshold: 1024, // 对大于 1mb 的文件进行压缩
    })
  );

  return vitePlugins;
}

// lib
export function createViteLibPlugins() {
  const vitePlugins: (PluginOption | PluginOption[])[] = [];

  vitePlugins.push(react());
  vitePlugins.push(
    dts({
      rollupTypes: true,
      compilerOptions: {
        include: ["src/**/*", "types/**/*"],
        noEmit: false,
        declaration: true,
        emitDeclarationOnly: true,
      },
    })
  );
  vitePlugins.push(visualizer({ open: false })); // 打开包分析
  return vitePlugins;
}
