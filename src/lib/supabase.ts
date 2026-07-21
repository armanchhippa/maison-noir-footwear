import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Colorway = { name: string; hex: string };
export type SizeSet = { US: number[]; UK: number[]; EU: number[] };

export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url: string;
  colorways: Colorway[];
  sizes: SizeSet;
  description: string;
  collection: string;
  created_at: string;
};

export type CartItem = {
  product_id: string;
  name: string;
  brand: string;
  price: number;
  image_url: string;
  size: number;
  sizeSystem: 'US' | 'UK' | 'EU';
  color: string;
  qty: number;
};

export type OrderRow = {
  id: string;
  customer_name: string;
  email: string;
  address: string;
  city: string;
  country: string;
  postal_code: string | null;
  items: CartItem[];
  total: number;
  status: string;
  created_at: string;
};
