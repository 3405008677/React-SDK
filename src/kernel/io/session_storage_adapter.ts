/**
 * @Author: pan
 * @Date: 2024-01-29 14:21:10
 * @Version: 0.1.1
 * @Copyright: 元术软件（深圳）有限公司（yuanshu.cloud）
 * @Description: SessionStorage适配器类
 */
/**
 * window.sessionStorage
 * @module io
 */
class SessionStorageAdapter {
  /**********************************
   * 变量s
   ***********************************/

  /**********************************
   * 方法s
   ***********************************/
  constructor() {
    this.init();
  }
  /**
   * 初始化
   */
  public init() {
    console.log('SessionStorageAdapter init!!');
  }
  /**
   * 设置本地存储
   * @param key 键
   * @param val 值
   */
  set(key: string, val: any) {
    window.sessionStorage.setItem(key, JSON.stringify(val));
  }
  /**
   * 获取本地存储
   * @param key 键
   * @returns 返回对应键的值
   */
  get(key: string) {
    return JSON.parse(window.sessionStorage.getItem(key) as string);
  }
  /**
   * 删除对应的键值
   * @param key 键
   */
  remove(key: string) {
    window.sessionStorage.removeItem(key);
  }
  /**
   * 清空本地存储
   */
  clear() {
    window.sessionStorage.clear();
  }
}

export { SessionStorageAdapter };
