import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      email,
      phone,
      productName,
      productSlug,
      categorySlug,
      subCategorySlug
    } = await request.json();

    // Validate required fields
    if (!name || !email || !phone || !productName) {
      return NextResponse.json(
        { error: 'Name, email, phone, and product name are required' },
        { status: 400 }
      );
    }

    let htmlContent = '';
    let filename = 'catalog';

    if (productSlug) {
      // Generate catalog for specific product
      const productResponse = await fetch(`http://localhost:3000/api/products/${productSlug}`);
      const productData = await productResponse.json();

      if (!productResponse.ok || !productData.product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }

      const product = productData.product;
      filename = `catalog-${productSlug}`;

      htmlContent = generateProductHTML(product, productData.category, productData.subCategory);
    } else if (categorySlug) {
      // Generate catalog for category
      const categoryResponse = await fetch(`http://localhost:3000/api/categories/${categorySlug}`);
      const categoryData = await categoryResponse.json();

      if (!categoryResponse.ok || !categoryData.category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }

      const category = categoryData.category;
      const subCategories = categoryData.subCategories;
      filename = `catalog-${categorySlug}`;

      htmlContent = generateCategoryHTML(category, subCategories);
    } else {
      return NextResponse.json(
        { error: 'Either productSlug or categorySlug must be provided' },
        { status: 400 }
      );
    }

    // Generate PDF from HTML using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();

    // Load the cover PDF
    const coverPdfPath = path.join(process.cwd(), 'public', 'sz.pdf');
    let coverPdfBytes: Uint8Array;

    try {
      coverPdfBytes = fs.readFileSync(coverPdfPath);
    } catch (error) {
      console.error('Cover PDF not found:', error);
      // If cover PDF doesn't exist, return the generated PDF directly
      return new NextResponse(Buffer.from(pdfBuffer), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename}.pdf"`
        }
      });
    }

    // Merge PDFs: cover first, then content
    const mergedPdf = await PDFDocument.create();
    const coverPdf = await PDFDocument.load(coverPdfBytes);
    const contentPdf = await PDFDocument.load(pdfBuffer);

    // Copy cover pages
    const coverPages = await mergedPdf.copyPages(coverPdf, coverPdf.getPageIndices());
    coverPages.forEach(page => mergedPdf.addPage(page));

    // Copy content pages
    const contentPages = await mergedPdf.copyPages(contentPdf, contentPdf.getPageIndices());
    contentPages.forEach(page => mergedPdf.addPage(page));

    const mergedPdfBytes = await mergedPdf.save();

    // Save contact info to database
    const { error: insertError } = await supabase
      .from('catalog_enquiries')
      .insert({
        name,
        email,
        phone,
        product_name: productName,
        product_slug: productSlug || null,
        category_slug: categorySlug || null,
        sub_category_slug: subCategorySlug || null,
        status: 'new'
      });

    if (insertError) {
      console.error('Error saving catalog enquiry:', insertError);
      // Don't fail the request if saving fails, just log it
    }

    return new NextResponse(Buffer.from(mergedPdfBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}.pdf"`
      }
    });

  } catch (error) {
    console.error('Error generating catalog:', error);
    return NextResponse.json(
      { error: 'Failed to generate catalog' },
      { status: 500 }
    );
  }
}

