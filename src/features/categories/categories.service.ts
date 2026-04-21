import client from '@/src/lib/axios'
import { API_ENDPOINTS } from '@/src/lib/endpoints'
import type { CategoriesResponse } from './categories.types'
import { CategoryServicesResponse } from '../services/services.types'
 
export const CategoriesService = {
  getAll: () =>
    client.get<CategoriesResponse>(API_ENDPOINTS.CATEGORIES.LIST).then(r => r.data),

  getServicesBySlug: (slug: string) =>
    client
      .get<CategoryServicesResponse>(API_ENDPOINTS.CATEGORIES.SERVICES(slug))
      .then(r => r.data),
}