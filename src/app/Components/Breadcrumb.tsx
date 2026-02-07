'use client';

import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 mb-6 text-sm">
      <Link href="/" className="text-blue-600 hover:underline">
        Home
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <span className="text-gray-400">/</span>
          {index === items.length - 1 ? (
            <span className="text-gray-600 font-semibold">{item.label}</span>
          ) : (
            <Link href={item.href} className="text-blue-600 hover:underline">
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
