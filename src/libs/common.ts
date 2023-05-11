declare type TargetContext = "_self" | "_blank";

/**
 * 打开链接
 * @param url 目标地址
 */
export function openWindow(
  url: string,
  opt?: {
    target?: TargetContext | string;
    noopener?: boolean;
    noreferrer?: boolean;
  }
) {
  const {target = "__blank", noopener = true, noreferrer = true} = opt || {};
  const feature: string[] = [];

  noopener && feature.push("noopener=yes");
  noreferrer && feature.push("noreferrer=yes");

  window.open(url, target, feature.join(","));
}

/**
 * 延迟函数
 * @param ms 毫秒
 * @description 需要延迟多少毫秒后执行
 */
export function delay(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * 防抖函数
 * @param func  执行函数
 * @param delay 毫秒
 * @description 处理频繁触发的事件非常有用，例如用户输入的自动补全功能，以避免过多的计算或网络请求。
 */
export function debounce(
  func: Function,
  delay: number
): (...args: any[]) => void {
  let timeoutId: number;

  return (...args: any[]) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

/**
 * 节流函数
 * @param func  执行函数
 * @param delay 毫秒
 * @description 指定的时间间隔内只会被执行一次。这对于处理频繁触发的事件非常有用，例如滚动事件、窗口调整事件等，以避免过多的计算或DOM操作。
 */
export function throttle(
  func: Function,
  delay: number
): (...args: any[]) => void {
  let timeoutId: number | null;
  let lastExecTime: number;

  return (...args: any[]) => {
    const currentTime = Date.now();

    if (!lastExecTime || currentTime - lastExecTime >= delay) {
      lastExecTime = currentTime;
      func(...args);
    } else {
      clearTimeout(timeoutId as number);
      timeoutId = setTimeout(() => {
        lastExecTime = currentTime;
        func(...args);
      }, delay - (currentTime - lastExecTime));
    }
  };
}
