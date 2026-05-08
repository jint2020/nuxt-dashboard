/*
 * @Author: jint jintang23@outlook.com
 * @Date: 2026-05-08 23:28:39
 * @LastEditors: jint jintang23@outlook.com
 * @LastEditTime: 2026-05-08 23:29:20
 * @FilePath: \nuxt-app\src\utils\request.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useFetch, type UseFetchOptions } from "@vueuse/core";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

function getToken(): string | null {
  return localStorage.getItem("token");
}

export function useRequest(url: string, options?: UseFetchOptions) {
  const token = getToken();

  return useFetch(`${BASE_URL}${url}`, {
    ...options,
    beforeFetch({ options }) {
      options.headers = {
        ...options.headers,
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      return { options };
    },
    onFetchError(ctx) {
      if (ctx.response?.status === 401) {
        localStorage.removeItem("token");
      }
      return ctx;
    },
  });
}

export function useGet<T>(url: string) {
  return useRequest(url).get().json<T>();
}

export function usePost<T>(url: string, payload?: unknown) {
  return useRequest(url).post(payload).json<T>();
}

export function usePut<T>(url: string, payload?: unknown) {
  return useRequest(url).put(payload).json<T>();
}

export function useDelete<T>(url: string) {
  return useRequest(url).delete().json<T>();
}
