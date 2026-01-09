'use client';

import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube, Instagram } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    products: [
      { name: 'DC Power Supply', href: '#' },
      { name: 'Programmable Power', href: '#' },
      { name: 'Linear Power Supply', href: '#' },
      { name: 'Multi-Channel Units', href: '#' },
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Our Story', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'News & Events', href: '#' },
    ],
    support: [
      { name: 'Documentation', href: '#' },
      { name: 'Technical Support', href: '#' },
      { name: 'Downloads', href: '#' },
      { name: 'Contact Us', href: '#' },
    ],
    resources: [
      { name: 'Blog', href: '#' },
      { name: 'Case Studies', href: '#' },
      { name: 'Whitepapers', href: '#' },
      { name: 'Videos', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ];

  return (
    <footer className="bg-gradient-to-b from-black to-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12 pb-12 border-b border-zinc-800">
          
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-1 mb-4">
              <div className="flex h-8">
                <div className="w-2 bg-gradient-to-b from-purple-500 to-purple-600 transform -skew-x-12"></div>
                <div className="w-2 bg-gradient-to-b from-red-500 to-red-600 transform -skew-x-12"></div>
                <div className="w-2 bg-gradient-to-b from-yellow-400 to-yellow-500 transform -skew-x-12"></div>
                <div className="w-2 bg-gradient-to-b from-blue-500 to-blue-600 transform -skew-x-12"></div>
              </div>
              <span className="text-2xl font-bold tracking-wider ml-1">NTRIX</span>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Leading manufacturer of precision power supply solutions for laboratory, industrial, and research applications worldwide.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400">
                  123 Tech Street, Innovation Park,<br />Silicon Valley, CA 94025, USA
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <span className="text-sm text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <span className="text-sm text-gray-400">info@ntrix.com</span>
              </div>
            </div>
          </div>

          {/* Products Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Products</h3>
            <ul className="space-y-2">
              {footerLinks.products.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-purple-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-purple-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-purple-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-purple-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Copyright */}
          <div className="text-sm text-gray-400 text-center md:text-left">
            © {currentYear} NTRIX. All rights reserved. | 
            <a href="#" className="hover:text-purple-400 transition-colors ml-1">Privacy Policy</a> | 
            <a href="#" className="hover:text-purple-400 transition-colors ml-1">Terms of Service</a>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-purple-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/50"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}