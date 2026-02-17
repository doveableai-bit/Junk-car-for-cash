
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { INITIAL_CONFIG, FAQ_DATA } from './constants';
import { SiteConfig, Testimonial, GalleryImage, FAQItem, SocialLink, TextSize } from './types';
import { supabase } from './supabaseClient';
import { toPng } from 'html-to-image';

// Components
import Header from './components/Header';
import Hero from './components/Hero';
import QuoteForm from './components/QuoteForm';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

/**
 * Enhanced Utility to scale typography based on device width.
 * Prevents "7xl" from breaking mobile screens.
 */
const getSizeClass = (size?: TextSize) => {
  if (!size) return 'text-base';
  const sizeMap: Record<string, string> = {
    'xs': 'text-[10px] md:text-xs',
    'sm': 'text-xs md:text-sm',
    'base': 'text-sm md:text-base',
    'lg': 'text-base md:text-lg',
    'xl': 'text-lg md:text-xl',
    '2xl': 'text-xl md:text-2xl',
    '3xl': 'text-2xl md:text-3xl',
    '4xl': 'text-3xl md:text-4xl',
    '5xl': 'text-3xl md:text-4xl lg:text-5xl',
    '6xl': 'text-4xl md:text-5xl lg:text-6xl',
    '7xl': 'text-5xl md:text-6xl lg:text-7xl'
  };
  return sizeMap[size] || 'text-base';
};

// --- Admin Editor Helper Components ---

