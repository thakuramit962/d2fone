export interface Order {
  id: number | string;

  order_id: string;
  order_status: string;
  order_type: string;
  order_date: string;

  farmer_id: string;
  farmer_name: string;

  spray_date: string;
  crop_name: string;
  requested_acreage: string;
  total_payable_amount: string;
}
