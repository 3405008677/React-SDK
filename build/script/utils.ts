import { resolve } from "path"
/**
 * 格式化env
 */
export function wrapperEnv(envConf: UserConfig): ViteEnv {
  let ret: Object = {}
  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, "\n")
    // 如果是boolean类型就转换
    realName = realName === "true" ? true : realName === "false" ? false : realName
    // 转换数值字符串
    if (envName === "VITE_PORT") {
      realName = Number(realName)
    }
    if (envName === "VITE_PROXY" && realName) {
      try {
        realName = JSON.parse(realName.replace(/'/g, '"'))
      } catch (error) {
        realName = ""
      }
    }
    ;(ret as any)[envName] = realName
    if (typeof realName === "string") {
      process.env[envName] = realName
    } else if (typeof realName === "object") {
      process.env[envName] = JSON.stringify(realName)
    }
  }
  return ret as ViteEnv
}
/**
 * 获取用户根目录
 * @param dir file path
 */
export function getRootPath(...dir: string[]) {
  return resolve(process.cwd(), ...dir)
}
/**
 * 返回 当前项目下的绝对路径
 * @param dir 路径-相对
 */
export function pathResolve(dir: string) {
  // 栗子:path.resolve('/foo/bar','.','/tmp/file')
  // /foo/bar/temp/file
  return resolve(process.cwd(), ".", dir)
}
