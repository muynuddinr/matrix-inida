-- Create contacts table for storing contact form submissions
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  country TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subcategories table
CREATE TABLE IF NOT EXISTS subcategories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(slug, category_id)
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active',
  specifications JSONB DEFAULT '{}'::jsonb,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  sub_category_id INTEGER REFERENCES subcategories(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(slug, sub_category_id)
);

-- Optional: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_slug ON subcategories(slug);
CREATE INDEX IF NOT EXISTS idx_products_sub_category_id ON products(sub_category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for images bucket
CREATE POLICY "Images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'uploads');

CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'uploads');

CREATE POLICY "Users can update their own images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'uploads');

CREATE POLICY "Users can delete their own images" ON storage.objects
  FOR DELETE USING (bucket_id = 'uploads');
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;