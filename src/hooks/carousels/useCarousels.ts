import { useQuery } from '@tanstack/react-query';
import client from '@/src/lib/axios';
import { API_ENDPOINTS } from '@/src/lib/endpoints';
import { CAROUSEL_KEYS } from '@/src/lib/queryKeys';

interface Carousel { id: number; image: string; }

export const useCarousels = () => useQuery({
  queryKey: CAROUSEL_KEYS.all,
  queryFn: () => client.get<{ data: Carousel[] }>(API_ENDPOINTS.CAROUSELS.LIST).then(r => r.data.data),
});
