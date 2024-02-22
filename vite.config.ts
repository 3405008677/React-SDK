import type { ConfigEnv, UserConfig, BuildOptions } from "vite";
import { loadEnv } from "vite";
import { createProxy } from "./build/script/proxy";
import { createVitePlugins, createViteBuildPlugins, createViteLibPlugins } from "./build/script/plugin";
import { pathResolve, wrapperEnv, getRootPath } from "./build/script/utils";
import path from "path";

export default ({ mode }: ConfigEnv): UserConfig => {
  let viteConfig!: UserConfig; // 全局vite配置对象
  const rootPath = getRootPath();
  const env = loadEnv(mode, rootPath + "/build/Env", ["VITE_"]); // prefixes获取 满足 前缀数组中的 环境变量
  const viteEnv = wrapperEnv(env); // 获取标准vite的环境变量
  switch (mode) {
    case "development": {
      viteConfig = development(viteEnv, rootPath);
      break;
    }
    case "product": {
      viteConfig = product(viteEnv, rootPath);
      break;
    }
    case "lib": {
      viteConfig = lib(viteEnv, rootPath);
      break;
    }
    default: {
      viteConfig.resolve = {
        alias: {
          "@": pathResolve("src"),
          "#": pathResolve("type"),
        },
      };
    }
  }

  return viteConfig;
};
function development(viteEnv: ViteEnv, rootPath: string): UserConfig {
  let configObj: UserConfig = {
    base: viteEnv.VITE_PUBLIC_PATH, //公共路径
    publicDir: viteEnv.VITE_PUBLIC_DIR,
    root: rootPath,
    server: {
      host: viteEnv.VITE_SERVER_HOST,
      port: viteEnv.VITE_PORT,
      https: viteEnv.VITE_HTTPS as any,
      proxy: createProxy(viteEnv.VITE_PROXY),
      strictPort: true, // 端口被占用，直接退出
      open: viteEnv.VITE_OPEN_BROWSER, // 直接打开浏览器
    },
    css: {
      preprocessorOptions: {
        scss: { additionalData: "@import '@/assets/style/variate.scss';" },
      },
    },
    plugins: createVitePlugins(viteEnv),
  };
  return configObj;
}
function product(viteEnv: ViteEnv, rootPath: string): UserConfig {
  //打包部署目录
  const deployPackagePath: string = path.normalize(rootPath + viteEnv.VITE_PACKAGE_VERSION_PATH);
  let configObj: UserConfig = {
    esbuild: {
      drop: viteEnv.VITE_DROP_CONSOLE ? ["console", "debugger"] : [], //删除所有的console和debugger
    },
    plugins: createViteBuildPlugins(viteEnv),
  };
  let propertyBuild: BuildOptions = {
    outDir: deployPackagePath, //打包部署的目标文件夹 指定输出路径
    emptyOutDir: true, // 构建时清空 指定的构建目录
    copyPublicDir: true, // 是否复制Public文件

    assetsDir: "src/assets/", //指定生成静态资源的存放路径（相对于 build.outDir）。在 库模式 下不能使用
    assetsInlineLimit: 4096, //小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 0 可以完全禁用此项。
    target: "modules",

    reportCompressedSize: false, //启用gzip压缩大小报告
    minify: "esbuild", //混淆器
    sourcemap: false,
    chunkSizeWarningLimit: 2048, //规定触发警告的 chunk 大小

    rollupOptions: {
      output: {
        entryFileNames: "main.js", // 打包后的入口文件
        chunkFileNames: "asset/js/[name]-[hash].js", //分包名
        assetFileNames: "asset/[ext]/[name]-[hash].[ext]", // 资源文件名
        // manualChunks(name: string) {
        // if (name.includes("/node_modules/")) {
        //   if (name.includes("babylon")) {
        //     return "babylon";
        //   }
        //   if (name.includes("react")) {
        //     return "react";
        //   }
        //   if (name.includes("antd")) {
        //     return "antd";
        //   }
        //   return "node_modules";
        // }
        // },
      },
    },
  };
  configObj.build = propertyBuild;
  return configObj;
}
function lib(viteEnv: ViteEnv, rootPath: string): UserConfig {
  let configObj: UserConfig = {
    base: viteEnv.VITE_PUBLIC_PATH, //公共路径
    root: rootPath, //项目根目录
    publicDir: "public",
    plugins: createViteLibPlugins(),
    esbuild: {
      drop: viteEnv.VITE_DROP_CONSOLE ? ["console", "debugger"] : [], //删除所有的console和debugger
    },
  };
  let propertyBuild: BuildOptions = {
    outDir: "dist",
    emptyOutDir: true, // 构建时清空 指定的构建目录
    copyPublicDir: true, // 是否复制Public文件
    reportCompressedSize: true, //启用gzip压缩大小报告

    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      // entry: path.resolve(__dirname, "src/main.tsx"),
      // entry: path.resolve(__dirname, "src/App.tsx"),
      name: "lib",
      formats: ["es", "cjs"],
      fileName: "my-lib",
    },
    rollupOptions: {
      // output: {
      //   entryFileNames: "main.js", // 打包的入口文件
      //   chunkFileNames: "asset/js/[name]-[hash].js", //分包名
      //   assetFileNames: "asset/[ext]/[name]-[hash].[ext]", // 资源文件名
      // },
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  };
  configObj.build = propertyBuild;
  return configObj;
}
