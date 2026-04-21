import client from '@/src/lib/axios'
import { API_ENDPOINTS } from '@/src/lib/endpoints'
import type { ServicesResponse } from './services.types'

export const ServicesService = {
  getAll: () =>
    client.get<ServicesResponse>(API_ENDPOINTS.SERVICES.LIST).then(r => r.data),
}