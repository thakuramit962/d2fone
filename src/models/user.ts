import { Roles } from "./roles";

export interface User {
  id: string | number;
  name: string;
  phone: string;
  email: string;
  emp_id: string; // relative user table reference
  login_id: string;
  role: Roles;
  status: string | boolean;

  profile_image?: string | null;
  text_password?: string;
  outstanding_balance?: string | number;
  client_id?: string | null;
  provider_id?: string | null;
  provider_name?: string | null;
  is_supervisor_head?: string | boolean;
  is_supervisor_head_assign_date?: string | Date;
  supervisor_assign_date?: string | Date | null;
  supervisor_id?: string | null;
  supervisor_name?: string | null;
  email_verified_at?: string | null;

  farmerDetails?: Farmer | null;
  userFarms?: null | Farm;

  agricoin?: UserAgricoin | null;

  created_at: Date;
  updated_at: Date | null;
}

export interface Farmer {
  id: number | string;
  farmer_name: string | null;
  farmer_mobile_no: string | null;
  farmer_code: string | null;
  is_verified: string | null;
  status: string | null;

  farmer_address: string | null;
  farmer_village: string | null;
  farmer_sub_district: string | null;
  farmer_district: string | null;
  farmer_state: string | null;
  farmer_pincode: string | null;
  saved_by_id: string | null;
  saved_by_name: string | null;
  updated_by_id: string | null;
  updated_by_name: string | null;
  created_at: Date;
  updated_at: Date | null;
}

export interface Farm {
  id: number;
  farmer_id: string;
  field_area: string;
  sub_district: string;
  village: string;
  district: string;
  state: string;
  pin_code: string;
  location_coordinates: string;
  address: string;
  acerage: string;
  farm_image: string | null;
  current_crop: string | null;
  status: string; //"active" | "inactive";
  iot_devices?: IotDevice[] | null;
  saved_by_id: string | null;
  saved_by_name: string | null;
  updated_by_id: string | null;
  updated_by_name: string | null;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
}

export interface IotDevice {
  device_type: string;
  device_id: string;
}

export interface UserAgricoin {
  sprayed_acres_current_fy: number; //used "total_sprayed_acreage" for current financial year sprayed acres
  balance: number;
  lifetime_earned: number;
  lifetime_spent: number;
  created_at: Date;
  fetched_at?: string;
}
