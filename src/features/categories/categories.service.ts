import client from "@/src/lib/axios";
import { API_ENDPOINTS } from "@/src/lib/endpoints";
import type {
  CategoriesResponse,
  CategoryLevelsResponse,
} from "./categories.types";

const TAG = "[CategoriesService]";

const devLog = (...args: unknown[]) => {
  if (__DEV__) console.log(TAG, ...args);
};

const devWarn = (...args: unknown[]) => {
  if (__DEV__) console.warn(TAG, ...args);
};

export const CategoriesService = {
  list: (params?: { search?: string; per_page?: number }) => {
    devLog("list →", API_ENDPOINTS.CATEGORIES.LIST, params);
    return client
      .get<CategoriesResponse>(API_ENDPOINTS.CATEGORIES.LIST, { params })
      .then((r) => r.data)
      .catch((err) => {
        devWarn(
          "list ✗",
          err?.response?.status,
          err?.response?.data ?? err?.message,
        );
        throw err;
      });
  },

  levels: (categoryId: number) => {
    const url = API_ENDPOINTS.CATEGORIES.LEVELS(categoryId);
    devLog("levels →", url);
    return client
      .get<CategoryLevelsResponse>(url)
      .then((r) => r.data)
      .catch((err) => {
        devWarn(
          "levels ✗",
          err?.response?.status,
          err?.response?.data ?? err?.message,
        );
        throw err;
      });
  },
};
