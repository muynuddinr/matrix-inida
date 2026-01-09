'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, Shield, Award, TrendingUp } from 'lucide-react';

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "MPS-1000 SERIES",
      subtitle: "HIGH PRECISION PROGRAMMABLE",
      highlight: "DC POWER SUPPLY",
      features: [
        "Resolution: Voltage 0.1mV, current 1uA",
        "Waveform curve display function",
        "List sequence output function",
        "Battery charging function",
        "Resistance measurement function",
        "Suitable for ATE, system integration industry"
      ],
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80",
      stats: [
        { number: "80+", label: "countries have been sold" },
        { number: "23", label: "years of experience" }
      ]
    },
    {
      title: "WPS-4300",
      subtitle: "RELIABLE SMART PROGRAMMABLE",
      highlight: "DC POWER SUPPLY",
      features: [
        "Resolution: Voltage 1mV, Current 0.1mA",
        "List Sequence: Output function supported",
        "Communication: RS-232/USB/RS-485 compatible",
        "Storage & Lock: 100 groups storage + key lock function",
        "Safety: OVP/OCP/OTP protection equipped",
        "Suitable for ATE, system integration industry"
      ],
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80",
      stats: [
        { number: "80+", label: "countries have been sold" },
        { number: "23", label: "years of experience" }
      ]
    },
    {
      title: "MPS-300 SERIES",
      subtitle: "PROGRAMMABLE",
      highlight: "DC POWER SUPPLY",
      features: [
        "Resolution: Voltage 1mV, current 0.1mA, power 1mW",
        "List sequence output function",
        "Battery charging function",
        "Adjustable upward slope",
        "External triggering function",
        "Suitable for ATE, system integration industry"
      ],
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80",
      stats: [
        { number: "80+", label: "countries have been sold" },
        { number: "23", label: "years of experience" }
      ]
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative bg-black overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Content */}
          <div className="space-y-6 animate-in fade-in slide-in-from-left duration-700">
            {/* Title */}
            <div className="space-y-3">
              <div className="inline-block">
                <span className="text-purple-400 text-xs font-semibold tracking-widest uppercase px-3 py-1.5 bg-purple-400/10 rounded-full border border-purple-400/20">
                  New Release
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
                <span className="block text-white">{slides[currentSlide].title}</span>
                <span className="block text-purple-400 mt-1">
                  {slides[currentSlide].subtitle}
                </span>
                <span className="block text-white mt-1">{slides[currentSlide].highlight}</span>
              </h1>
            </div>

            {/* Features */}
            <div className="space-y-2">
              {slides[currentSlide].features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-2 text-gray-300 group hover:text-white transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mt-1.5 flex-shrink-0">
                    <div className="w-1 h-1 rounded-full bg-purple-500 group-hover:w-1.5 group-hover:h-1.5 transition-all duration-300"></div>
                  </div>
                  <span className="text-xs lg:text-sm">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <button className="group relative px-6 py-3 bg-purple-600 rounded-lg font-semibold text-white text-sm overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50">
                <span className="relative z-10 flex items-center gap-2">
                  Get an Quote
                  <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 pt-4 border-t border-zinc-800">
              {slides[currentSlide].stats.map((stat, index) => (
                <div key={index} className="space-y-0.5">
                  <div className="text-2xl lg:text-3xl font-bold text-purple-400">
                    {stat.number}
                  </div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Image/Product */}
          <div className="relative animate-in fade-in slide-in-from-right duration-700 delay-300">
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-purple-600/20 rounded-xl blur-2xl group-hover:blur-xl transition-all duration-500"></div>
              
              {/* Image Container */}
              <div className="relative bg-zinc-900/50 backdrop-blur-sm rounded-xl p-4 border border-zinc-800 overflow-hidden">
                <img 
                  src={slides[currentSlide].image}
                  alt="Product"
                  className="w-full h-auto rounded-lg shadow-xl transform group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Floating Icons */}
                <div className="absolute top-4 right-4 space-y-2">
                  {[Shield, Award, TrendingUp].map((Icon, index) => (
                    <div 
                      key={index}
                      className="w-8 h-8 bg-purple-500/20 backdrop-blur-md rounded-lg flex items-center justify-center border border-purple-500/30 hover:scale-110 transition-transform duration-300 cursor-pointer"
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      <Icon className="w-4 h-4 text-purple-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute top-1/2 transform -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none">
          <button 
            onClick={prevSlide}
            className="pointer-events-auto w-10 h-10 rounded-full bg-zinc-900/80 backdrop-blur-md border border-zinc-800 flex items-center justify-center text-white hover:bg-purple-600 hover:border-purple-500 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={nextSlide}
            className="pointer-events-auto w-10 h-10 rounded-full bg-zinc-900/80 backdrop-blur-md border border-zinc-800 flex items-center justify-center text-white hover:bg-purple-600 hover:border-purple-500 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-8 bg-purple-500' 
                  : 'w-1 bg-zinc-700 hover:bg-zinc-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}