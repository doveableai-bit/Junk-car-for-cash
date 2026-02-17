
import React, { useState } from 'react';
import { FAQItem, SiteConfig, TextSize } from '../types';

interface FAQProps {
  items: FAQItem[];
  config: SiteConfig;
}

const getSizeClass = (size: TextSize) => {
  return {
    xs: 'text-xs', sm: 'text-sm', base: 'text-base', lg: 'text-lg', xl: 'text-xl',
    '2xl': 'text-2xl', '3xl': 'text-3xl', '4xl': 'text-4xl', '5xl': 'text-5xl',
    '6xl': 'text-6xl', '7xl': 'text-7xl'
  }[size] || 'text-base';
};

const FAQ: React.FC<FAQProps> = ({ items, config }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const btnSizeClasses = {
    sm: 'px-6 py-2.5 text-xs', md: 'px-8 py-3 text-base', lg: 'px-10 py-4 text-xl', xl: 'px-12 py-5 text-2xl font-black'
  }[config.faqCallButtonSize || 'lg'];

  const btnShapeClasses = {
    sharp: 'rounded-none', rounded: 'rounded-xl', pill: 'rounded-full'
  }[config.faqCallButtonShape || 'rounded'];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": { "@type": "Answer", "text": item.answer }
    }))
  };

  return (
    <section id="faq" className="py-24 bg-gray-900 text-white scroll-mt-20">
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 
              className={`font-extrabold mb-4 uppercase tracking-tight ${getSizeClass(config.faqSectionTitleSize)}`}
              style={{ color: config.faqSectionTitleColor }}
            >
              {config.faqSectionTitle}
            </h2>
            <p 
              className={`font-medium ${getSizeClass(config.faqSectionSubSize)}`}
              style={{ color: config.faqSectionSubColor }}
            >
              {config.faqSectionSub}
            </p>
          </div>

          <div className="space-y-4">
            {items.map((item, idx) => (
              <div key={idx} className={`border-b border-gray-800 transition-all ${openIndex === idx ? 'bg-gray-800/30' : ''}`}>
                <button onClick={() => setOpenIndex(openIndex === idx ? null : idx)} className="w-full flex items-center justify-between py-6 px-4 text-left focus:outline-none">
                  <span className="text-lg font-bold pr-8">{item.question}</span>
                  <svg className={`w-6 h-6 transform transition-transform ${openIndex === idx ? 'rotate-180 text-green-500' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openIndex === idx ? 'max-h-96 pb-6 px-4' : 'max-h-0'}`}>
                  <p className="text-gray-400 text-lg leading-relaxed">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center bg-gray-800 p-8 rounded-2xl border border-gray-700">
            <h4 className="text-2xl font-bold mb-4">Still have questions?</h4>
            <p className="text-gray-400 mb-6 text-lg">Our Milwaukee team is available 24/7 to help you.</p>
            {config.showFaqCallButton && (
              <a 
                href={`tel:${config.faqCallButtonText.replace(/\D/g,'')}`}
                style={{ backgroundColor: config.faqCallButtonColor }}
                className={`inline-flex items-center space-x-3 text-white ${btnSizeClasses} ${btnShapeClasses} font-black transition-all hover:brightness-110 shadow-lg`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <span>{config.faqCallButtonText}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
