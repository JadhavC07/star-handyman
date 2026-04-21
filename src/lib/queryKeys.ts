export const CATEGORY_KEYS = {
  all:      ['categories'] as const,
  services: (slug: string) => ['categories', slug, 'services'] as const,
}

export const SERVICE_KEYS = {
  all:    ['services'] as const,
  detail: (id: number) => ['services', id] as const,
}

export const PROFILE_KEYS = {
  all: ['profile'] as const,
}

export const BOOKING_KEYS = {
  all:    ['bookings'] as const,
  detail: (id: string) => ['bookings', id] as const,
}

export const CAROUSEL_KEYS = {
  all: ['carousels'] as const,
}
