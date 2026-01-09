'use client';

import { useState, useEffect } from 'react';

export default function CustomersSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const customers = [
    // Row 1
    [
      { name: 'V-TOL Aerospace', logo: 'https://via.placeholder.com/150x60/666/fff?text=V-TOL' },
      { name: 'WashU', logo: 'https://via.placeholder.com/150x60/666/fff?text=WashU' },
      { name: '3M', logo: 'https://via.placeholder.com/150x60/E60000/fff?text=3M' },
      { name: 'Philips', logo: 'https://via.placeholder.com/150x60/0E5FD8/fff?text=PHILIPS' },
    ],
    // Row 2
    [
      { name: 'Harvard', logo: 'https://via.placeholder.com/150x60/A51C30/fff?text=HARVARD' },
      { name: 'Apple', logo: 'https://via.placeholder.com/150x60/000/fff?text=Apple' },
      { name: 'Tesla', logo: 'https://via.placeholder.com/150x60/E82127/fff?text=TESLA' },
      { name: 'Michigan State', logo: 'https://via.placeholder.com/150x60/18453B/fff?text=MSU' },
    ],
    // Row 3
    [
      { name: 'IBM', logo: 'https://via.placeholder.com/150x60/006699/fff?text=IBM' },
      { name: 'Amazon', logo: 'https://via.placeholder.com/150x60/FF9900/000?text=amazon' },
      { name: 'BYD', logo: 'https://via.placeholder.com/150x60/E60000/fff?text=BYD' },
      { name: 'Toyota', logo: 'https://via.placeholder.com/150x60/EB0A1E/fff?text=TOYOTA' },
    ],
    // Row 4
    [
      { name: 'Panasonic', logo: 'https://via.placeholder.com/150x60/0058A8/fff?text=Panasonic' },
      { name: 'Lincoln Laboratory', logo: 'https://via.placeholder.com/150x60/003D7A/fff?text=MIT+Lincoln' },
      { name: 'Lockheed Martin', logo: 'https://via.placeholder.com/150x60/003D7A/fff?text=Lockheed' },
      { name: 'Georgia Tech', logo: 'https://via.placeholder.com/150x60/B3A369/000?text=GT' },
    ],
  ];

  return (
    <section className="relative bg-white py-12 lg:py-16 overflow-hidden">
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className={`text-center mb-8 lg:mb-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block mb-2">
            <span className="text-purple-600 text-xs font-semibold tracking-widest uppercase">
              WHAT'S NEW
            </span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            MATRIX'S CUSTOMERS
          </h2>
        </div>

        {/* Customer Logos Grid */}
        <div className="space-y-6 lg:space-y-8">
          {customers.map((row, rowIndex) => (
            <div 
              key={rowIndex}
              className={`grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 transition-all duration-700 delay-${rowIndex * 100}`}
              style={{ 
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: `${rowIndex * 150}ms`
              }}
            >
              {row.map((customer, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-lg p-4 lg:p-6 flex items-center justify-center border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:shadow-xl hover:shadow-purple-100 hover:-translate-y-1"
                >
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                  
                  {/* Logo */}
                  <div className="relative z-10 w-full h-12 flex items-center justify-center">
                    <img
                      src={customer.logo}
                      alt={customer.name}
                      className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300 opacity-60 group-hover:opacity-100"
                    />
                  </div>

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom decoration */}
        <div className="mt-10 text-center">
          <p className="text-gray-500 text-xs">
            Trusted by leading organizations worldwide
          </p>
        </div>
      </div>
    </section>
  );
}