const ContactFieldEditor = ({ title, valueField, colorField, sizeField, visibilityField, config, handleFieldChange, toggleVisibility }: {
  title: string; valueField: keyof SiteConfig; colorField: keyof SiteConfig; sizeField: keyof SiteConfig; 
  visibilityField: keyof SiteConfig; config: SiteConfig; handleFieldChange: any; toggleVisibility: any;
}) => {
  const isVisible = !!config[visibilityField];
  return (
    <div className={`bg-white p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border transition-all ${isVisible ? 'border-gray-100 shadow-sm' : 'border-red-100 bg-red-50/5 opacity-80'}`}>
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{title}</h4>
        <button 
          onClick={() => toggleVisibility(visibilityField, isVisible)}
          className={`w-12 h-6 rounded-full relative transition-all ${isVisible ? 'bg-green-600' : 'bg-gray-300'}`}
        >
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isVisible ? 'left-7' : 'left-1'}`}></div>
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-wider">Value</label>
          <input name={valueField as string} value={(config[valueField] as string) || ''} onChange={handleFieldChange} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-base outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-wider">Size</label>
            <select name={sizeField as string} value={(config[sizeField] as string) || 'base'} onChange={handleFieldChange} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black uppercase">
              {['xs','sm','base','lg','xl'].map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-wider">Color</label>
            <input type="color" name={colorField as string} value={(config[colorField] as string) || '#000000'} onChange={handleFieldChange} className="w-full h-11 rounded-xl border border-gray-100 p-0 bg-white cursor-pointer overflow-hidden" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ContextEditorCard = ({ title, textField, sizeField, colorField, config, handleFieldChange, isTextArea = false }: { 
  title: string; textField: keyof SiteConfig; sizeField: keyof SiteConfig; colorField: keyof SiteConfig; 
  config: SiteConfig; handleFieldChange: any; isTextArea?: boolean; 
}) => (
  <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-4 border border-gray-100 shadow-sm">
    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</h4>
    {isTextArea ? (
      <textarea name={textField as string} value={(config[textField] as string) || ''} onChange={handleFieldChange} rows={3} className="w-full p-4 bg-white border border-gray-200 rounded-xl font-bold text-base outline-none focus:ring-2 focus:ring-green-500" />
    ) : (
      <input name={textField as string} value={(config[textField] as string) || ''} onChange={handleFieldChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl font-bold text-base outline-none focus:ring-2 focus:ring-green-500" />
    )}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-wider">Size</label>
        <select name={sizeField as string} value={(config[sizeField] as string) || 'base'} onChange={handleFieldChange} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-black uppercase">
          {['xs','sm','base','lg','xl','2xl','3xl','4xl','5xl','6xl','7xl'].map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
        </select>
      </div>
      <div><label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-wider">Color</label><input type="color" name={colorField as string} value={(config[colorField] as string) || '#000000'} onChange={handleFieldChange} className="w-full h-11 rounded-lg border border-gray-200 p-0 bg-white cursor-pointer overflow-hidden" /></div>
    </div>
  </div>
);

const ButtonEditorCard = ({ title, textField, colorField, sizeField, shapeField, visibilityField, config, handleFieldChange, toggleVisibility }: { 
  title: string; textField: keyof SiteConfig; colorField: keyof SiteConfig; sizeField: keyof SiteConfig; 
  shapeField: keyof SiteConfig; visibilityField: keyof SiteConfig; config: SiteConfig; handleFieldChange: any; toggleVisibility: any;
}) => {
  const isVisible = !!config[visibilityField];
  return (
    <div className={`bg-white p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-lg border space-y-6 transition-all relative overflow-hidden ${isVisible ? 'border-gray-100 shadow-sm' : 'border-red-100 bg-red-50/10 grayscale-[0.5]'}`}>
       {!isVisible && (
         <div className="absolute top-2 right-2 sm:top-4 sm:right-8 bg-red-100 text-red-600 px-3 py-1 rounded-lg text-[8px] sm:text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
           Hidden
         </div>
       )}
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h4 className="text-sm font-black text-gray-900 uppercase tracking-tighter border-l-4 border-green-600 pl-4">{title}</h4>
          <div className="flex items-center gap-3">
            <span className={`text-[9px] font-black uppercase tracking-widest ${isVisible ? 'text-green-600' : 'text-gray-400'}`}>
              {isVisible ? 'ENABLED' : 'DISABLED'}
            </span>
            <button 
              onClick={() => toggleVisibility(visibilityField, isVisible)}
              className={`w-14 h-7 rounded-full transition-all relative ${isVisible ? 'bg-green-600' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${isVisible ? 'left-8 shadow-sm' : 'left-1'}`}></div>
            </button>
          </div>
       </div>
       <div className={`space-y-4 transition-opacity ${isVisible ? 'opacity-100' : 'opacity-60'}`}>
          <div className="bg-gray-50 p-4 rounded-xl">
             <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Display Text</label>
             <input name={textField as string} value={(config[textField] as string) || ''} onChange={handleFieldChange} disabled={!isVisible} className="w-full p-3 bg-white border border-gray-200 rounded-xl font-bold text-base outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50/50" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-gray-50 p-4 rounded-xl">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Color Theme</label>
                <div className="flex gap-2 items-center">
                  <input type="color" name={colorField as string} value={(config[colorField] as string) || '#16a34a'} onChange={handleFieldChange} disabled={!isVisible} className="w-10 h-10 rounded-lg cursor-pointer bg-white border border-gray-200 p-0.5 disabled:opacity-50" />
                  <span className="text-[10px] font-mono text-gray-500 uppercase">{(config[colorField] as string) || ''}</span>
                </div>
             </div>
             <div className="bg-gray-50 p-4 rounded-xl">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Shape</label>
                <select name={shapeField as string} value={(config[shapeField] as string) || 'rounded'} onChange={handleFieldChange} disabled={!isVisible} className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase disabled:bg-gray-50/50">
                  <option value="sharp">Sharp</option>
                  <option value="rounded">Rounded</option>
                  <option value="pill">Pill</option>
                </select>
             </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
             <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Scaling (Size)</label>
             <select name={sizeField as string} value={(config[sizeField] as string) || 'md'} onChange={handleFieldChange} disabled={!isVisible} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-black uppercase disabled:bg-gray-50/50">
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">X-Large</option>
             </select>
          </div>
       </div>
    </div>
  );
};

// --- Page Components ---

const HomePage = ({ config, testimonials, faqs }: { config: SiteConfig; testimonials: Testimonial[]; faqs: FAQItem[] }) => {
  const visibleKeywords = (config.seoKeywords || '').split(',').map(k => k.trim()).filter(k => k && !(config.hiddenKeywords || '').split(',').map(hk => hk.trim()).includes(k));

  return (
    <main id="home">
      <Hero config={config} />
      <section className="py-16 md:py-24 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className={`font-black uppercase tracking-tight mb-4 ${getSizeClass(config.homeSection1TitleSize)}`} style={{ color: config.homeSection1TitleColor }}>{config.homeSection1Title}</h2>
            <p className={`font-bold uppercase tracking-[0.05em] max-w-4xl mx-auto leading-relaxed ${getSizeClass(config.homeSection1SubSize)}`} style={{ color: config.homeSection1SubColor }}>{config.homeSection1Sub}</p>
            
            <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
              {visibleKeywords.map((kw, i) => (
                <span 
                  key={i} 
                  className={`font-black uppercase tracking-widest border px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all shadow-sm ${getSizeClass(config.keywordTextSize)}`}
                  style={{ color: config.keywordTextColor, borderColor: config.keywordBadgeColor, backgroundColor: config.keywordBgColor }}
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {(config.gallery || []).map((img) => (
              <div key={img.id} className="group bg-white p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all">
                <div className="aspect-square rounded-[1rem] sm:rounded-[2rem] overflow-hidden bg-gray-100"><img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /></div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-black uppercase text-gray-900 leading-tight">{img.title}</h3>
                  <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-2">{img.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <QuoteForm config={config} />
      <Testimonials testimonials={testimonials} config={config} />
      <section id="map" className="py-16 md:py-24 bg-white scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-12">
            <h2 className={`font-black uppercase tracking-tighter ${getSizeClass(config.mapSectionTitleSize)}`} style={{ color: config.mapSectionTitleColor }}>{config.mapSectionTitle}</h2>
            <p className={`font-bold uppercase tracking-[0.2em] mt-2 ${getSizeClass(config.mapSectionSubSize)}`} style={{ color: config.mapSectionSubColor }}>{config.mapSectionSub}</p>
          </div>
          <div className="w-full h-[350px] sm:h-[450px] md:h-[500px] rounded-[1.5rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border-[6px] sm:border-[12px] border-white ring-1 ring-gray-100 relative bg-gray-100">
            <iframe src={config.mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="Business Location" className="absolute inset-0 w-full h-full"></iframe>
          </div>
        </div>
      </section>
      <FAQ items={faqs} config={config} />
    </main>
  );
};

const AdminPanel = ({ config, setConfig, testimonials, setTestimonials, faqs, setFaqs }: { 
  config: SiteConfig; setConfig: (c: SiteConfig) => void; 
  testimonials: Testimonial[]; setTestimonials: (t: Testimonial[]) => void; 
  faqs: FAQItem[]; setFaqs: (f: FAQItem[]) => void; 
}) => {
  const [password, setPassword] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'leads' | 'branding' | 'content' | 'buttons' | 'contacts' | 'keywords' | 'seo' | 'gallery' | 'reviews' | 'faq'>('leads');
  const [isSaving, setIsSaving] = useState(false);
  const [newReview, setnewReview] = useState({ name: '', text: '', imageUrl: '', logoColor: '#16a34a' });
  const [newFAQ, setNewFAQ] = useState({ question: '', answer: '' });
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [newKeyword, setNewKeyword] = useState('');
  const [newSocial, setNewSocial] = useState<Partial<SocialLink>>({ platform: 'Facebook', url: '', isVisible: true });
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editingFaqId, setEditingFaqId] = useState<string | number | null>(null);
  
  const logoInput = useRef<HTMLInputElement>(null);
  const heroInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);
  const replaceInput = useRef<HTMLInputElement>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (isAuth) fetchLeads(); }, [isAuth]);

  const fetchLeads = async () => {
    try { const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false }); if (data) setLeads(data); } catch (e) { console.error(e); }
  };

  const saveConfig = async (updated: SiteConfig) => {
    setIsSaving(true);
    const configToSave = { ...updated };
    delete (configToSave as any).gallery; 
    await supabase.from('site_config').upsert({ id: 1, config: configToSave });
    setIsSaving(false);
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    if (type === 'checkbox') finalValue = (e.target as HTMLInputElement).checked;
    const updated = { ...config, [name]: finalValue };
    setConfig(updated);
    saveConfig(updated);
  };

  const toggleVisibility = (field: keyof SiteConfig, current: boolean) => {
    const updated = { ...config, [field]: !current };
    setConfig(updated);
    saveConfig(updated);
  };

  const addSocialLink = () => {
    if (!newSocial.url) return;
    const newLink: SocialLink = {
      id: Date.now().toString(),
      platform: newSocial.platform || 'Other',
      url: newSocial.url,
      isVisible: true,
      customIconUrl: newSocial.customIconUrl
    };
    const updated = { ...config, socialLinks: [...(config.socialLinks || []), newLink] };
    setConfig(updated);
    saveConfig(updated);
    setNewSocial({ platform: 'Facebook', url: '', isVisible: true });
  };

  const removeSocialLink = (id: string) => {
    const updated = { ...config, socialLinks: config.socialLinks.filter(l => l.id !== id) };
    setConfig(updated);
    saveConfig(updated);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'logo' | 'hero' | 'gallery' | 'replace') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      if (target === 'gallery') {
        const id = Date.now().toString();
        const { error } = await supabase.from('gallery').insert([{ id, url: base64, title: 'Job Site', description: 'Milwaukee' }]);
        if (!error) {
          const updatedGallery = [{ id, url: base64, title: 'Job Site', desc: 'Milwaukee' }, ...config.gallery];
          setConfig({ ...config, gallery: updatedGallery });
        }
      } else if (target === 'replace' && replacingId) {
        const { error } = await supabase.from('gallery').update({ url: base64 }).eq('id', replacingId);
        if (!error) {
          const updatedGallery = config.gallery.map(g => g.id === replacingId ? { ...g, url: base64 } : g);
          setConfig({ ...config, gallery: updatedGallery });
        }
        setReplacingId(null);
      } else {
        const u = target === 'logo' ? { ...config, logo: base64 } : { ...config, heroImage: base64 };
        setConfig(u);
        saveConfig(u);
      }
    };
    reader.readAsDataURL(file);
  };

  // --- REVIEWS LOGIC ---
  const addReview = async () => { 
    if (!newReview.name || !newReview.text) return;
    const { data } = await supabase.from('testimonials').insert([{ 
      name: newReview.name, 
      text: newReview.text, 
      image_url: newReview.imageUrl,
      logo_color: newReview.logoColor,
      date: new Date().toISOString() 
    }]).select(); 
    if (data) { 
      const mapped = {
        id: data[0].id,
        name: data[0].name,
        text: data[0].text,
        imageUrl: data[0].image_url,
        logoColor: data[0].logo_color,
        date: data[0].date
      };
      setTestimonials([mapped, ...testimonials]); 
      setnewReview({ name: '', text: '', imageUrl: '', logoColor: '#16a34a' }); 
    } 
  };

  const deleteReview = async (id: string) => {
    if (confirm('Delete review?')) {
      await supabase.from('testimonials').delete().eq('id', id);
      setTestimonials(testimonials.filter(t => t.id !== id));
    }
  };

  const updateReview = async (id: string, name: string, text: string, imageUrl: string, logoColor: string) => {
    const { error } = await supabase.from('testimonials').update({ 
      name, 
      text, 
      image_url: imageUrl, 
      logo_color: logoColor 
    }).eq('id', id);
    if (!error) {
      setTestimonials(testimonials.map(t => t.id === id ? { ...t, name, text, imageUrl, logoColor } : t));
      setEditingReviewId(null);
    }
  };

  // --- FAQ LOGIC ---
  const addFAQ = async () => { 
    if (!newFAQ.question || !newFAQ.answer) return;
    const { data } = await supabase.from('faqs').insert([{ question: newFAQ.question, answer: newFAQ.answer }]).select(); 
    if (data) { 
      setFaqs([...faqs, data[0]]); 
      setNewFAQ({ question: '', answer: '' }); 
    } 
  };

  const deleteFAQ = async (id: string | number) => {
    if (confirm('Delete FAQ permanently?')) {
      await supabase.from('faqs').delete().eq('id', id);
      setFaqs(faqs.filter(f => f.id !== id));
    }
  };

  const updateFAQ = async (id: string | number, question: string, answer: string) => {
    setIsSaving(true);
    const { error } = await supabase.from('faqs').update({ question, answer }).eq('id', id);
    if (!error) {
      const updatedFaqs = faqs.map(f => f.id === id ? { ...f, question, answer } : f);
      setFaqs(updatedFaqs);
      setEditingFaqId(null);
    }
    setIsSaving(false);
  };

  const downloadReceipt = async () => {
    if (receiptRef.current && selectedLead) {
      try {
        const dataUrl = await toPng(receiptRef.current, { backgroundColor: '#ffffff', cacheBust: true, style: { fontFamily: 'sans-serif' } });
        const link = document.createElement('a');
        link.download = `receipt-${selectedLead.form_number}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) { alert("Receipt generation failed."); }
    }
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
        <div className="max-w-md w-full bg-white p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] shadow-2xl text-center">
          <h2 className="text-2xl sm:text-3xl font-black mb-8 uppercase tracking-tighter">Milwaukee <span className="text-green-600">HQ</span></h2>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-5 bg-gray-100 rounded-2xl text-center text-3xl font-black mb-6 border-none focus:ring-2 focus:ring-green-600 outline-none" placeholder="••••••" onKeyDown={e => e.key === 'Enter' && password === '4626716' && setIsAuth(true)} />
          <button onClick={() => password === '4626716' ? setIsAuth(true) : alert('Incorrect Code')} className="w-full bg-green-600 text-white py-5 rounded-2xl font-black uppercase shadow-xl hover:bg-green-700 transition-all">Unlock Panel</button>
        </div>
      </div>
    );
  }

  const navTabs = [
    { id: 'leads', label: 'FORMS' }, 
    { id: 'branding', label: 'IDENTITY' }, 
    { id: 'content', label: 'CONTEXT' }, 
    { id: 'buttons', label: 'BUTTONS' }, 
    { id: 'contacts', label: 'CONTACTS' }, 
    { id: 'keywords', label: 'KEYWORDS' },
    { id: 'seo', label: 'SCHEMA' },
    { id: 'gallery', label: 'GALLERY' },
    { id: 'reviews', label: 'REVIEWS' }, 
    { id: 'faq', label: 'FAQ' },
  ] as const;

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-[1600px]">
        {/* HEADER NAVIGATION - STICKY-LIKE BEHAVIOR FOR MOBILE TABS */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 sm:mb-12 bg-white p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4 lg:mb-0">
             <div className={`w-3 h-3 rounded-full ${isSaving ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
             <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter">ADMIN <span className="text-green-600">HQ</span></h2>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-xl sm:rounded-2xl overflow-x-auto gap-1 shadow-inner max-w-full no-scrollbar">
            {navTabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2.5 rounded-lg sm:rounded-xl font-black uppercase text-[9px] sm:text-[10px] tracking-widest transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-green-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-800'}`}>{t.label}</button>
            ))}
          </div>
        </div>

        {/* FAQ TAB */}
        {activeTab === 'faq' && (
          <div className="animate-fade-in space-y-8 sm:space-y-12">
             <div className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] shadow-xl border border-gray-100 space-y-6 sm:space-y-8">
                <div className="flex justify-between items-center border-b pb-4 sm:pb-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight">Add New FAQ</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Updates homepage instantly</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-gray-50 p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-gray-100">
                   <div className="space-y-4">
                      <div>
                        <label className="text-[9px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Question</label>
                        <input placeholder="e.g. Do you provide cash today?" value={newFAQ.question} onChange={e => setNewFAQ({...newFAQ, question: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 font-black text-sm outline-none focus:ring-2 focus:ring-green-500 bg-white" />
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div>
                        <label className="text-[9px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Answer</label>
                        <textarea placeholder="Write the answer..." value={newFAQ.answer} onChange={e => setNewFAQ({...newFAQ, answer: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 font-medium text-sm outline-none focus:ring-2 focus:ring-green-500 bg-white" rows={2} />
                      </div>
                   </div>
                   <div className="md:col-span-2">
                     <button onClick={addFAQ} className="w-full bg-green-600 text-white py-4 rounded-xl font-black uppercase text-xs shadow-lg hover:bg-green-700 transition-all tracking-widest">Post New FAQ</button>
                   </div>
                </div>
             </div>

             <div className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] shadow-xl border border-gray-100 space-y-6 sm:space-y-8">
                <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight">Manage Site FAQ</h3>
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                   {faqs.map(f => {
                     const isEditing = editingFaqId === f.id;
                     return (
                       <div key={f.id} className={`p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border transition-all ${isEditing ? 'border-green-600 bg-green-50/10 ring-2 ring-green-100' : 'border-gray-100 bg-white shadow-sm'}`}>
                         {isEditing ? (
                           <div className="space-y-4 sm:space-y-6">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                               <div>
                                  <label className="text-[9px] font-black text-green-600 uppercase mb-1 block tracking-widest">Question</label>
                                  <input id={`edit-q-${f.id}`} defaultValue={f.question} className="w-full p-4 bg-white border border-green-200 rounded-xl font-black text-sm outline-none" />
                               </div>
                               <div>
                                  <label className="text-[9px] font-black text-green-600 uppercase mb-1 block tracking-widest">Answer</label>
                                  <textarea id={`edit-a-${f.id}`} defaultValue={f.answer} className="w-full p-4 bg-white border border-green-200 rounded-xl font-medium text-sm outline-none" rows={3} />
                               </div>
                             </div>
                             <div className="flex flex-col sm:flex-row gap-3">
                               <button onClick={() => {
                                   const qInput = document.getElementById(`edit-q-${f.id}`) as HTMLInputElement;
                                   const aInput = document.getElementById(`edit-a-${f.id}`) as HTMLTextAreaElement;
                                   updateFAQ(f.id!, qInput.value, aInput.value);
                                 }} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-black uppercase text-xs shadow-lg tracking-widest">SAVE & SYNC</button>
                               <button onClick={() => setEditingFaqId(null)} className="px-8 bg-gray-200 text-gray-700 py-3 rounded-xl font-black uppercase text-xs">CANCEL</button>
                             </div>
                           </div>
                         ) : (
                           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                             <div className="flex-1">
                               <p className="font-black text-sm text-gray-900 uppercase tracking-tight mb-1">{f.question}</p>
                               <p className="text-xs text-gray-500 font-medium line-clamp-2 italic">{f.answer}</p>
                             </div>
                             <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                               <button onClick={() => setEditingFaqId(f.id!)} className="flex-1 sm:flex-none flex items-center justify-center p-3 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Edit Question">
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                 <span className="sm:hidden ml-2 font-black text-[9px] uppercase">Edit</span>
                               </button>
                               <button onClick={() => deleteFAQ(f.id!)} className="flex-1 sm:flex-none flex items-center justify-center p-3 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Remove Question">
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                 <span className="sm:hidden ml-2 font-black text-[9px] uppercase">Delete</span>
                               </button>
                             </div>
                           </div>
                         )}
                       </div>
                     );
                   })}
                </div>
             </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="animate-fade-in space-y-8 sm:space-y-12">
             <div className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] shadow-xl border border-gray-100 space-y-6 sm:space-y-8">
                <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight">Post New Review</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-gray-50 p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-gray-100">
                   <div className="space-y-4">
                      <div>
                        <label className="text-[9px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Customer Name</label>
                        <input placeholder="e.g. John D." value={newReview.name} onChange={e => setnewReview({...newReview, name: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 font-bold outline-none focus:ring-2 focus:ring-green-500 bg-white text-base" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-[9px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Logo Color</label>
                            <input type="color" value={newReview.logoColor} onChange={e => setnewReview({...newReview, logoColor: e.target.value})} className="w-full h-12 rounded-xl border border-gray-200 p-1 bg-white cursor-pointer overflow-hidden" />
                         </div>
                         <div>
                            <label className="text-[9px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Avatar URL</label>
                            <input placeholder="https://..." value={newReview.imageUrl} onChange={e => setnewReview({...newReview, imageUrl: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 font-bold outline-none focus:ring-2 focus:ring-green-500 bg-white text-[10px]" />
                         </div>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div>
                        <label className="text-[9px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Review Content</label>
                        <textarea placeholder="Write review..." value={newReview.text} onChange={e => setnewReview({...newReview, text: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 font-medium outline-none focus:ring-2 focus:ring-green-500 bg-white text-base" rows={4} />
                      </div>
                   </div>
                   <div className="md:col-span-2">
                     <button onClick={addReview} className="w-full bg-green-600 text-white py-4 rounded-xl font-black uppercase text-xs shadow-lg hover:bg-green-700 transition-all tracking-widest">Publish Review</button>
                   </div>
                </div>
             </div>

             <div className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] shadow-xl border border-gray-100 space-y-6 sm:space-y-8">
                <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight">Manage Reviews</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                   {testimonials.map(t => {
                     const isEditing = editingReviewId === t.id;
                     return (
                       <div key={t.id} className={`p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] border transition-all ${isEditing ? 'border-blue-500 ring-2 ring-blue-100 bg-blue-50/10' : 'border-gray-100 bg-white shadow-sm hover:shadow-md'}`}>
                         {isEditing ? (
                           <div className="space-y-4">
                             <input id={`edit-name-${t.id}`} defaultValue={t.name} className="w-full p-3 bg-white border border-blue-200 rounded-xl font-black uppercase text-xs outline-none" placeholder="Name" />
                             <div className="grid grid-cols-2 gap-3">
                                <input type="color" id={`edit-color-${t.id}`} defaultValue={t.logoColor || '#16a34a'} className="w-full h-10 rounded-xl border border-blue-200 p-1 bg-white cursor-pointer overflow-hidden" />
                                <input id={`edit-url-${t.id}`} defaultValue={t.imageUrl || ''} className="w-full p-3 bg-white border border-blue-200 rounded-xl font-bold text-[10px]" placeholder="Image URL" />
                             </div>
                             <textarea id={`edit-text-${t.id}`} defaultValue={t.text} className="w-full p-3 bg-white border border-blue-200 rounded-xl font-medium text-xs outline-none" rows={4} placeholder="Content" />
                             <div className="grid grid-cols-2 gap-3 pt-2">
                               <button onClick={() => {
                                   const nameInput = document.getElementById(`edit-name-${t.id}`) as HTMLInputElement;
                                   const textInput = document.getElementById(`edit-text-${t.id}`) as HTMLTextAreaElement;
                                   const urlInput = document.getElementById(`edit-url-${t.id}`) as HTMLInputElement;
                                   const colorInput = document.getElementById(`edit-color-${t.id}`) as HTMLInputElement;
                                   updateReview(t.id, nameInput.value, textInput.value, urlInput.value, colorInput.value);
                                 }} className="bg-blue-600 text-white py-2 rounded-xl text-[10px] font-black uppercase shadow-lg">Save</button>
                               <button onClick={() => setEditingReviewId(null)} className="bg-gray-200 text-gray-700 py-2 rounded-xl text-[10px] font-black uppercase">Cancel</button>
                             </div>
                           </div>
                         ) : (
                           <div className="flex flex-col h-full">
                             <div className="flex justify-between items-start mb-4">
                               <div className="flex items-center gap-3">
                                 <div 
                                    className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-black text-sm uppercase shadow-sm"
                                    style={{ backgroundColor: t.logoColor || '#16a34a' }}
                                 >
                                    {t.name?.[0] || 'U'}
                                 </div>
                                 <div>
                                   <p className="font-black text-sm uppercase text-gray-900 leading-none">{t.name}</p>
                                   <div className="flex gap-0.5 mt-1">
                                      {[...Array(5)].map((_, i) => <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full"></div>)}
                                   </div>
                                 </div>
                               </div>
                               <div className="flex gap-2">
                                 <button onClick={() => setEditingReviewId(t.id)} className="p-2 bg-gray-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                                 <button onClick={() => deleteReview(t.id)} className="p-2 bg-gray-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                               </div>
                             </div>
                             <p className="text-xs text-gray-500 font-medium italic mb-4 line-clamp-4 flex-grow">"{t.text}"</p>
                             <div className="text-[8px] font-black text-gray-300 uppercase tracking-widest pt-3 border-t border-gray-50">Posted {new Date(t.date).toLocaleDateString()}</div>
                           </div>
                         )}
                       </div>
                     );
                   })}
                </div>
             </div>
          </div>
        )}

        {/* FORMS / LEADS TAB */}
        {activeTab === 'leads' && (
          <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl border overflow-hidden animate-fade-in border-gray-100">
             <div className="p-4 sm:p-8 border-b bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
               <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight">Lead Database</h3>
               <button onClick={fetchLeads} className="w-full sm:w-auto text-[10px] font-black bg-white px-6 py-2.5 border rounded-lg hover:bg-gray-100 uppercase tracking-widest shadow-sm">Refresh Leads</button>
             </div>
             <div className="overflow-x-auto no-scrollbar">
               <table className="w-full text-left min-w-[1000px] md:min-w-[1200px]">
                 <thead className="bg-gray-100 text-[10px] font-black uppercase text-gray-400">
                   <tr>
                     <th className="px-6 py-5">Date</th><th className="px-6 py-5">Form ID</th><th className="px-6 py-5">Customer</th><th className="px-6 py-5">Phone</th><th className="px-6 py-5">Vehicle</th><th className="px-6 py-5 text-right">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {leads.map((l) => (
                     <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                       <td className="px-6 py-5 text-[11px] font-bold">{new Date(l.created_at).toLocaleDateString()}</td>
                       <td className="px-6 py-5 text-[11px] font-black text-green-700">{l.form_number}</td>
                       <td className="px-6 py-5 font-black uppercase text-[11px]">{l.first_name} {l.last_name}</td>
                       <td className="px-6 py-5 text-green-600 font-black text-[11px]">{l.phone}</td>
                       <td className="px-6 py-5 font-black text-[11px] uppercase">{l.year} {l.make} {l.model}</td>
                       <td className="px-6 py-5 text-right"><button onClick={() => setSelectedLead(l)} className="bg-green-600 text-white px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-green-700 transition-all">Receipt</button></td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}
        
        {/* Identity Tab */}
        {activeTab === 'branding' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 animate-fade-in">
             <div className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] shadow-xl border border-gray-100">
                <h3 className="text-lg sm:text-xl font-black uppercase border-l-4 border-green-600 pl-4 mb-8 tracking-tighter">Business Identity</h3>
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="bg-gray-50 p-4 sm:p-6 rounded-2xl mb-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Part {n}</label>
                    <div className="flex gap-3 sm:gap-4">
                      <input name={`businessNamePart${n}`} value={(config as any)[`businessNamePart${n}`] || ''} onChange={handleFieldChange} className="flex-1 p-3 sm:p-4 bg-white border border-gray-200 rounded-xl font-black uppercase text-sm sm:text-base outline-none focus:ring-2 focus:ring-green-500" />
                      <input type="color" name={`businessNameColor${n}`} value={(config as any)[`businessNameColor${n}`] || '#000000'} onChange={handleFieldChange} className="w-12 h-12 rounded-lg cursor-pointer overflow-hidden bg-white border border-gray-200 p-1" />
                    </div>
                  </div>
                ))}
             </div>
             <div className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] shadow-xl border border-gray-100">
                <h3 className="text-lg sm:text-xl font-black uppercase border-l-4 border-green-600 pl-4 mb-8 tracking-tighter">Brand Assets</h3>
                <div className="p-8 sm:p-12 bg-gray-50 rounded-[2rem] text-center border-2 border-dashed border-gray-200">
                    <button onClick={() => logoInput.current?.click()} className="bg-green-600 text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-green-700 transition-all">Upload New Logo</button>
                    <input type="file" ref={logoInput} className="hidden" onChange={e => handleUpload(e, 'logo')} />
                    {config.logo ? (
                      <div className="mt-8 p-4 bg-white rounded-2xl shadow-sm inline-block max-w-full">
                        <img src={config.logo} className="h-20 sm:h-24 mx-auto object-contain" alt="Current Logo" />
                      </div>
                    ) : (
                      <p className="mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">No logo uploaded yet</p>
                    )}
                </div>
             </div>
          </div>
        )}
      </div>

      {/* RECEIPT MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto animate-fade-in">
           <div className="bg-white w-full max-w-2xl rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 my-auto">
              <div className="p-4 border-b flex justify-end bg-gray-50 print:hidden">
                 <button onClick={() => setSelectedLead(null)} className="p-3 bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-xl transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <div className="p-8 sm:p-12 bg-white" ref={receiptRef}>
                 <div className="flex justify-between items-start mb-10">
                   <h4 className="font-black uppercase text-lg sm:text-xl tracking-tighter text-green-600">OFFICIAL QUOTE: {selectedLead.form_number}</h4>
                   <span className="text-[10px] font-black text-gray-400 uppercase border px-2 py-1 rounded">MKE BRANCH</span>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 text-xs sm:text-sm font-bold text-gray-900 uppercase">
                    <div className="space-y-4">
                       <div className="border-l-4 border-green-500 pl-4 py-1">
                          <label className="text-[9px] text-gray-400 block mb-0.5">CUSTOMER</label>
                          {selectedLead.first_name} {selectedLead.last_name}
                       </div>
                       <div className="border-l-4 border-green-500 pl-4 py-1">
                          <label className="text-[9px] text-gray-400 block mb-0.5">PHONE</label>
                          {selectedLead.phone}
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="border-l-4 border-blue-500 pl-4 py-1">
                          <label className="text-[9px] text-gray-400 block mb-0.5">VEHICLE</label>
                          {selectedLead.year} {selectedLead.make} {selectedLead.model}
                       </div>
                       <div className="border-l-4 border-blue-500 pl-4 py-1">
                          <label className="text-[9px] text-gray-400 block mb-0.5">CONDITION</label>
                          {selectedLead.condition}
                       </div>
                    </div>
                 </div>
                 <div className="mt-12 pt-8 border-t-2 border-dashed border-gray-100 text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status: PENDING REVIEW BY APPRAISAL TEAM</p>
                 </div>
              </div>
              <div className="p-6 sm:p-8 bg-gray-50 border-t flex flex-col sm:flex-row gap-4 print:hidden">
                <button onClick={downloadReceipt} className="flex-1 bg-green-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-green-700 transition-all">Download Receipt Image</button>
                <button onClick={() => window.print()} className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-black transition-all">Print Record</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [config, setConfig] = useState<SiteConfig>(INITIAL_CONFIG);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEverything = async () => {
      try {
        const { data: configRow } = await supabase.from('site_config').select('config').eq('id', 1).single();
        const { data: galleryRows } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
        const { data: reviewRows } = await supabase.from('testimonials').select('*').order('date', { ascending: false });
        const { data: faqRows } = await supabase.from('faqs').select('*').order('id', { ascending: true });

        let mergedConfig = { ...INITIAL_CONFIG };
        if (configRow?.config) mergedConfig = { ...mergedConfig, ...configRow.config };
        if (galleryRows?.length) {
          mergedConfig.gallery = galleryRows.map(g => ({ id: g.id, url: g.url, title: g.title || 'Job Site', desc: g.description || 'Milwaukee' }));
        }

        setConfig(mergedConfig);
        if (reviewRows) {
          setTestimonials(reviewRows.map(r => ({
            id: r.id,
            name: r.name,
            text: r.text,
            imageUrl: r.image_url,
            logoColor: r.logo_color,
            date: r.date
          })));
        }
        if (faqRows?.length) setFaqs(faqRows); else setFaqs(FAQ_DATA);
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };
    fetchEverything();
  }, []);

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white font-black uppercase tracking-[0.4em] p-6 text-center">
      <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-8"></div>
      <div className="text-sm sm:text-base">Syncing Milwaukee Cloud...</div>
    </div>
  );

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header config={config} />
        <Routes>
          <Route path="/" element={<HomePage config={config} testimonials={testimonials} faqs={faqs} />} />
          <Route path="/admin" element={<AdminPanel config={config} setConfig={setConfig} testimonials={testimonials} setTestimonials={setTestimonials} faqs={faqs} setFaqs={setFaqs} />} />
        </Routes>
        <Footer config={config} />
      </div>
    </Router>
  );
};

export default App;
