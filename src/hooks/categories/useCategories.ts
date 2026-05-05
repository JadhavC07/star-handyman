import { CategoriesService } from "@/src/features/categories/categories.service";
import { CATEGORY_KEYS } from "@/src/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useCategories = (params?: { search?: string; per_page?: number }) =>
  useQuery({
    queryKey: [...CATEGORY_KEYS.all, params ?? {}],
    queryFn: () => CategoriesService.list(params),
    staleTime: 5 * 60 * 1000,
  });

export const useCategoryLevels = (categoryId: number | null) =>
  useQuery({
    queryKey: categoryId ? CATEGORY_KEYS.levels(categoryId) : ["categories", "levels", "disabled"],
    queryFn: () => CategoriesService.levels(categoryId as number),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
  });
