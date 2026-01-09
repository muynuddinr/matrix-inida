'use client';

import { Play } from 'lucide-react';

export default function ProductShowcase() {
  return (
    <section className="relative bg-black py-16 lg:py-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Image */}
          <div className="relative group">
            {/* Glow effect behind image */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-2xl blur-2xl group-hover:blur-xl transition-all duration-500"></div>
            
            {/* Image Container */}
            <div className="relative bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-8 border border-zinc-800 overflow-hidden">
              {/* Blue digital background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-blue-800/30 to-transparent">
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59, 130, 246, 0.3) 2px, rgba(59, 130, 246, 0.3) 4px)',
                  backgroundSize: '100% 4px'
                }}></div>
              </div>
              
              {/* Product Image */}
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80"
                  alt="MPS-H-3 Series Power Supply"
                  className="w-full h-auto rounded-lg shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Decorative corner elements */}
              <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-blue-500/50 rounded-tl-lg"></div>
              <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-purple-500/50 rounded-br-lg"></div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-6">
            {/* Title */}
            <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
              MPS-H-3 SERIES TRIPPLE CHANNEL DC LINEAR POWER SUPPLY
            </h2>

            {/* Features List */}
            <div className="space-y-3">
              {[
                "Current and voltage can be set to adjust in a certain range;",
                "Direct display of voltage and current in series and parallel mode;",
                "Can save last time output data and last time output status;",
                "Optional USB, RS-232, RS-485 interface;",
                "Channel 1 and channel 2 are independent switch control;",
                "Four digits display, 10mV/1mA resolution;"
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 text-gray-300 group/item hover:text-white transition-colors duration-300"
                >
                  <span className="text-purple-400 font-bold mt-1">{index + 1}.</span>
                  <span className="text-sm lg:text-base">{feature}</span>
                </div>
              ))}
            </div>

            {/* Watch Now Button */}
            <div className="pt-4">
              <button className="group/btn flex items-center gap-3 px-8 py-4 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold text-black transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50">
                <Play className="w-5 h-5 fill-current" />
                <span>Watch Now</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}