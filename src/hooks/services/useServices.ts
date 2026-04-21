import { useQuery } from '@tanstack/react-query'
import { ServicesService } from '@/src/features/services/services.service'
import { SERVICE_KEYS } from '@/src/lib/queryKeys'


export const useServices = () =>
  useQuery({
    queryKey: SERVICE_KEYS.all,
    queryFn:  ServicesService.getAll,
    select:   (res) => res.data,
    staleTime: 2 * 60 * 1000,
  })