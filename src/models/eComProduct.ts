export interface EComProduct {
  description: string;
  hsn?: string | null;
  id: number;
  images: string[];
  product_name: string;
  product_price: string;
  quantity: number;
  sku?: string;
  status: boolean;
}
