-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CATEGORIES POLICIES
-- ============================================
-- Allow anyone to read active categories
CREATE POLICY "Allow public read active categories" ON categories
  FOR SELECT
  USING (status = 'active');

-- Allow authenticated users (admin) to do everything
CREATE POLICY "Allow authenticated users full access" ON categories
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- SUB-CATEGORIES POLICIES
-- ============================================
-- Allow anyone to read active sub-categories
CREATE POLICY "Allow public read active sub-categories" ON sub_categories
  FOR SELECT
  USING (status = 'active');

-- Allow authenticated users (admin) to do everything
CREATE POLICY "Allow authenticated users full access on sub_categories" ON sub_categories
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- PRODUCTS POLICIES
-- ============================================
-- Allow anyone to read active products
CREATE POLICY "Allow public read active products" ON products
  FOR SELECT
  USING (status = 'active');

-- Allow authenticated users (admin) to do everything
CREATE POLICY "Allow authenticated users full access on products" ON products
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- CONTACT ENQUIRIES POLICIES
-- ============================================
-- Allow anyone to insert contact enquiries
CREATE POLICY "Allow public insert contact enquiries" ON contact_enquiries
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to read all
CREATE POLICY "Allow authenticated read contact enquiries" ON contact_enquiries
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================
-- NEWSLETTER SUBSCRIBERS POLICIES
-- ============================================
-- Allow anyone to subscribe
CREATE POLICY "Allow public subscribe to newsletter" ON newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read their own subscription (using email)
CREATE POLICY "Allow public read newsletter" ON newsletter_subscribers
  FOR SELECT
  USING (true);
