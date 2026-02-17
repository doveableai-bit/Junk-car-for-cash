
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { SiteConfig, TextSize } from '../types';
import { junkCarService } from '../services/geminiService';

interface QuoteFormProps {
  config: SiteConfig;
}

const getSizeClass = (size: TextSize) => {
  return {
    xs: 'text-xs', sm: 'text-sm', base: 'text-base', lg: 'text-lg', xl: 'text-xl',
    '2xl': 'text-2xl', '3xl': 'text-3xl', '4xl': 'text-4xl', '5xl': 'text-5xl',
    '6xl': 'text-6xl', '7xl': 'text-7xl'
  }[size] || 'text-base';
};

const QuoteForm: React.FC<QuoteFormProps> = ({ config }) => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '', email: '',
    make: '', model: '', year: '', condition: 'Non-Running',
    titleStatus: 'Clean Title', address: '', message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedId, setGeneratedId] = useState('');
  const [valuation, setValuation] = useState<{ range: string; explanation: string } | null>(null);
  const [isValuating, setIsValuating] = useState(false);

  const btnSizeClasses = {
    sm: 'py-3 text-sm', md: 'py-4 text-base', lg: 'py-5 text-xl', xl: 'py-6 text-2xl font-black'
  }[config.quoteButtonSize || 'lg'];

  const btnShapeClasses = {
    sharp: 'rounded-none', rounded: 'rounded-2xl', pill: 'rounded-full'
  }[config.quoteButtonShape || 'rounded'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGetEstimate = async () => {
    if (!formData.make || !formData.model || !formData.year) {
      alert("Please enter Year, Make, and Model first!");
      return;
    }
    setIsValuating(true);
    const result = await junkCarService.estimateValue({
      year: formData.year,
      make: formData.make,
      model: formData.model,
      condition: formData.condition
    });
    setValuation(result);
    setIsValuating(false);
  };

  const generateFormNumber = () => {
    const words = ['CJK', 'KAUL', 'MKE', 'CASH', 'SALV', 'JUNK'];
    const word = words[Math.floor(Math.random() * words.length)];
    const now = new Date();
    let hour = now.getHours();
    hour = hour % 12 || 12; 
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${word}${hour}${day}${month}${now.getFullYear()}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return alert("ERROR: API Key Missing.");
    setIsSubmitting(true);
    const formNumber = generateFormNumber();
    setGeneratedId(formNumber);
    try {
      const { error } = await supabase.from('leads').insert([{
        first_name: formData.firstName, last_name: formData.lastName,
        phone: formData.phone, email: formData.email,
        make: formData.make, model: formData.model, year: formData.year,
        condition: formData.condition, title_status: formData.titleStatus,
        address: formData.address, message: formData.message,
        form_number: formNumber, status: 'New'
      }]);
      if (error) throw error;
      setIsSubmitted(true);
      window.scrollTo({ top: (document.getElementById('quote')?.offsetTop || 0) - 100, behavior: 'smooth' });
    } catch (error: any) {
      alert(`SUBMISSION FAILED!\n\nReason: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const allKeywords = (config.seoKeywords || '').split(',').map(k => k.trim()).filter(Boolean);
  const hiddenKeywords = (config.hiddenKeywords || '').split(',').map(k => k.trim()).filter(Boolean);
  const visibleKeywords = allKeywords.filter(k => !hiddenKeywords.includes(k)).slice(0, 10);

  if (isSubmitted) {
    return (
      <section id="quote" className="py-24 bg-gray-50 scroll-mt-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto bg-white p-12 rounded-[3rem] shadow-2xl border-4 border-green-500 animate-fade-in">
            <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg></div>
            <h3 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Offer Requested!</h3>
            <div className="bg-green-50 text-green-800 font-black px-4 py-2 rounded-xl inline-block mb-6 uppercase text-xs tracking-widest">ID: {generatedId}</div>
            <p className="text-gray-600 text-lg font-medium mb-8">Success {formData.firstName}! We've received your details and will call you at {formData.phone} shortly.</p>
            <button onClick={() => setIsSubmitted(false)} className="bg-green-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-xl">Submit Another Vehicle</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="quote" className="py-24 bg-gray-50 scroll-mt-32">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="lg:sticky lg:top-32">
            <h2 
              className={`font-black uppercase leading-tight tracking-tighter mb-6 ${getSizeClass(config.quoteSectionTitleSize)}`}
              style={{ color: config.quoteSectionTitleColor }}
            >
              {config.quoteSectionTitle}
            </h2>
            <div className="mb-10">
              <p 
                className={`mb-6 font-medium ${getSizeClass(config.quoteSectionSubSize)}`}
                style={{ color: config.quoteSectionSubColor }}
              >
                {config.quoteSectionSub}
              </p>
              <div className="flex flex-wrap gap-2 py-4 border-y border-gray-100 mb-8">
                {visibleKeywords.map((kw, i) => (
                  <span 
                    key={i} 
                    className={`border font-black uppercase px-3 py-1.5 rounded-xl shadow-sm transition-all cursor-default ${getSizeClass(config.keywordTextSize)}`}
                    style={{ 
                        color: config.keywordTextColor, 
                        borderColor: config.keywordBadgeColor,
                        backgroundColor: config.keywordBgColor || '#ffffff'
                    }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
            
            {valuation && (
              <div className="mb-10 bg-green-600 p-8 rounded-[2rem] text-white shadow-2xl animate-fade-in border-4 border-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white text-green-600 p-1.5 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">AI Market Analysis</span>
                </div>
                <h4 className="text-3xl font-black uppercase tracking-tighter mb-2">{valuation.range}</h4>
                <p className="text-sm font-bold opacity-90 leading-relaxed">{valuation.explanation}</p>
                <div className="mt-4 pt-4 border-t border-white/20 text-[9px] font-black uppercase tracking-widest opacity-60">Estimated values based on current Milwaukee scrap market rates</div>
              </div>
            )}

            <div className="space-y-6">
              {[
                { t: "No Hassle Selling", d: "Experience the easiest way to get rid of your car with zero stress. We handle everything." },
                { t: "Fastest Cash Payouts", d: "Once we confirm the quote in the panel, we dispatch a driver immediately." },
                { t: "Free Junk Car Removal", d: "The quote you see is the cash you get. Free towing included with every purchase." }
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="bg-green-600 text-white p-1 rounded-lg mt-1 shadow-md"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg></div>
                  <div><h4 className="text-lg font-black text-gray-900 uppercase tracking-tight">{item.t}</h4><p className="text-gray-500 font-medium text-sm">{item.d}</p></div>
                </div>
              ))}
            </div>
          </div>

          <form id="quote-form-actual" onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 relative overflow-hidden scroll-mt-24">
            <div className="absolute top-0 right-0 bg-green-600 text-[10px] font-black text-white px-4 py-1.5 rounded-bl-xl uppercase tracking-widest shadow-lg">No Hassle Junk Car Sales</div>
            <h3 className="text-xl font-black text-gray-900 mb-6 uppercase border-b pb-4">Contact Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input required name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-500 font-bold" />
              <input required name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-500 font-bold" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input required type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-500 font-black text-green-600" />
              <input name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-500 font-bold" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mt-8 mb-6 uppercase border-b pb-4">Vehicle Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input required name="year" placeholder="Year" value={formData.year} onChange={handleInputChange} className="w-full px-4 py-4 bg-gray-50 border-none rounded-xl font-bold" />
              <input required name="make" placeholder="Make" value={formData.make} onChange={handleInputChange} className="w-full px-4 py-4 bg-gray-50 border-none rounded-xl font-bold" />
              <input required name="model" placeholder="Model" value={formData.model} onChange={handleInputChange} className="w-full px-4 py-4 bg-gray-50 border-none rounded-xl font-bold" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <select name="condition" value={formData.condition} onChange={handleInputChange} className="w-full px-4 py-4 bg-gray-50 border-none rounded-xl font-bold"><option>Running</option><option>Non-Running</option><option>Wrecked</option><option>Scrap Metal</option></select>
              <select name="titleStatus" value={formData.titleStatus} onChange={handleInputChange} className="w-full px-4 py-4 bg-gray-50 border-none rounded-xl font-bold"><option>Clean Title</option><option>Lost Title</option><option>No Title</option></select>
            </div>
            <input required name="address" placeholder="Pickup Location (e.g. Milwaukee, WI)" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-4 bg-gray-50 border-none rounded-xl mb-6 font-bold" />
            
            <button 
              type="button"
              onClick={handleGetEstimate}
              disabled={isValuating}
              className="w-full mb-4 bg-gray-900 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2"
            >
              {isValuating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              )}
              {isValuating ? 'Calculating Market Value...' : 'Get Instant Market Value'}
            </button>

            {config.showQuoteButton && (
              <button 
                type="submit" disabled={isSubmitting}
                style={{ backgroundColor: config.quoteButtonColor }}
                className={`w-full text-white ${btnSizeClasses} ${btnShapeClasses} font-black shadow-xl hover:brightness-110 transition-all uppercase tracking-widest disabled:opacity-50 transform hover:-translate-y-1 active:scale-95`}
              >
                {isSubmitting ? 'SECURELY SENDING...' : config.quoteButtonText}
              </button>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default QuoteForm;
