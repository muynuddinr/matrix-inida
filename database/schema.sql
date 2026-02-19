-- ============================================
-- Matrix India - Supabase Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_status ON categories(status);

-- ============================================
-- SUB-CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS sub_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, slug)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sub_categories_category_id ON sub_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_sub_categories_slug ON sub_categories(slug);
CREATE INDEX IF NOT EXISTS idx_sub_categories_status ON sub_categories(status);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  sub_category_id UUID REFERENCES sub_categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_sub_category_id ON products(sub_category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);

-- ============================================
-- PRODUCT TECHNICAL SPECIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS product_technical_specs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  specification_key VARCHAR(255) NOT NULL,
  specification_values TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_product_tech_specs_product_id ON product_technical_specs(product_id);
CREATE INDEX IF NOT EXISTS idx_product_tech_specs_key ON product_technical_specs(specification_key);
-- Ensure each specification key is unique per product (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_spec_unique_per_product ON product_technical_specs (product_id, lower(specification_key));

-- ============================================
-- CONTACT ENQUIRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contact_enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contact_enquiries_status ON contact_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_contact_enquiries_created_at ON contact_enquiries(created_at DESC);

-- ============================================
-- CATALOG ENQUIRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS catalog_enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_slug VARCHAR(255),
  category_slug VARCHAR(255),
  sub_category_slug VARCHAR(255),
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_catalog_enquiries_status ON catalog_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_catalog_enquiries_created_at ON catalog_enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_catalog_enquiries_email ON catalog_enquiries(email);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON newsletter_subscribers(status);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sub_categories_updated_at ON sub_categories;
CREATE TRIGGER update_sub_categories_updated_at BEFORE UPDATE ON sub_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contact_enquiries_updated_at ON contact_enquiries;
CREATE TRIGGER update_contact_enquiries_updated_at BEFORE UPDATE ON contact_enquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_catalog_enquiries_updated_at ON catalog_enquiries;
CREATE TRIGGER update_catalog_enquiries_updated_at BEFORE UPDATE ON catalog_enquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_enquiries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view active categories" ON categories;
DROP POLICY IF EXISTS "Public can view active sub_categories" ON sub_categories;
DROP POLICY IF EXISTS "Public can view active products" ON products;
DROP POLICY IF EXISTS "Public can insert contact enquiries" ON contact_enquiries;
DROP POLICY IF EXISTS "Public can insert newsletter subscriptions" ON newsletter_subscribers;

-- Public read access for active items only
CREATE POLICY "Public can view active categories" ON categories
  FOR SELECT USING (status = 'active');

CREATE POLICY "Public can view active sub_categories" ON sub_categories
  FOR SELECT USING (status = 'active');

CREATE POLICY "Public can view active products" ON products
  FOR SELECT USING (status = 'active');

-- Public can insert contact enquiries and newsletter subscriptions
CREATE POLICY "Public can insert contact enquiries" ON contact_enquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can insert catalog enquiries" ON catalog_enquiries
  FOR INSERT WITH CHECK (true);

-- ============================================
-- MIGRATIONS (For existing databases)
-- ============================================

-- Add category_id column to products if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='products' AND column_name='category_id'
  ) THEN
    ALTER TABLE products ADD COLUMN category_id UUID REFERENCES categories(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Make sub_category_id nullable (optional) if it's currently required
DO $$ 
BEGIN 
  DECLARE
    col_is_nullable BOOLEAN;
  BEGIN
    SELECT is_nullable = 'YES' INTO col_is_nullable 
    FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'sub_category_id';
    
    IF col_is_nullable IS FALSE THEN
      ALTER TABLE products ALTER COLUMN sub_category_id DROP NOT NULL;
    END IF;
  END;
END $$;

-- ============================================
-- END OF SCHEMA
-- ============================================
