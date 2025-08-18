/**
 * 获取 import.meta.env
 * @return {Record<string, any>}
 */
export function env() {
  return import.meta.env;
}

/**
 * 判断是否是 SSR 环境
 * @return {boolean}
 */
export function isSSR() {
  return import.meta.env.SSR;
}
