
/**
 * 获取一个范围内的 随机整数
 * @param {*} max 最大值
 * @param {*} min 最小值
 */
export const randomFn = (max, min) => {
  return Math.floor(Math.random() * (max - min + 1) + min)

}


/**
 * 获取rgb颜色的随机数
 * @returns
 */
export  const colorRandomFn = () => {
  return Math.floor(Math.random() * 256)
}

/**
 * 防抖函数
 * @param {Function} fn 需要防抖的函数
 * @param {number} delay 延迟时间(ms)，默认500ms
 * @param {boolean} immediate 是否立即执行，默认false
 * @returns {Function} 经过防抖处理的函数
 */
export const debounce = (fn, delay = 500, immediate = false) => {
  let timer = null;
  
  return function (...args) {
    // 保存this上下文
    const context = this;
    // 如果timer存在则清除定时器
    if (timer) clearTimeout(timer);
    // 立即执行
    if (immediate) {
      // 如果timer不存在，则可以执行
      const canExecute = !timer;
      // 设置定时器，delay后将timer设为null
      timer = setTimeout(() => {
        timer = null;
      }, delay);
      // 立即执行
      if (canExecute) fn.apply(context, args);
    } 
    // 非立即执行
    else {
      timer = setTimeout(() => {
        fn.apply(context, args);
      }, delay);
    }
  }
}
