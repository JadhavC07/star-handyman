export interface Category {
  id: number
  name: string
  slug: string
  description: string
  image: string
}

export interface CategoriesResponse {
  success: boolean
  data: Category[]
}

