/*
# Create products and orders tables for luxury footwear store

1. New Tables
- `products`: footwear catalog items (name, brand, price, image, colorways, sizes, description, collection)
- `orders`: customer orders with shipping info, line items, total, and status

2. Security
- Single-tenant app (no sign-in). Admin is password-protected client-side.
- Enable RLS on both tables.
- Allow anon + authenticated full CRUD (data is intentionally shared/public for this storefront).

3. Important Notes
- `colorways` stored as jsonb array of {name, hex} pairs.
- `sizes` stored as jsonb object with US/UK/EU arrays.
- `items` in orders stored as jsonb array of {product_id, name, size, color, qty, price}.
- Seed data includes 8 luxury footwear products.
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text NOT NULL DEFAULT 'MAISON NOIR',
  price numeric(10,2) NOT NULL,
  image_url text NOT NULL,
  colorways jsonb NOT NULL DEFAULT '[]'::jsonb,
  sizes jsonb NOT NULL DEFAULT '{"US":[],"UK":[],"EU":[]}'::jsonb,
  description text,
  collection text DEFAULT 'Main',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_products" ON products;
CREATE POLICY "anon_insert_products" ON products FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "anon_update_products" ON products FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "anon_delete_products" ON products FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  email text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  country text NOT NULL,
  postal_code text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE
  TO anon, authenticated USING (true);

-- Seed products
INSERT INTO products (name, brand, price, image_url, colorways, sizes, description, collection) VALUES
('Aether Low', 'MAISON NOIR', 420.00, 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=900',
  '[{"name":"Matte Black","hex":"#0a0a0a"},{"name":"Bone","hex":"#e8e2d5"},{"name":"Mocha","hex":"#5a4233"}]',
  '{"US":[7,7.5,8,8.5,9,9.5,10,10.5,11,12],"UK":[6,6.5,7,7.5,8,8.5,9,9.5,10,11],"EU":[40,40.5,41,42,42.5,43,44,44.5,45,46]}',
  'Hand-finished calf leather low-top with brushed gold hardware.', 'Main'),
('Obsidian Runner', 'MAISON NOIR', 580.00, 'https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=900',
  '[{"name":"Onyx","hex":"#111111"},{"name":"Champagne","hex":"#d4b483"},{"name":"Slate","hex":"#4a4e54"}]',
  '{"US":[6,7,8,9,10,11,12,13],"UK":[5,6,7,8,9,10,11,12],"EU":[39,40,41,42,43,44,45,46]}',
  'Carbon-plate runner with memory foam midsole and suede overlays.', 'Performance'),
('Velour Mid', 'MAISON NOIR', 640.00, 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=900',
  '[{"name":"Noir","hex":"#0a0a0a"},{"name":"Bordeaux","hex":"#4a1d23"},{"name":"Cream","hex":"#efe7d6"}]',
  '{"US":[7,8,9,10,11,12],"UK":[6,7,8,9,10,11],"EU":[40,41,42,43,44,45]}',
  'Italian velvet mid-top with gold-foil embossed tongue.', 'Main'),
('Luminaire High', 'MAISON NOIR', 720.00, 'https://images.pexels.com/photos/1639729/pexels-photo-1639729.jpeg?auto=compress&cs=tinysrgb&w=900',
  '[{"name":"Black","hex":"#0a0a0a"},{"name":"Silver","hex":"#c9ccd1"}]',
  '{"US":[8,9,10,11,12,13],"UK":[7,8,9,10,11,12],"EU":[41,42,43,44,45,46]}',
  'High-top with reflective shell and full-grain leather counter.', 'Limited'),
('Sable Slip-On', 'MAISON NOIR', 340.00, 'https://images.pexels.com/photos/2421374/pexels-photo-2421374.jpeg?auto=compress&cs=tinysrgb&w=900',
  '[{"name":"Sand","hex":"#c9b79c"},{"name":"Black","hex":"#0a0a0a"},{"name":"Olive","hex":"#5c5132"}]',
  '{"US":[6,7,8,9,10,11,12],"UK":[5,6,7,8,9,10,11],"EU":[39,40,41,42,43,44,45]}',
  'Muleskinner slip-on with elastic gusset and waxed laces.', 'Main'),
('Nocturne Chunky', 'MAISON NOIR', 510.00, 'https://images.pexels.com/photos/1306248/pexels-photo-1306248.jpeg?auto=compress&cs=tinysrgb&w=900',
  '[{"name":"Jet","hex":"#0a0a0a"},{"name":"Bone","hex":"#e8e2d5"}]',
  '{"US":[6,7,8,9,10,11,12],"UK":[5,6,7,8,9,10,11],"EU":[39,40,41,42,43,44,45]}',
  'Chunky-sole trainer with layered mesh and nubuck panels.', 'Performance'),
('Eclipse Court', 'MAISON NOIR', 460.00, 'https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?auto=compress&cs=tinysrgb&w=900',
  '[{"name":"White","hex":"#f4f4f0"},{"name":"Black","hex":"#0a0a0a"},{"name":"Gold","hex":"#c9a14a"}]',
  '{"US":[7,8,9,10,11,12,13],"UK":[6,7,8,9,10,11,12],"EU":[40,41,42,43,44,45,46]}',
  'Minimal court silhouette with gold debossed heel badge.', 'Main'),
('Phantom Trail', 'MAISON NOIR', 590.00, 'https://images.pexels.com/photos/1456736/pexels-photo-1456736.jpeg?auto=compress&cs=tinysrgb&w=900',
  '[{"name":"Graphite","hex":"#2b2b2b"},{"name":"Rust","hex":"#8a4a2a"}]',
  '{"US":[7,8,9,10,11,12],"UK":[6,7,8,9,10,11],"EU":[40,41,42,43,44,45]}',
  'All-terrain trail shoe with grippy outsole and waterproof upper.', 'Performance')
ON CONFLICT DO NOTHING;