function generateProductHTML(product: any, category: any, subCategory: any): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Product Catalog - ${product.name}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 20px;
          background: white;
          color: #333;
          line-height: 1.4;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #8b5cf6;
        }
        .product-title {
          font-size: 28px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 10px;
        }
        .breadcrumb {
          color: #6b7280;
          font-size: 12px;
          margin-bottom: 20px;
        }
        .main-content {
          display: flex;
          gap: 30px;
          margin-bottom: 40px;
        }
        .left-section {
          flex: 1;
          text-align: center;
        }
        .product-image {
          width: 100%;
          max-width: 300px;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 15px;
        }
        .right-section {
          flex: 1;
        }
        .product-description {
          font-size: 14px;
          color: #374151;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .specs-section {
          margin-top: 40px;
        }
        .specs-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        .specs-table th {
          background: #8b5cf6;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: bold;
          border: 1px solid #e5e7eb;
        }
        .specs-table td {
          padding: 12px;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
        }
        .specs-table tr:nth-child(even) td {
          background: #f3f4f6;
        }
        .status {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 12px;
          margin: 10px 0;
        }
        .status.active {
          background: #dcfce7;
          color: #166534;
        }
        .status.inactive {
          background: #fee2e2;
          color: #991b1b;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 12px;
        }
        @media print {
          body { margin: 0; }
          .container { max-width: none; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="breadcrumb">
            Home > ${category?.name || 'Categories'} ${subCategory ? `> ${subCategory.name}` : ''} > ${product.name}
          </div>
          <h1 class="product-title">${product.name}</h1>
          <div class="status ${product.status === 'active' ? 'active' : 'inactive'}">
            ${product.status === 'active' ? 'Available' : 'Unavailable'}
          </div>
        </div>

        <div class="main-content">
          <div class="left-section">
            <img src="${product.image_url}" alt="${product.name}" class="product-image" />
            <h2 class="section-title">Product Image</h2>
          </div>

          <div class="right-section">
            <h2 class="section-title">Description</h2>
            <div class="product-description">
              ${product.description}
            </div>
          </div>
        </div>

        ${product.technical_specs && product.technical_specs.length > 0 ? `
          <div class="specs-section">
            <h2 class="section-title">Technical Specifications</h2>
            <table class="specs-table">
              <thead>
                <tr>
                  <th>Specification</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                ${product.technical_specs.map((spec: any) => `
                  <tr>
                    <td><strong>${spec.specification_key}</strong></td>
                    <td>${spec.specification_values.join(', ')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}

        <div class="footer">
          <p>Generated by Matrix India - Product Catalog</p>
          <p>For more information, visit our website or contact our sales team.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateCategoryHTML(category: any, subCategories: any[]): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Category Catalog - ${category.name}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 20px;
          background: white;
          color: #333;
          line-height: 1.4;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #8b5cf6;
        }
        .category-title {
          font-size: 28px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 10px;
        }
        .breadcrumb {
          color: #6b7280;
          font-size: 12px;
          margin-bottom: 20px;
        }
        .main-content {
          display: flex;
          gap: 30px;
          margin-bottom: 40px;
        }
        .left-section {
          flex: 1;
          text-align: center;
        }
        .category-image {
          width: 100%;
          max-width: 300px;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 15px;
        }
        .right-section {
          flex: 1;
        }
        .category-description {
          font-size: 14px;
          color: #374151;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .subcategories-section {
          margin-top: 40px;
        }
        .subcategory-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .subcategory-item {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 15px;
          background: #f9fafb;
        }
        .subcategory-image {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: 4px;
          margin-bottom: 10px;
        }
        .subcategory-name {
          font-size: 16px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 8px;
        }
        .subcategory-description {
          color: #6b7280;
          font-size: 12px;
          line-height: 1.4;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 12px;
        }
        @media print {
          body { margin: 0; }
          .container { max-width: none; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="breadcrumb">
            Home > ${category.name}
          </div>
          <h1 class="category-title">${category.name}</h1>
        </div>

        <div class="main-content">
          <div class="left-section">
            <img src="${category.image_url}" alt="${category.name}" class="category-image" />
            <h2 class="section-title">Category Image</h2>
          </div>

          <div class="right-section">
            <h2 class="section-title">Description</h2>
            <div class="category-description">
              ${category.description}
            </div>
          </div>
        </div>

        ${subCategories && subCategories.length > 0 ? `
          <div class="subcategories-section">
            <h2 class="section-title">Available Sub-Categories</h2>
            <div class="subcategory-grid">
              ${subCategories.map((sub: any) => `
                <div class="subcategory-item">
                  <img src="${sub.image_url}" alt="${sub.name}" class="subcategory-image" />
                  <div class="subcategory-name">${sub.name}</div>
                  <div class="subcategory-description">${sub.description}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="footer">
          <p>Generated by Matrix India - Category Catalog</p>
          <p>For more information, visit our website or contact our sales team.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}