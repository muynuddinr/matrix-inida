'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is the warranty period for NTRIX power supplies?",
      answer: "All NTRIX power supplies come with a comprehensive 2-year warranty covering manufacturing defects and hardware failures. Extended warranty options are also available for purchase."
    },
    {
      question: "Can I use NTRIX power supplies for laboratory research?",
      answer: "Yes, NTRIX power supplies are specifically designed for laboratory and research applications. They feature high precision, low noise operation, and are suitable for ATE and system integration industries."
    },
    {
      question: "What communication interfaces are supported?",
      answer: "Our power supplies support multiple communication interfaces including RS-232, USB, and RS-485, allowing for easy integration with automated test equipment and computer control systems."
    },
    {
      question: "How accurate are the voltage and current measurements?",
      answer: "NTRIX power supplies offer industry-leading accuracy with voltage resolution as fine as 0.1mV and current resolution of 1uA, depending on the model. Each unit is calibrated at the factory to ensure optimal performance."
    },
    {
      question: "Do you provide technical support and training?",
      answer: "Yes, we provide comprehensive technical support via phone, email, and online chat. We also offer training materials, user manuals, and video tutorials to help you get the most out of your NTRIX equipment."
    },
    {
      question: "Can I control multiple channels independently?",
      answer: "Yes, our multi-channel power supplies feature independent control for each channel, allowing you to set different voltage and current parameters. Channels can also be configured for series or parallel operation."
    },
    {
      question: "What safety features are included?",
      answer: "NTRIX power supplies include multiple protection features such as OVP (Over Voltage Protection), OCP (Over Current Protection), and OTP (Over Temperature Protection) to ensure safe operation and protect your equipment."
    },
    {
      question: "How do I place an order or request a quote?",
      answer: "You can request a quote by clicking the 'Get a Quote' button on our product pages, or contact our sales team directly via phone or email. We also have authorized distributors in over 80 countries worldwide."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative bg-gradient-to-b from-white to-gray-50 py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-sm lg:text-base">
            Find answers to common questions about our products and services
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-purple-300 transition-all duration-300 hover:shadow-lg"
            >
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="font-semibold text-gray-900 text-sm lg:text-base pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-purple-600 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 pt-0">
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}