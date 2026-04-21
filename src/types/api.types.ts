export interface ApiResponse<T> {
  success: boolean
  data:    T
  message: string | null
  meta?:   PaginationMeta
}

export interface PaginationMeta {
  page:     number
  per_page: number
  total:    number
}