export interface Application {
  id: string;
  role: string;
  name: string;
  father_name: string;
  mother_name: string;
  age: number;
  email: string;
  whatsapp: string;
  facebook_link?: string;
  address: string;
  state: string;
  district: string;
  block_panchayat: string;
  pincode: string;
  bpo_name?: string;
  pco_name?: string;
  upi_id?: string;
  education: string;
  total_experience?: string;
  ngo_experience?: string;
  why_join?: string;
  photo_path: string;
  aadhaar_front_path: string;
  aadhaar_back_path: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
  created_at: string;
}

export interface AdminUser {
  username: string;
  role: 'SUPER_ADMIN' | 'STATE_ADMIN' | 'DISTRICT_ADMIN';
}

export interface Settings {
  whatsapp_link: string;
  facebook_link: string;
}

export interface DashboardStats {
  total: number;
  byStatus: { status: string; count: number }[];
  byRole: { role: string; count: number }[];
  byState: { state: string; count: number }[];
}
