export type BankAccountType = "savings" | "chequing" | "current";

export type ServicemanAvailability = "full-time" | "part-time" | "on-call";

export interface CategoryEnrollment {
  category_id: number;
  category_name: string | null;
  category_image: string | null;
  enrolled_upto_level: number;
  license_photo: string | null;
  levels: {
    level: number;
    description: string;
    license_required: boolean;
  }[];
}

export interface ServicemanProfile {
  id?: number;
  user_id?: number;
  staff_id?: string | null;
  category_enrollments?: CategoryEnrollment[];
  rating: string | number;
  availability: ServicemanAvailability | null;
  service_radius_km: string | number | null;
  lat: number | null;
  lng: number | null;
  experience_years: number | null;
  notes: string | null;

  // Verification & legal
  sin_number?: string | null;
  hst_number?: string | null;
  insurance_company?: string | null;
  insurance_policy_number?: string | null;
  insurance_expiry_date?: string | null;

  // Trade licenses
  plumbing_license?: string | null;
  electrical_license?: string | null;
  hvac_license?: string | null;

  // Bank details
  bank_name?: string | null;
  bank_account_holder_name?: string | null;
  bank_account_number?: string | null;
  bank_routing_number?: string | null;
  bank_branch?: string | null;
  bank_account_type?: BankAccountType | null;

  meta?: unknown;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: "customer" | "serviceman";
  avatar: string | null;
  status: "active" | "inactive";
  is_verified: boolean;
  profile?: ServicemanProfile;
}

export interface AuthResponse {
  status?: string;
  success?: boolean;
  message: string;
  user: User;
  token: string;
}

export interface LoginWithPasswordPayload {
  email: string;
  password: string;
}

export interface LoginWithOtpPayload {
  email: string;
  otp: string;
}

export interface SendOtpPayload {
  email: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
}

export interface ServicemanSendOtpPayload {
  phone: string;
  name?: string;
}

export interface ServicemanSendLoginOtpPayload {
  phone: string;
}

export interface ServicemanRegisterPayload {
  phone: string;
  otp: string;
  name: string;
  email?: string;

  // Category enrollment (optional)
  categories?: number[];
  levels?: Record<number, number>;
  license_photos?: Record<number, { uri: string; name: string; type: string }>;
  expiry_dates?: Record<number, string>;
}

export interface ServicemanLoginPayload {
  phone: string;
  otp: string;
}

export interface ServicemanUpdateProfilePayload {
  // A. Basic
  name?: string;
  email?: string;
  phone?: string;
  avatar?: { uri: string; name: string; type: string };

  // Category enrollment (upserted server-side)
  categories?: number[];
  levels?: Record<number, number>;
  license_photos?: Record<number, { uri: string; name: string; type: string }>;

  // B. Verification & legal
  sin_number?: string;
  hst_number?: string;
  insurance_company?: string;
  insurance_policy_number?: string;
  insurance_expiry_date?: string; // YYYY-MM-DD

  // C. Trade licenses
  plumbing_license?: string;
  electrical_license?: string;
  hvac_license?: string;

  // D. Bank details
  bank_name?: string;
  bank_account_holder_name?: string;
  bank_account_number?: string;
  bank_routing_number?: string;
  bank_branch?: string;
  bank_account_type?: BankAccountType;

  // E. Other
  availability?: ServicemanAvailability;
  service_radius_km?: number;
  experience_years?: number;
  lat?: number;
  lng?: number;
  notes?: string;
}
