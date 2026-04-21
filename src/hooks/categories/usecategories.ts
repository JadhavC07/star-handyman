import { CategoriesService } from "@/src/features/categories/categories.service";
import { CATEGORY_KEYS } from "@/src/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () =>
  useQuery({
    queryKey: CATEGORY_KEYS.all,
    queryFn: CategoriesService.getAll,
    select: (res) => res.data,
    staleTime: 5 * 60 * 1000, // categories rarely change — 5 min cache
  });

export const useCategoryServices = (slug: string) =>
  useQuery({
    queryKey: CATEGORY_KEYS.services(slug),
    queryFn: () => CategoriesService.getServicesBySlug(slug),
    select: (res) => ({ category: res.category, services: res.data }),
    enabled: !!slug,
    staleTime: 2 * 60 * 1000,
  });
