# Hierarchical Category System - Setup Guide

## Database Setup

### 1. Configure Supabase Connection

Update your `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
JWT_SECRET=your-jwt-secret
```

### 2. Run the Database Schema

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy the contents of `database/schema.sql`
4. Paste and execute the SQL script

This will create:
- `categories` table
- `sub_categories` table
- `products` table
- `contact_enquiries` table
- `newsletter_subscribers` table
- Sample data for testing
- Proper indexes and constraints
- Row Level Security (RLS) policies
- Helpful views for queries

### 3. Verify Tables

Check that all tables are created:
- categories
- sub_categories (linked to categories via `category_id`)
- products (linked to sub_categories via `sub_category_id`)

## System Architecture

### Hierarchy Flow

```
Categories (Main)
    ↓
Sub-Categories (Children of Categories)
    ↓
Products (Children of Sub-Categories)
```

### URL Structure

- **Homepage**: `/`
- **Category Page**: `/categories/{category-slug}`
- **Sub-Category Page**: `/categories/{category-slug}/{subcategory-slug}`

Example:
```
/categories/electronics
/categories/electronics/smartphones
/categories/fashion/men-clothing
```

## Frontend Integration

### Navbar
- **Product Center** dropdown automatically fetches and displays all active categories from the database
- Categories are displayed with images and descriptions
- Clicking a category navigates to its page

### Category Page (`/categories/[slug]`)
- Shows category header with name and description
- Lists all sub-categories in a grid layout
- Each sub-category card is clickable and navigates to the sub-category page

### Sub-Category Page (`/categories/[slug]/[subSlug]`)
- Shows sub-category header with breadcrumb navigation
- Lists all products in that sub-category
- Product cards show:
  - Image
  - Name and description
  - Price (with discount if applicable)
  - Stock status
  - Rating
  - Featured badge
  - "Add to Cart" button

## Admin Panel Integration

### Adding Categories
1. Go to `/admin/dashboard/categories`
2. Click "Add Category"
3. Fill in:
   - Name
   - Slug (URL-friendly, e.g., "electronics")
   - Description
   - Image URL
   - Status (Active/Inactive)
4. Save to database

### Adding Sub-Categories
1. Go to `/admin/dashboard/sub-categories`
2. Click "Add Sub-Category"
3. Select parent category
4. Fill in:
   - Name
   - Slug
   - Description
   - Image URL
   - Status
5. Save to database

### Adding Products
1. Go to `/admin/dashboard/products`
2. Click "Add Product"
3. Select category and sub-category
4. Fill in:
   - Name
   - SKU
   - Description
   - Image URL
   - Price & Original Price
   - Stock quantity
   - Rating
   - Featured status
5. Save to database

## API Routes

### GET `/api/categories`
Returns all active categories

Response:
```json
{
  "categories": [
    {
      "id": "uuid",
      "name": "Electronics",
      "slug": "electronics",
      "description": "Electronic devices and gadgets",
      "image_url": "https://...",
      "status": "active"
    }
  ]
}
```

### GET `/api/categories/[slug]`
Returns category details with sub-categories

Response:
```json
{
  "category": { ... },
  "subCategories": [ ... ]
}
```

### GET `/api/categories/[categorySlug]/[subSlug]`
Returns sub-category details with products

Response:
```json
{
  "category": { ... },
  "subCategory": { ... },
  "products": [ ... ]
}
```

## Database Schema Overview

### Categories Table
```sql
- id (UUID, Primary Key)
- name (VARCHAR)
- slug (VARCHAR, Unique)
- description (TEXT)
- image_url (TEXT)
- status (active/inactive)
- display_order (INTEGER)
- created_at, updated_at (TIMESTAMP)
```

### Sub-Categories Table
```sql
- id (UUID, Primary Key)
- category_id (UUID, Foreign Key → categories.id)
- name (VARCHAR)
- slug (VARCHAR)
- description (TEXT)
- image_url (TEXT)
- status (active/inactive)
- display_order (INTEGER)
- created_at, updated_at (TIMESTAMP)
- UNIQUE(category_id, slug)
```

### Products Table
```sql
- id (UUID, Primary Key)
- sub_category_id (UUID, Foreign Key → sub_categories.id)
- name (VARCHAR)
- slug (VARCHAR)
- sku (VARCHAR, Unique)
- description (TEXT)
- image_url (TEXT)
- price (DECIMAL)
- original_price (DECIMAL)
- stock (INTEGER)
- rating (DECIMAL 0-5)
- status (active/inactive)
- featured (BOOLEAN)
- display_order (INTEGER)
- created_at, updated_at (TIMESTAMP)
- UNIQUE(sub_category_id, slug)
```

## Key Features

✅ **Automatic Updates**: Navbar categories update automatically from database
✅ **SEO-Friendly URLs**: Clean slug-based URLs for categories and products
✅ **Cascading Deletes**: Deleting a category removes its sub-categories and products
✅ **Stock Management**: Real-time stock status display
✅ **Featured Products**: Highlight special products with badges
✅ **Discount Display**: Automatic discount percentage calculation
✅ **Rating System**: Star ratings for products
✅ **Image Support**: Full image URLs for all entities
✅ **Status Control**: Active/Inactive status for visibility control
✅ **Display Order**: Custom sorting for categories, sub-categories, and products

## Testing the System

### 1. Verify Database
Run this query in Supabase SQL Editor:
```sql
SELECT 
  c.name AS category,
  sc.name AS sub_category,
  p.name AS product
FROM categories c
LEFT JOIN sub_categories sc ON c.id = sc.category_id
LEFT JOIN products p ON sc.id = p.sub_category_id
ORDER BY c.display_order, sc.display_order, p.display_order;
```

### 2. Test Frontend
1. Visit homepage
2. Hover over "Product Center" in navbar
3. Click a category (e.g., "Electronics")
4. Click a sub-category (e.g., "Smartphones")
5. View products in that sub-category

### 3. Test Admin Panel
1. Login to `/admin`
2. Navigate to Categories/Sub-Categories/Products
3. Add new items
4. Verify they appear in frontend

## Troubleshooting

### Categories not showing in navbar
- Check Supabase connection in `.env.local`
- Verify categories have `status = 'active'`
- Check browser console for API errors

### Products not displaying
- Ensure products are linked to correct sub_category_id
- Verify product status is 'active'
- Check sub-category status is 'active'

### 404 on category pages
- Verify slug matches exactly (case-sensitive)
- Check category/sub-category exists in database
- Ensure status is 'active'

## Next Steps

1. Connect admin panel forms to Supabase APIs
2. Implement shopping cart functionality
3. Add product search and filters
4. Create product detail pages
5. Add image upload functionality
6. Implement order management

## Support

For issues or questions, check:
- Supabase Dashboard logs
- Browser console errors
- Next.js build output
- Database query results
