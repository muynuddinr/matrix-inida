'use client';

import { Award, Building2, Globe, TrendingUp, Users, BadgeCheck } from 'lucide-react';

export default function AboutUsPage() {
  const stats = [
    {
      icon: TrendingUp,
      number: '23+',
      label: 'YEARS OF EXPERIENCE',
      description: 'Founded in 2003, MATRIX TECHNOLOGY INC. is an innovative enterprise integrating R&D, production and sales.'
    },
    {
      icon: Globe,
      number: '80+',
      label: 'COUNTRIES',
      description: 'The products have been sold to more than 80 countries and regions all over the world and are highly recommended by the majority of users.'
    },
    {
      icon: BadgeCheck,
      number: '10+',
      label: 'CERTIFICATIONS',
      description: 'MATRIX has obtained CE, ROHS, KC and other authoritative certifications.'
    },
    {
      icon: Building2,
      number: '500+',
      label: 'EXHIBITION',
      description: 'MATRIX will continue to focus on the research and development of DC power supplies, keep providing users with more reliable, durable and stable products.'
    }
  ];

  const qualityBadges = [
    { icon: Award, label: '100% Innovative' },
    { icon: BadgeCheck, label: '100% R&D' }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section with Breadcrumb */}
      <div className="relative bg-gradient-to-r from-black via-zinc-900 to-black py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(30deg, #6366f1 12%, transparent 12.5%, transparent 87%, #6366f1 87.5%, #6366f1), linear-gradient(150deg, #6366f1 12%, transparent 12.5%, transparent 87%, #6366f1 87.5%, #6366f1)',
            backgroundSize: '40px 70px',
            backgroundPosition: '0 0, 20px 35px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <a href="/" className="text-purple-400 hover:text-purple-300 transition-colors">HOME</a>
            <span className="text-gray-500">/</span>
            <span className="text-white">ABOUT US</span>
          </div>
          
          {/* Title */}
          <h1 className="text-5xl lg:text-6xl font-bold text-white">ABOUT US</h1>
        </div>
      </div>

      {/* Company Building Image */}
      <div className="max-w-7xl mx-auto px-6 -mt-12">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80"
            alt="MATRIX Technology Building"
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
      </div>

      {/* Who We Are Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <div className="mb-12">
          <span className="text-purple-600 text-sm font-semibold tracking-widest uppercase">WHO WE ARE</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-8">
            MATRIX TECHNOLOGY INC.
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* The Process */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">THE PROCESS</h3>
            <p className="text-gray-600 leading-relaxed">
              Founded in 2003, MATRIX TECHNOLOGY INC. is an innovative enterprise integrating R&D, production and sales. Since its establishment, MATRIX has focused on the research and development and production of DC regulated power supplies.
            </p>
            <p className="text-gray-600 leading-relaxed">
              The products have been sold to more than 80 countries and regions all over the world, and are highly recommended by the majority of users. MATRIX will continue to focus on the research and development of DC power supplies, keep providing users with more reliable, durable and stable products.
            </p>
          </div>

          {/* Quality */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">QUALITY</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              MATRIX has obtained CE, ROHS, KC and other authoritative certifications.
            </p>
            
            <div className="flex gap-6">
              {qualityBadges.map((badge, index) => (
                <div key={index} className="flex items-center gap-3 px-6 py-4 bg-purple-50 rounded-lg border border-purple-100">
                  <badge.icon className="w-10 h-10 text-purple-600" />
                  <span className="font-semibold text-gray-900">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-xl p-8 border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                {/* Icon */}
                <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors duration-300">
                  <stat.icon className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors duration-300" />
                </div>

                {/* Number */}
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>

                {/* Label */}
                <div className="text-sm font-semibold text-purple-600 mb-3 tracking-wider">
                  {stat.label}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {stat.description}
                </p>

                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Logo Section */}
      <div className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center">
            <div className="bg-white rounded-2xl p-12 shadow-2xl">
              <div className="flex items-center gap-2">
                <div className="flex h-12">
                  <div className="w-3 bg-gradient-to-b from-purple-500 to-purple-600 transform -skew-x-12"></div>
                  <div className="w-3 bg-gradient-to-b from-red-500 to-red-600 transform -skew-x-12"></div>
                  <div className="w-3 bg-gradient-to-b from-yellow-400 to-yellow-500 transform -skew-x-12"></div>
                  <div className="w-3 bg-gradient-to-b from-blue-500 to-blue-600 transform -skew-x-12"></div>
                </div>
                <div className="ml-2">
                  <div className="text-3xl font-bold text-gray-900">NTRIX</div>
                  <div className="text-xs text-gray-600 tracking-wider">MATRIX TECHNOLOGY INC.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exhibition Photos */}
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12">
          OUR EXHIBITIONS & EVENTS
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
            <img
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80"
              alt="Exhibition 1"
              className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
              <div>
                <h3 className="text-white font-bold text-xl mb-2">International Tech Expo 2024</h3>
                <p className="text-gray-300 text-sm">Showcasing our latest innovations</p>
              </div>
            </div>
          </div>

          <div className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
            <img
              src="https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600&q=80"
              alt="Exhibition 2"
              className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
              <div>
                <h3 className="text-white font-bold text-xl mb-2">Global Power Summit 2024</h3>
                <p className="text-gray-300 text-sm">Meeting customers worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}