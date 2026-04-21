export interface ServiceCategory {
  id: number
  name: string
  slug: string
}

export interface Service {
  id: number
  name: string
  slug: string
  price: string                          // "100.00" — string from API
  duration_minutes: number
  description: string
  service_type: 'one-time' | 'recurring'
  min_charge: string | null
  visit_charge: string | null
  included_items: string | null          // API returns null currently
  exclusions: string | null              // API returns null currently
  image: string | null                   // full URL in /services, relative in /categories/{slug}/services
  category: ServiceCategory

  // ─── Missing from API (request backend to add) ───────────────────────────
  // rating_avg: number
  // review_count: number
  // bookings_count: number
  // badge_label: string | null
  // original_price: string | null
  // tag_label: string | null
}

export interface ServicesResponse {
  success: boolean
  data: Service[]
}

export interface CategoryServicesResponse {
  success: boolean
  category: ServiceCategory
  data: Service[]
}