export interface Category {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  slug?: string;
}

export interface CategoryLevel {
  level: number;
  description: string;
  license_required: boolean;
  license_required_if_selected: boolean;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

export interface CategoryLevelsResponse {
  success: boolean;
  data: {
    category: Category;
    levels: CategoryLevel[];
    total_levels: number;
  };
}

export interface LocalLicensePhoto {
  uri: string;
  name: string;
  type: string;
}

export interface EnrollmentDraft {
  selectedCategoryIds: number[];
  levels: Record<number, number>;
  licensePhotos: Record<number, LocalLicensePhoto>;
  expiryDates: Record<number, string>;
}
