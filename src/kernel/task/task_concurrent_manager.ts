/**
 * @Author: pan
 * @Date: 2024-01-27 18:40:21
 * @Version: 0.1.1
 * @Copyright: 元术软件（深圳）有限公司（yuanshu.cloud）
 * @Description: 加载顺序管理类
 * 1. 用于管理加载顺序
 * 2. 支持异步加载和同步加载管理
 * 3. 结束后执行回调
 */

//TODO:重命名为 TaskManager 任务管理类

import type { awaitArrayType, asyncArrayType } from "#/src/kernel/task/task_concurrent_manager";

/**
 *并发任务执行管理器
 * 1 兼容异步、同步管理
 * 2 执行顺序管理
 * 3 执行的结果回调
 */
class TaskConcurrentManager {
  private awaitArray: awaitArrayType = [];
  private asyncArray: asyncArrayType = [];

  constructor() {}

  awaitFun(item: Promise<any>) {
    this.awaitArray.push(item);
  }

  asyncFun(item: Function) {
    this.asyncArray.push(item);
  }

  execute(callback: Function, type: boolean = true) {
    return new Promise(async resolve => {
      await Promise.all(this.awaitArray);
      if (type) {
        this.asyncArray.forEach(item => item());
        callback();
        resolve(true);
      } else {
        let data: Promise<any>[] = [];
        this.asyncArray.forEach(item => data.push(item()));
        await Promise.all(data);
        callback();
        resolve(true);
      }
    });
  }
}

export { TaskConcurrentManager };
// export default new executeList(); //TODO: 此处不合规，要改成 export {具体类名}！！
