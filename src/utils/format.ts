const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? ''

/**
 * API inconsistency: /services returns full URLs, /categories/{slug}/services
 * returns relative paths. This normalizes both.
 */
export function resolveImageUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  // Strip leading slash to avoid double slashes
  return `${BASE_URL}/${path.replace(/^\//, '')}`
}

/**
 * Format number to compact string: 2100 → "2.1K", 125000 → "125K"
 * Backend returns raw integers; formatting is a frontend concern.
 */
export function formatCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`
  if (count >= 1_000) {
    const val = (count / 1_000).toFixed(1)
    return val.endsWith('.0') ? `${Math.floor(count / 1_000)}K` : `${val}K`
  }
  return String(count)
}

/**
 * Format duration in minutes to human-readable label.
 * 60 → "1 hr", 90 → "1.5 hrs", 45 → "45 min"
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hrs = minutes / 60
  return hrs % 1 === 0 ? `${hrs} hr` : `${hrs} hrs`
}

/**
 * Format price string from API ("100.00") to display ("$100").
 */
export function formatPrice(price: string, currency = '$'): string {
  const num = parseFloat(price)
  return `${currency}${Number.isInteger(num) ? num : num.toFixed(2)}`
}

// Deterministic color per category slug — used since API has no category images
const SLUG_COLORS: Record<string, { bg: string; text: string }> = {
  'cleaning':             { bg: '#E8F5E9', text: '#2E7D32' },
  'furniture-assembly':   { bg: '#FFF3E0', text: '#E65100' },
  'handyman':             { bg: '#E3F2FD', text: '#1565C0' },
  'holiday-help':         { bg: '#FCE4EC', text: '#880E4F' },
  'mounting-installation':{ bg: '#EDE7F6', text: '#4527A0' },
  'moving-services':      { bg: '#E0F7FA', text: '#006064' },
  'yard-work':            { bg: '#F1F8E9', text: '#33691E' },
}

const FALLBACK_COLOR = { bg: '#F5F5F5', text: '#424242' }

export function getCategoryColor(slug: string) {
  return SLUG_COLORS[slug] ?? FALLBACK_COLOR
}