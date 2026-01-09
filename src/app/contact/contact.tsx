'use client';

import { useState } from 'react';
import { MapPin, Clock, Mail, Phone, Send, CheckCircle } from 'lucide-react';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    country: '',
    message: '',
    captcha: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="bg-white">
      {/* Hero Section with Breadcrumb */}
      <div className="relative bg-gradient-to-r from-black via-zinc-900 to-black py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(30deg, #a855f7 12%, transparent 12.5%, transparent 87%, #a855f7 87.5%, #a855f7), linear-gradient(150deg, #a855f7 12%, transparent 12.5%, transparent 87%, #a855f7 87.5%, #a855f7)',
            backgroundSize: '40px 70px',
            backgroundPosition: '0 0, 20px 35px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <a href="/" className="text-purple-400 hover:text-purple-300 transition-colors">HOME</a>
            <span className="text-gray-500">/</span>
            <span className="text-cyan-400">CONTACT US</span>
          </div>
          
          {/* Title */}
          <h1 className="text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            CONTACT US
          </h1>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          
          {/* Our Address */}
          <div className="group">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 transition-colors duration-300">
                <MapPin className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">OUR ADDRESS</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Room 601, Block C, Huachuangda Cultural and Technological Industrial Park, Haihui Road, District 49th, Bao'an District, Shenzhen, Guangdong Province
                </p>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="group">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 transition-colors duration-300">
                <Clock className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">WORKING HOURS</h3>
                <p className="text-sm text-gray-600">Mon-Fri 08:00AM – 08:00PM</p>
                <p className="text-sm text-gray-600">Sat-Sun 09:00AM – 06:00PM</p>
              </div>
            </div>
          </div>

          {/* Have a Inquire */}
          <div className="group">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 transition-colors duration-300">
                <Mail className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">HAVE A INQUIRE?</h3>
                <a href="mailto:sales@szmatrix.com" className="text-sm text-cyan-600 hover:text-cyan-700 transition-colors">
                  sales@szmatrix.com
                </a>
                <h3 className="font-bold text-gray-900 text-lg mt-4 mb-2">TECHNICAL SUPPORT</h3>
                <a href="mailto:service@szmatrix.com" className="text-sm text-cyan-600 hover:text-cyan-700 transition-colors">
                  service@szmatrix.com
                </a>
              </div>
            </div>
          </div>

          {/* Call Us */}
          <div className="group">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 transition-colors duration-300">
                <Phone className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">CALL US</h3>
                <p className="text-sm text-gray-600 mb-1">(0086) 755 2838 4276</p>
                <p className="text-sm text-gray-600">(0086) 188 2652 2688</p>
              </div>
            </div>
          </div>

        </div>

        {/* Get In Touch Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Side - Professional Image */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-cyan-600/30 rounded-2xl blur-2xl group-hover:blur-xl transition-all duration-500"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80"
                alt="Customer Support"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-white text-2xl font-bold mb-2">We're Here to Help</h3>
                <p className="text-gray-300 text-sm">Our team of experts is ready to assist you with any questions or technical support needs.</p>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              GET IN TOUCH
            </h2>
            <p className="text-gray-600 mb-8">
              Contact Matrix Technical Support. Online, email, and phone support options for reaching technical experts across the globe.
            </p>

            <div className="space-y-4">
              {/* First and Last Name */}
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Email */}
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />

              {/* Subject */}
              <input
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />

              {/* Country Select */}
              <select
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-600"
              >
                <option value="">Select Country</option>
                <option value="us">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="cn">China</option>
                <option value="jp">Japan</option>
                <option value="de">Germany</option>
                <option value="in">India</option>
                <option value="other">Other</option>
              </select>

              {/* Message */}
              <textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              />

              {/* Captcha and Submit */}
              <div className="flex flex-wrap items-center gap-4">
                <input
                  type="text"
                  placeholder="1069"
                  value={formData.captcha}
                  onChange={(e) => handleChange('captcha', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all w-32"
                />
                <div className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg font-mono text-gray-700">
                  1069
                </div>
                
                {/* Success Message */}
                {isSubmitted && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-semibold">Success!</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="group flex items-center gap-3 px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/50"
              >
                <span>Submit Form</span>
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Map Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.95373631531654!3d-37.81720997975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b349649%3A0xb6899234e561db11!2sEnvato!5e0!3m2!1sen!2sau!4v1620000000000!5m2!1sen!2sau"
              width="100%"
              height="450"
              style={{ border: 0 }}
              loading="lazy"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}