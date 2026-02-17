
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

const getSizeClass = (size?: TextSize) => {
  if (!size) return 'text-base';
  return {
    xs: 'text-xs', sm: 'text-sm', base: 'text-base', lg: 'text-lg', xl: 'text-xl',
    '2xl': 'text-2xl', '3xl': 'text-3xl', '4xl': 'text-4xl', '5xl': 'text-5xl',
    '6xl': 'text-6xl', '7xl': 'text-7xl'
  }[size] || 'text-base';
};

// --- Admin Sub-Components ---

const ContactFieldEditor = ({ title, valueField, colorField, sizeField, visibilityField, config, handleFieldChange, toggleVisibility }: {
  title: string; valueField: keyof SiteConfig; colorField: keyof SiteConfig; sizeField: keyof SiteConfig; 
  visibilityField: keyof SiteConfig; config: SiteConfig; handleFieldChange: any; toggleVisibility: any;
}) => {
  const isVisible = !!config[visibilityField];
  return (
    <div className={`bg-white p-6 rounded-[2rem] border transition-all ${isVisible ? 'border-gray-100 shadow-sm' : 'border-red-100 bg-red-50/5 opacity-80'}`}>
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{title}</h4>
        <button 
          onClick={() => toggleVisibility(visibilityField, isVisible)}
          className={`w-12 h-6 rounded-full relative transition-all ${isVisible ? 'bg-green-600' : 'bg-gray-300'}`}
        >
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isVisible ? 'left-7' : 'left-1'}`}></div>
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Value</label>
          <input name={valueField as string} value={(config[valueField] as string) || ''} onChange={handleFieldChange} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Text Size</label>
            <select name={sizeField as string} value={(config[sizeField] as string) || 'base'} onChange={handleFieldChange} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black uppercase">
              {['xs','sm','base','lg','xl'].map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Text Color</label>
            <input type="color" name={colorField as string} value={(config[colorField] as string) || '#000000'} onChange={handleFieldChange} className="w-full h-11 rounded-xl border border-gray-100 p-0 bg-white cursor-pointer" />
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
  <div className="bg-gray-50 p-6 rounded-3xl space-y-4 border border-gray-100 shadow-sm">
    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">{title}</h4>
    {isTextArea ? (
      <textarea name={textField as string} value={(config[textField] as string) || ''} onChange={handleFieldChange} rows={3} className="w-full p-4 bg-white border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-green-500" />
    ) : (
      <input name={textField as string} value={(config[textField] as string) || ''} onChange={handleFieldChange} className="w-full p-4 bg-white border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-green-500" />
    )}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Size</label>
        <select name={sizeField as string} value={(config[sizeField] as string) || 'base'} onChange={handleFieldChange} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-black uppercase">
          {['xs','sm','base','lg','xl','2xl','3xl','4xl','5xl','6xl','7xl'].map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
        </select>
      </div>
      <div><label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Color</label><input type="color" name={colorField as string} value={(config[colorField] as string) || '#000000'} onChange={handleFieldChange} className="w-full h-11 rounded-lg border border-gray-200 p-0 bg-white cursor-pointer" /></div>
    </div>
  </div>
);

const ButtonEditorCard = ({ title, textField, colorField, sizeField, shapeField, visibilityField, config, handleFieldChange, toggleVisibility }: { 
  title: string; textField: keyof SiteConfig; colorField: keyof SiteConfig; sizeField: keyof SiteConfig; 
  shapeField: keyof SiteConfig; visibilityField: keyof SiteConfig; config: SiteConfig; handleFieldChange: any; toggleVisibility: any;
}) => {
  const isVisible = !!config[visibilityField];
  return (
    <div className={`bg-white p-8 rounded-[2.5rem] shadow-lg border space-y-6 transition-all relative overflow-hidden ${isVisible ? 'border-gray-100 shadow-sm' : 'border-red-100 bg-red-50/10 grayscale-[0.5]'}`}>
       {!isVisible && (
         <div className="absolute top-4 right-8 bg-red-100 text-red-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
           Currently Hidden
         </div>
       )}
       <div className="flex justify-between items-center">
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
          <div className="bg-gray-50 p-4 rounded-2xl">
             <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Display Text</label>
             <input name={textField as string} value={(config[textField] as string) || ''} onChange={handleFieldChange} disabled={!isVisible} className="w-full p-3 bg-white border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50/50" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-gray-50 p-4 rounded-2xl">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Color Theme</label>
                <div className="flex gap-2 items-center">
                  <input type="color" name={colorField as string} value={(config[colorField] as string) || '#16a34a'} onChange={handleFieldChange} disabled={!isVisible} className="w-10 h-10 rounded-lg cursor-pointer bg-white border border-gray-200 p-0.5 disabled:opacity-50" />
                  <span className="text-[10px] font-mono text-gray-500 uppercase">{(config[colorField] as string) || ''}</span>
                </div>
             </div>
             <div className="bg-gray-50 p-4 rounded-2xl">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Button Shape</label>
                <select name={shapeField as string} value={(config[shapeField] as string) || 'rounded'} onChange={handleFieldChange} disabled={!isVisible} className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase disabled:bg-gray-50/50">
                  <option value="sharp">Sharp (Square)</option>
                  <option value="rounded">Rounded (Soft)</option>
                  <option value="pill">Pill (Circle)</option>
                </select>
             </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl">
             <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Button Scaling (Size)</label>
             <select name={sizeField as string} value={(config[sizeField] as string) || 'md'} onChange={handleFieldChange} disabled={!isVisible} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-black uppercase disabled:bg-gray-50/50">
                <option value="sm">Small (Compact)</option>
                <option value="md">Medium (Standard)</option>
                <option value="lg">Large (Emphasis)</option>
                <option value="xl">X-Large (Hero Only)</option>
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
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`font-black uppercase tracking-tight mb-4 ${getSizeClass(config.homeSection1TitleSize)}`} style={{ color: config.homeSection1TitleColor }}>{config.homeSection1Title}</h2>
            <p className={`font-bold uppercase tracking-[0.05em] max-w-4xl mx-auto leading-relaxed ${getSizeClass(config.homeSection1SubSize)}`} style={{ color: config.homeSection1SubColor }}>{config.homeSection1Sub}</p>
            
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {visibleKeywords.map((kw, i) => (
                <span 
                  key={i} 
                  className={`font-black uppercase tracking-widest border px-3 py-2 rounded-xl transition-all shadow-sm ${getSizeClass(config.keywordTextSize)}`}
                  style={{ color: config.keywordTextColor, borderColor: config.keywordBadgeColor, backgroundColor: config.keywordBgColor }}
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {(config.gallery || []).map((img) => (
              <div key={img.id} className="group bg-white p-4 rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all">
                <div className="aspect-square rounded-[2rem] overflow-hidden bg-gray-100"><img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /></div>
                <div className="p-6">
                  <h3 className="text-xl font-black uppercase text-gray-900">{img.title}</h3>
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">{img.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <QuoteForm config={config} />
      <Testimonials testimonials={testimonials} config={config} />
      <section id="map" className="py-24 bg-white scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`font-black uppercase tracking-tighter ${getSizeClass(config.mapSectionTitleSize)}`} style={{ color: config.mapSectionTitleColor }}>{config.mapSectionTitle}</h2>
            <p className={`font-bold uppercase tracking-[0.2em] mt-2 ${getSizeClass(config.mapSectionSubSize)}`} style={{ color: config.mapSectionSubColor }}>{config.mapSectionSub}</p>
          </div>
          <div className="w-full h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white ring-1 ring-gray-100 relative bg-gray-100">
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
  const [newReview, setnewReview] = useState({ name: '', text: '' });
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

  const updateSocialLink = (id: string, field: keyof SocialLink, value: any) => {
    const updatedLinks = config.socialLinks.map(l => l.id === id ? { ...l, [field]: value } : l);
    const updated = { ...config, socialLinks: updatedLinks };
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

  const addKeyword = () => {
    if (!newKeyword.trim()) return;
    const current = (config.seoKeywords || '').split(',').map(k => k.trim()).filter(Boolean);
    if (current.includes(newKeyword.trim())) return;
    const updatedStr = [...current, newKeyword.trim()].join(', ');
    const updated = { ...config, seoKeywords: updatedStr };
    setConfig(updated);
    saveConfig(updated);
    setNewKeyword('');
  };

  const removeKeyword = (kw: string) => {
    const current = (config.seoKeywords || '').split(',').map(k => k.trim()).filter(Boolean);
    const updatedStr = current.filter(k => k !== kw).join(', ');
    const updated = { ...config, seoKeywords: updatedStr };
    setConfig(updated);
    saveConfig(updated);
  };

  const toggleKeywordVisibility = (kw: string) => {
    const hidden = (config.hiddenKeywords || '').split(',').map(k => k.trim()).filter(Boolean);
    let newHidden;
    if (hidden.includes(kw)) {
      newHidden = hidden.filter(k => k !== kw).join(', ');
    } else {
      newHidden = [...hidden, kw].join(', ');
    }
    const updated = { ...config, hiddenKeywords: newHidden };
    setConfig(updated);
    saveConfig(updated);
  };

  const deletePhoto = async (id: string) => {
    if (confirm('Delete photo permanently?')) {
      await supabase.from('gallery').delete().eq('id', id);
      setConfig({ ...config, gallery: (config.gallery || []).filter(g => g.id !== id) });
    }
  };

  const updateGalleryText = async (id: string, field: 'title' | 'desc', value: string) => {
    const updatedGallery = (config.gallery || []).map(img => img.id === id ? { ...img, [field]: value } : img);
    setConfig({ ...config, gallery: updatedGallery });
    const dbField = field === 'desc' ? 'description' : 'title';
    await supabase.from('gallery').update({ [dbField]: value }).eq('id', id);
  };

  const addReview = async () => { 
    if (!newReview.name || !newReview.text) return;
    const { data, error } = await supabase.from('testimonials').insert([{ name: newReview.name, text: newReview.text, date: new Date().toISOString() }]).select(); 
    if (data) { setTestimonials([data[0], ...testimonials]); setnewReview({ name: '', text: '' }); } 
  };

  const deleteReview = async (id: string) => {
    if (confirm('Delete review?')) {
      await supabase.from('testimonials').delete().eq('id', id);
      setTestimonials(testimonials.filter(t => t.id !== id));
    }
  };

  const updateReview = async (id: string, name: string, text: string) => {
    const { error } = await supabase.from('testimonials').update({ name, text }).eq('id', id);
    if (!error) {
      setTestimonials(testimonials.map(t => t.id === id ? { ...t, name, text } : t));
      setEditingReviewId(null);
    }
  };

  const addFAQ = async () => { 
    if (!newFAQ.question || !newFAQ.answer) return;
    const { data, error } = await supabase.from('faqs').insert([{ question: newFAQ.question, answer: newFAQ.answer }]).select(); 
    if (data) { setFaqs([...faqs, data[0]]); setNewFAQ({ question: '', answer: '' }); } 
  };

  const deleteFAQ = async (id: string | number) => {
    if (confirm('Delete FAQ permanently?')) {
      await supabase.from('faqs').delete().eq('id', id);
      setFaqs(faqs.filter(f => f.id !== id));
    }
  };

  const updateFAQ = async (id: string | number, question: string, answer: string) => {
    const { error } = await supabase.from('faqs').update({ question, answer }).eq('id', id);
    if (!error) {
      setFaqs(faqs.map(f => f.id === id ? { ...f, question, answer } : f));
      setEditingFaqId(null);
    }
  };

  const downloadReceipt = async () => {
    if (receiptRef.current && selectedLead) {
      try {
        const dataUrl = await toPng(receiptRef.current, { 
          backgroundColor: '#ffffff',
          cacheBust: true,
          style: { fontFamily: 'sans-serif' }
        });
        const link = document.createElement('a');
        link.download = `receipt-${selectedLead.form_number}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) { 
        console.error("Receipt error:", err);
        alert("Could not generate image. Please try printing instead.");
      }
    }
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 p-6">
        <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl text-center">
          <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter">Milwaukee HQ</h2>
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

  const fullBusinessName = `${config.businessNamePart1 || ''} ${config.businessNamePart2 || ''} ${config.businessNamePart3 || ''} ${config.businessNamePart4 || ''}`.trim().toUpperCase();

  const allKeywords = (config.seoKeywords || '').split(',').map(k => k.trim()).filter(Boolean);
  const hiddenKeywordsArray = (config.hiddenKeywords || '').split(',').map(k => k.trim()).filter(Boolean);
  const visibleKeywordsArray = allKeywords.filter(k => !hiddenKeywordsArray.includes(k));

  return (
    <div className="min-h-screen pt-32 pb-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-[1600px]">
        {/* TAB NAVIGATION */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-12 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
             <div className={`w-3 h-3 rounded-full ${isSaving ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
             <h2 className="text-3xl font-black uppercase tracking-tighter">MILWAUKEE <span className="text-green-600">HQ</span></h2>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-2xl mt-6 lg:mt-0 overflow-x-auto gap-1 shadow-inner max-w-full">
            {navTabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-green-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-800'}`}>{t.label}</button>
            ))}
          </div>
        </div>

        {/* FORMS / LEADS TAB */}
        {activeTab === 'leads' && (
          <div className="bg-white rounded-[2.5rem] shadow-xl border overflow-hidden animate-fade-in border-gray-100">
             <div className="p-8 border-b bg-gray-50 flex justify-between items-center">
               <h3 className="text-xl font-black uppercase tracking-tight">Lead Database Master Log</h3>
               <button onClick={fetchLeads} className="text-xs font-black bg-white px-4 py-2 border rounded-lg hover:bg-gray-100 transition-colors">Refresh Records</button>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left min-w-[2200px]">
                 <thead className="bg-gray-100 text-[10px] font-black uppercase text-gray-400">
                   <tr>
                     <th className="px-6 py-5">Date</th>
                     <th className="px-6 py-5">Time</th>
                     <th className="px-6 py-5">Form ID</th>
                     <th className="px-6 py-5">First Name</th>
                     <th className="px-6 py-5">Last Name</th>
                     <th className="px-6 py-5">Phone</th>
                     <th className="px-6 py-5">Email</th>
                     <th className="px-6 py-5">Year</th>
                     <th className="px-6 py-5">Make</th>
                     <th className="px-6 py-5">Model</th>
                     <th className="px-6 py-5">Condition</th>
                     <th className="px-6 py-5">Title</th>
                     <th className="px-6 py-5">Pickup Loc.</th>
                     <th className="px-6 py-5 text-center">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {leads.map((l) => (
                     <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                       <td className="px-6 py-5 text-[11px] text-gray-500 font-bold whitespace-nowrap">{new Date(l.created_at).toLocaleDateString()}</td>
                       <td className="px-6 py-5 text-[11px] text-gray-500 font-bold whitespace-nowrap">{new Date(l.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</td>
                       <td className="px-6 py-5 text-[11px] font-black text-green-700">{l.form_number}</td>
                       <td className="px-6 py-5 font-black uppercase text-[11px]">{l.first_name}</td>
                       <td className="px-6 py-5 font-black uppercase text-[11px]">{l.last_name}</td>
                       <td className="px-6 py-5 text-green-600 font-black text-[11px]">{l.phone}</td>
                       <td className="px-6 py-5 text-gray-400 font-bold text-[11px] lowercase">{l.email || '—'}</td>
                       <td className="px-6 py-5 font-black text-[11px] text-gray-900">{l.year}</td>
                       <td className="px-6 py-5 font-black uppercase text-[11px] text-gray-900">{l.make}</td>
                       <td className="px-6 py-5 font-black uppercase text-[11px] text-gray-900">{l.model}</td>
                       <td className="px-6 py-5 font-bold text-[10px] uppercase">
                          <span className={`px-2 py-1 rounded-md ${l.condition === 'Running' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {l.condition}
                          </span>
                       </td>
                       <td className="px-6 py-5 font-bold text-[10px] uppercase text-blue-600">{l.title_status}</td>
                       <td className="px-6 py-5 text-[11px] text-gray-500 uppercase font-bold truncate max-w-[250px]">{l.address}</td>
                       <td className="px-6 py-5 text-center">
                         <button onClick={() => setSelectedLead(l)} className="bg-green-600 text-white px-6 py-2 rounded-xl text-[10px] font-black shadow-md hover:bg-green-700 transition-all">GENERATE RECEIPT</button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {/* IDENTITY TAB */}
        {activeTab === 'branding' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
             <div className="bg-white p-10 rounded-[3rem] shadow-xl space-y-8 border border-gray-100">
                <h3 className="text-xl font-black uppercase border-l-4 border-green-600 pl-4">Business Identity</h3>
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="bg-gray-50 p-6 rounded-2xl space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Name Part {n}</label>
                    <div className="flex gap-4">
                      <input name={`businessNamePart${n}`} value={(config as any)[`businessNamePart${n}`] || ''} onChange={handleFieldChange} className="flex-1 p-4 bg-white border rounded-xl font-black uppercase text-sm" />
                      <input type="color" name={`businessNameColor${n}`} value={(config as any)[`businessNameColor${n}`] || '#000000'} onChange={handleFieldChange} className="w-12 h-12 rounded-lg border-none p-0 cursor-pointer" />
                    </div>
                  </div>
                ))}
             </div>
             <div className="bg-white p-10 rounded-[3rem] shadow-xl space-y-8 border border-gray-100">
                <h3 className="text-xl font-black uppercase border-l-4 border-green-600 pl-4">Media Assets</h3>
                <div className="grid grid-cols-1 gap-6">
                   <div className="p-8 bg-gray-50 rounded-2xl border-dashed border-2 text-center">
                      <p className="text-xs font-black uppercase mb-4 text-gray-400">Site Logo</p>
                      <button onClick={() => logoInput.current?.click()} className="bg-green-600 text-white px-8 py-3 rounded-xl text-xs font-black shadow-lg">Upload Logo</button>
                      <input type="file" ref={logoInput} className="hidden" onChange={e => handleUpload(e, 'logo')} />
                      {config.logo && <img src={config.logo} className="h-16 mx-auto mt-6 object-contain" alt="Logo preview" />}
                   </div>
                   <div className="p-8 bg-gray-50 rounded-2xl border-dashed border-2 text-center">
                      <p className="text-xs font-black uppercase mb-4 text-gray-400">Hero Banner Background</p>
                      <button onClick={() => heroInput.current?.click()} className="bg-gray-900 text-white px-8 py-3 rounded-xl text-xs font-black shadow-lg">Change Banner</button>
                      <input type="file" ref={heroInput} className="hidden" onChange={e => handleUpload(e, 'hero')} />
                      <div className="mt-4 h-24 rounded-xl overflow-hidden"><img src={config.heroImage} className="w-full h-full object-cover" alt="Hero preview" /></div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* CONTEXT TAB */}
        {activeTab === 'content' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fade-in">
             <div className="bg-white p-10 rounded-[3rem] shadow-xl space-y-8 border border-gray-100">
                <h3 className="text-xl font-black uppercase border-l-4 border-blue-600 pl-4">Hero Section</h3>
                <ContextEditorCard title="Main Headline" textField="headline" sizeField="headlineSize" colorField="headlineColor" config={config} handleFieldChange={handleFieldChange} />
                <ContextEditorCard title="Sub-Headline Description" textField="heroSubHeadline" sizeField="heroSubHeadlineSize" colorField="heroSubHeadlineColor" config={config} handleFieldChange={handleFieldChange} isTextArea />
             </div>
             <div className="bg-white p-10 rounded-[3rem] shadow-xl space-y-8 border border-gray-100">
                <h3 className="text-xl font-black uppercase border-l-4 border-green-600 pl-4">Gallery Section</h3>
                <ContextEditorCard title="Main Section Title" textField="homeSection1Title" sizeField="homeSection1TitleSize" colorField="homeSection1TitleColor" config={config} handleFieldChange={handleFieldChange} />
                <ContextEditorCard title="Section Sub-Heading" textField="homeSection1Sub" sizeField="homeSection1SubSize" colorField="homeSection1SubColor" config={config} handleFieldChange={handleFieldChange} isTextArea />
             </div>
             <div className="bg-white p-10 rounded-[3rem] shadow-xl space-y-8 border border-gray-100">
                <h3 className="text-xl font-black uppercase border-l-4 border-yellow-600 pl-4">Quote Section</h3>
                <ContextEditorCard title="Form Section Title" textField="quoteSectionTitle" sizeField="quoteSectionTitleSize" colorField="quoteSectionTitleColor" config={config} handleFieldChange={handleFieldChange} />
                <ContextEditorCard title="Form Instructions Text" textField="quoteSectionSub" sizeField="quoteSectionSubSize" colorField="quoteSectionSubColor" config={config} handleFieldChange={handleFieldChange} isTextArea />
             </div>
             <div className="bg-white p-10 rounded-[3rem] shadow-xl space-y-8 border border-gray-100">
                <h3 className="text-xl font-black uppercase border-l-4 border-purple-600 pl-4">Reviews Section</h3>
                <ContextEditorCard title="Testimonials Title" textField="testimonialsSectionTitle" sizeField="testimonialsSectionTitleSize" colorField="testimonialsSectionTitleColor" config={config} handleFieldChange={handleFieldChange} />
                <ContextEditorCard title="Reviews Sub-Heading" textField="testimonialsSectionSub" sizeField="testimonialsSectionSubSize" colorField="testimonialsSectionSubColor" config={config} handleFieldChange={handleFieldChange} isTextArea />
             </div>
             <div className="bg-white p-10 rounded-[3rem] shadow-xl space-y-8 border border-gray-100">
                <h3 className="text-xl font-black uppercase border-l-4 border-red-600 pl-4">Map Section</h3>
                <ContextEditorCard title="Map Section Title" textField="mapSectionTitle" sizeField="mapSectionTitleSize" colorField="mapSectionTitleColor" config={config} handleFieldChange={handleFieldChange} />
                <ContextEditorCard title="Map Sub-Headline" textField="mapSectionSub" sizeField="mapSectionSubSize" colorField="mapSectionSubColor" config={config} handleFieldChange={handleFieldChange} />
             </div>
             <div className="bg-white p-10 rounded-[3rem] shadow-xl space-y-8 border border-gray-100">
                <h3 className="text-xl font-black uppercase border-l-4 border-gray-900 pl-4">FAQ Section</h3>
                <ContextEditorCard title="FAQ Section Title" textField="faqSectionTitle" sizeField="faqSectionTitleSize" colorField="faqSectionTitleColor" config={config} handleFieldChange={handleFieldChange} />
                <ContextEditorCard title="FAQ Sub-Heading" textField="faqSectionSub" sizeField="faqSectionSubSize" colorField="faqSectionSubColor" config={config} handleFieldChange={handleFieldChange} isTextArea />
             </div>
          </div>
        )}

        {/* BUTTONS TAB */}
        {activeTab === 'buttons' && (
          <div className="animate-fade-in space-y-10">
             <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 flex justify-between items-center">
                <div>
                   <h3 className="text-2xl font-black uppercase tracking-tighter">Button Hub</h3>
                   <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Configure visibility and style for all site buttons</p>
                </div>
                <div className="bg-green-100 p-4 rounded-full text-green-600">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                </div>
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ButtonEditorCard title="Hero Section Primary Button" textField="heroButtonText" colorField="heroButtonColor" sizeField="heroButtonSize" shapeField="heroButtonShape" visibilityField="showHeroButton" config={config} handleFieldChange={handleFieldChange} toggleVisibility={toggleVisibility} />
                <ButtonEditorCard title="Lead Quote Submit Button" textField="quoteButtonText" colorField="quoteButtonColor" sizeField="quoteButtonSize" shapeField="quoteButtonShape" visibilityField="showQuoteButton" config={config} handleFieldChange={handleFieldChange} toggleVisibility={toggleVisibility} />
                <ButtonEditorCard title="Map Modal Directions Button" textField="directionsButtonText" colorField="directionsButtonColor" sizeField="directionsButtonSize" shapeField="directionsButtonShape" visibilityField="showDirectionsButton" config={config} handleFieldChange={handleFieldChange} toggleVisibility={toggleVisibility} />
                <ButtonEditorCard title="FAQ Contact/Call Button" textField="faqCallButtonText" colorField="faqCallButtonColor" sizeField="faqCallButtonSize" shapeField="faqCallButtonShape" visibilityField="showFaqCallButton" config={config} handleFieldChange={handleFieldChange} toggleVisibility={toggleVisibility} />
             </div>
          </div>
        )}

        {/* CONTACTS TAB */}
        {activeTab === 'contacts' && (
          <div className="animate-fade-in space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <ContactFieldEditor 
                title="Primary Phone Support"
                valueField="phoneNumber"
                colorField="phoneTextColor"
                sizeField="phoneTextSize"
                visibilityField="showPhoneNumber"
                config={config}
                handleFieldChange={handleFieldChange}
                toggleVisibility={toggleVisibility}
              />
              <ContactFieldEditor 
                title="Official Support Email"
                valueField="email"
                colorField="emailTextColor"
                sizeField="emailTextSize"
                visibilityField="showEmail"
                config={config}
                handleFieldChange={handleFieldChange}
                toggleVisibility={toggleVisibility}
              />
              <ContactFieldEditor 
                title="Yard/Pickup Address"
                valueField="address"
                colorField="addressTextColor"
                sizeField="addressTextSize"
                visibilityField="showAddress"
                config={config}
                handleFieldChange={handleFieldChange}
                toggleVisibility={toggleVisibility}
              />
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 space-y-8">
              <div className="flex justify-between items-center border-b pb-6">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Social Accounts & Redirect Links</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Manage global links and platform icons</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                <div className="md:col-span-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Platform</label>
                  <select 
                    value={newSocial.platform} 
                    onChange={e => setNewSocial({...newSocial, platform: e.target.value as any})}
                    className="w-full p-3 bg-white border border-gray-100 rounded-xl font-bold text-xs"
                  >
                    <option>Facebook</option><option>Twitter</option><option>YouTube</option><option>TikTok</option><option>WhatsApp</option><option>Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">URL / Redirect Target</label>
                  <input 
                    placeholder="https://..." 
                    value={newSocial.url} 
                    onChange={e => setNewSocial({...newSocial, url: e.target.value})}
                    className="w-full p-3 bg-white border border-gray-100 rounded-xl font-bold text-xs"
                  />
                </div>
                <div className="md:col-span-1 flex items-end">
                  <button 
                    onClick={addSocialLink}
                    className="w-full bg-green-600 text-white p-3 rounded-xl font-black uppercase text-[10px] shadow-lg shadow-green-900/10 hover:bg-green-700 transition-all"
                  >
                    Add Link
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(config.socialLinks || []).map((link) => (
                  <div key={link.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
                          {link.platform === 'Facebook' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>}
                          {link.platform === 'WhatsApp' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>}
                          {link.platform === 'Other' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">{link.platform}</span>
                      </div>
                      <button 
                        onClick={() => updateSocialLink(link.id, 'isVisible', !link.isVisible)}
                        className={`w-10 h-5 rounded-full relative transition-all ${link.isVisible ? 'bg-blue-600' : 'bg-gray-200'}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${link.isVisible ? 'left-5' : 'left-0.5'}`}></div>
                      </button>
                    </div>
                    <input 
                      value={link.url} 
                      onChange={e => updateSocialLink(link.id, 'url', e.target.value)}
                      className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-medium"
                    />
                    <button 
                      onClick={() => removeSocialLink(link.id)}
                      className="w-full py-2 bg-red-50 text-red-500 rounded-xl font-black uppercase text-[9px] hover:bg-red-100 transition-all"
                    >
                      Delete Link
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'keywords' && (
          <div className="animate-fade-in space-y-10">
             <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                   <h3 className="text-2xl font-black uppercase tracking-tighter">Keyword Intelligence & SEO Central</h3>
                   <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Manage search optimization and badge display site-wide</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                   <input 
                      value={newKeyword} 
                      onChange={e => setNewKeyword(e.target.value)} 
                      placeholder="Add new phrase (e.g. Scrap Cars Milwaukee)" 
                      className="flex-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 font-bold text-sm"
                      onKeyDown={e => e.key === 'Enter' && addKeyword()}
                   />
                   <button onClick={addKeyword} className="bg-green-600 text-white px-8 rounded-2xl font-black uppercase text-xs shadow-lg shadow-green-900/10 hover:bg-green-700 transition-all">Add</button>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-6">
                   <h4 className="text-sm font-black uppercase tracking-widest border-l-4 border-yellow-500 pl-4">Keyword Display Settings</h4>
                   <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Universal Text Size</label>
                        <select name="keywordTextSize" value={config.keywordTextSize || 'xs'} onChange={handleFieldChange} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black uppercase">
                          {['xs','sm','base','lg','xl'].map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Text Color</label>
                          <input type="color" name="keywordTextColor" value={config.keywordTextColor || '#9ca3af'} onChange={handleFieldChange} className="w-full h-11 rounded-xl border border-gray-100 p-0 bg-white cursor-pointer" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Badge BG Color</label>
                          <input type="color" name="keywordBgColor" value={config.keywordBgColor || '#ffffff'} onChange={handleFieldChange} className="w-full h-11 rounded-xl border border-gray-100 p-0 bg-white cursor-pointer" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Border Color</label>
                        <input type="color" name="keywordBadgeColor" value={config.keywordBadgeColor || '#e5e7eb'} onChange={handleFieldChange} className="w-full h-11 rounded-xl border border-gray-100 p-0 bg-white cursor-pointer" />
                      </div>
                   </div>
                </div>

                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-6">
                   <h4 className="text-sm font-black uppercase tracking-widest border-l-4 border-green-600 pl-4">Section Visibility & Usage Map</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                         <p className="text-[9px] font-black text-gray-400 uppercase mb-4 tracking-widest">Main Header/Hero Area Previews</p>
                         <div className="flex flex-wrap gap-2">
                            {visibleKeywordsArray.slice(0, 5).map((kw, i) => (
                              <span key={i} className={`px-2 py-1 rounded-md border font-black uppercase ${getSizeClass(config.keywordTextSize)}`} style={{ color: config.keywordTextColor, borderColor: config.keywordBadgeColor, backgroundColor: config.keywordBgColor }}>{kw}</span>
                            ))}
                            {visibleKeywordsArray.length > 5 && <span className="text-[9px] text-gray-400 font-bold self-center">+{visibleKeywordsArray.length - 5} more</span>}
                         </div>
                      </div>
                      <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                         <p className="text-[9px] font-black text-gray-400 uppercase mb-4 tracking-widest">Lead Quote System Badges</p>
                         <div className="flex flex-wrap gap-2">
                            {visibleKeywordsArray.slice(0, 4).map((kw, i) => (
                              <div key={i} className="flex items-center gap-1.5 bg-white border px-2 py-1 rounded-lg shadow-sm" style={{ borderColor: config.keywordBadgeColor }}>
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                <span className={`font-black uppercase ${getSizeClass(config.keywordTextSize)}`} style={{ color: config.keywordTextColor }}>{kw}</span>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {allKeywords.map((kw, i) => {
                  const isHidden = hiddenKeywordsArray.includes(kw);
                  return (
                    <div key={i} className={`p-5 rounded-[2rem] border flex flex-col gap-4 transition-all ${isHidden ? 'bg-gray-100/50 border-gray-200' : 'bg-white border-green-100 shadow-sm'}`}>
                      <input 
                        defaultValue={kw}
                        onBlur={(e) => {
                          const newVal = e.target.value.trim();
                          if (newVal && newVal !== kw) {
                            const updated = allKeywords.map(k => k === kw ? newVal : k).join(', ');
                            const newConfig = { ...config, seoKeywords: updated };
                            setConfig(newConfig);
                            saveConfig(newConfig);
                          }
                        }}
                        className={`font-black text-xs uppercase bg-transparent outline-none border-b border-transparent focus:border-green-500 pb-1 ${isHidden ? 'text-gray-400' : 'text-gray-900'}`}
                      />
                      <div className="flex gap-2">
                        <button onClick={() => toggleKeywordVisibility(kw)} className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${isHidden ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>{isHidden ? 'Make Visible' : 'Hide from UI'}</button>
                        <button onClick={() => removeKeyword(kw)} className="bg-red-50 text-red-500 p-2 rounded-xl hover:bg-red-500 hover:text-white transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                    </div>
                  );
                })}
             </div>
          </div>
        )}

        {/* GALLERY TAB */}
        {activeTab === 'gallery' && (
          <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 space-y-8 animate-fade-in">
             <div className="flex justify-between items-center border-b pb-6">
               <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Gallery Assets</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Add, update, and describe work-site photos</p>
               </div>
               <button onClick={() => galleryInput.current?.click()} className="bg-green-600 text-white px-8 py-3 rounded-xl font-black uppercase text-xs shadow-lg shadow-green-900/10 hover:bg-green-700 transition-all">Upload New Image</button>
               <input type="file" ref={galleryInput} className="hidden" onChange={e => handleUpload(e, 'gallery')} />
               <input type="file" ref={replaceInput} className="hidden" onChange={e => handleUpload(e, 'replace')} />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {(config.gallery || []).map(img => (
                  <div key={img.id} className="bg-white p-5 rounded-[2.5rem] border border-gray-100 shadow-md space-y-5 transition-transform hover:scale-[1.02]">
                    <div className="relative group overflow-hidden rounded-2xl aspect-square bg-gray-50 border border-gray-100">
                      <img src={img.url} className="w-full h-full object-cover" alt="Gallery item" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button 
                            onClick={() => { setReplacingId(img.id); replaceInput.current?.click(); }}
                            className="bg-white text-gray-900 p-3 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform"
                            title="Replace Image"
                         >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                         </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                         <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Display Title</label>
                         <input value={img.title || ''} onChange={e => updateGalleryText(img.id, 'title', e.target.value)} className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl font-black uppercase text-[10px] focus:bg-white focus:ring-1 focus:ring-green-500 outline-none" placeholder="Enter title..." />
                      </div>
                      <div>
                         <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Image Description</label>
                         <textarea value={img.desc || ''} onChange={e => updateGalleryText(img.id, 'desc', e.target.value)} className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl font-bold text-[10px] focus:bg-white focus:ring-1 focus:ring-green-500 outline-none" placeholder="Enter description..." rows={2} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                       <button onClick={() => { setReplacingId(img.id); replaceInput.current?.click(); }} className="bg-blue-50 text-blue-600 py-2.5 rounded-xl text-[9px] font-black uppercase hover:bg-blue-100 transition-all">Replace</button>
                       <button onClick={() => deletePhoto(img.id)} className="bg-red-50 text-red-500 py-2.5 rounded-xl text-[9px] font-black uppercase hover:bg-red-100 transition-all">Delete</button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* SCHEMA TAB */}
        {activeTab === 'seo' && (
          <div className="bg-white p-10 rounded-[3rem] shadow-xl space-y-8 border border-gray-100 animate-fade-in">
             <h3 className="text-xl font-black uppercase border-l-4 border-green-600 pl-4">JSON-LD Structured Data</h3>
             <textarea name="customSchema" value={config.customSchema || ''} onChange={handleFieldChange} rows={18} className="w-full p-6 bg-gray-950 text-green-400 font-mono text-sm rounded-3xl" spellCheck={false} />
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="animate-fade-in space-y-12">
             <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 space-y-8">
                <div className="flex justify-between items-center border-b pb-6">
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight">Post New Review</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Add manual feedback to the site rotation</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                   <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Customer Name</label>
                        <input placeholder="e.g. John D." value={newReview.name} onChange={e => setnewReview({...newReview, name: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 font-bold outline-none focus:ring-2 focus:ring-green-500 bg-white" />
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Review Text</label>
                        <textarea placeholder="Write review content..." value={newReview.text} onChange={e => setnewReview({...newReview, text: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 font-medium outline-none focus:ring-2 focus:ring-green-500 bg-white" rows={2} />
                      </div>
                   </div>
                   <div className="md:col-span-2">
                     <button onClick={addReview} className="w-full bg-green-600 text-white py-4 rounded-xl font-black uppercase text-xs shadow-lg hover:bg-green-700 transition-all">Post Review to Live Site</button>
                   </div>
                </div>
             </div>

             <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 space-y-8">
                <h3 className="text-xl font-black uppercase tracking-tight">Manage Existing Reviews</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {testimonials.map(t => {
                     const isEditing = editingReviewId === t.id;
                     return (
                       <div key={t.id} className={`p-6 rounded-[2.5rem] border transition-all ${isEditing ? 'border-blue-500 ring-2 ring-blue-100 bg-blue-50/10' : 'border-gray-100 bg-white shadow-sm hover:shadow-md'}`}>
                         {isEditing ? (
                           <div className="space-y-4">
                             <div>
                               <label className="text-[9px] font-black text-blue-600 uppercase mb-1 block">Customer Name</label>
                               <input id={`edit-name-${t.id}`} defaultValue={t.name} className="w-full p-3 bg-white border border-blue-200 rounded-xl font-black uppercase text-xs outline-none" />
                             </div>
                             <div>
                               <label className="text-[9px] font-black text-blue-600 uppercase mb-1 block">Review Text</label>
                               <textarea id={`edit-text-${t.id}`} defaultValue={t.text} className="w-full p-3 bg-white border border-blue-200 rounded-xl font-medium text-xs outline-none" rows={4} />
                             </div>
                             <div className="grid grid-cols-2 gap-3 pt-2">
                               <button onClick={() => {
                                   const nameInput = document.getElementById(`edit-name-${t.id}`) as HTMLInputElement;
                                   const textInput = document.getElementById(`edit-text-${t.id}`) as HTMLTextAreaElement;
                                   updateReview(t.id, nameInput.value, textInput.value);
                                 }} className="bg-blue-600 text-white py-2 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-blue-900/10">Save Changes</button>
                               <button onClick={() => setEditingReviewId(null)} className="bg-gray-200 text-gray-700 py-2 rounded-xl text-[10px] font-black uppercase">Cancel</button>
                             </div>
                           </div>
                         ) : (
                           <div className="flex flex-col h-full">
                             <div className="flex justify-between items-start mb-4">
                               <div>
                                 <p className="font-black text-sm uppercase text-gray-900 leading-none">{t.name}</p>
                                 <div className="flex gap-0.5 mt-1">
                                    {[...Array(5)].map((_, i) => <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full"></div>)}
                                 </div>
                               </div>
                               <div className="flex gap-2">
                                 <button onClick={() => setEditingReviewId(t.id)} className="p-2 bg-gray-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors" title="Edit Review"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                                 <button onClick={() => deleteReview(t.id)} className="p-2 bg-gray-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors" title="Delete Review"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                               </div>
                             </div>
                             <p className="text-xs text-gray-500 font-medium italic mb-6 line-clamp-4 flex-grow">"{t.text}"</p>
                             <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest pt-4 border-t border-gray-50">Posted {new Date(t.date).toLocaleDateString()}</div>
                           </div>
                         )}
                       </div>
                     );
                   })}
                </div>
             </div>
          </div>
        )}

        {/* FAQ TAB - FULLY REFINED WITH ADD/EDIT/DELETE */}
        {activeTab === 'faq' && (
          <div className="animate-fade-in space-y-12">
             <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 space-y-8">
                <div className="flex justify-between items-center border-b pb-6">
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight">FAQ Creator</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Add new frequently asked questions to the support section</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                   <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Question</label>
                        <input placeholder="e.g. Do you buy cars with no title?" value={newFAQ.question} onChange={e => setNewFAQ({...newFAQ, question: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 font-black text-sm outline-none focus:ring-2 focus:ring-green-500 bg-white" />
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Answer</label>
                        <textarea placeholder="Provide the detailed answer here..." value={newFAQ.answer} onChange={e => setNewFAQ({...newFAQ, answer: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 font-medium text-sm outline-none focus:ring-2 focus:ring-green-500 bg-white" rows={2} />
                      </div>
                   </div>
                   <div className="md:col-span-2">
                     <button onClick={addFAQ} className="w-full bg-green-600 text-white py-4 rounded-xl font-black uppercase text-xs shadow-lg hover:bg-green-700 transition-all tracking-widest">Post New FAQ Entry</button>
                   </div>
                </div>
             </div>

             <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 space-y-8">
                <h3 className="text-xl font-black uppercase tracking-tight">Active FAQ Library</h3>
                <div className="grid grid-cols-1 gap-6">
                   {faqs.map(f => {
                     const isEditing = editingFaqId === f.id;
                     return (
                       <div key={f.id} className={`p-6 rounded-[2rem] border transition-all ${isEditing ? 'border-green-600 bg-green-50/10 ring-2 ring-green-100' : 'border-gray-100 bg-white shadow-sm'}`}>
                         {isEditing ? (
                           <div className="space-y-6">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div>
                                  <label className="text-[9px] font-black text-green-600 uppercase mb-1 block tracking-widest">Edit Question</label>
                                  <input 
                                    id={`edit-q-${f.id}`}
                                    defaultValue={f.question}
                                    className="w-full p-4 bg-white border border-green-200 rounded-xl font-black text-sm outline-none"
                                  />
                               </div>
                               <div>
                                  <label className="text-[9px] font-black text-green-600 uppercase mb-1 block tracking-widest">Edit Answer</label>
                                  <textarea 
                                    id={`edit-a-${f.id}`}
                                    defaultValue={f.answer}
                                    className="w-full p-4 bg-white border border-green-200 rounded-xl font-medium text-sm outline-none"
                                    rows={3}
                                  />
                               </div>
                             </div>
                             <div className="flex gap-4">
                               <button 
                                 onClick={() => {
                                   const qInput = document.getElementById(`edit-q-${f.id}`) as HTMLInputElement;
                                   const aInput = document.getElementById(`edit-a-${f.id}`) as HTMLTextAreaElement;
                                   updateFAQ(f.id!, qInput.value, aInput.value);
                                 }}
                                 className="flex-1 bg-green-600 text-white py-3 rounded-xl font-black uppercase text-xs shadow-lg tracking-widest"
                               >
                                 Save FAQ Changes
                               </button>
                               <button 
                                 onClick={() => setEditingFaqId(null)}
                                 className="px-8 bg-gray-200 text-gray-700 py-3 rounded-xl font-black uppercase text-xs tracking-widest"
                               >
                                 Cancel
                               </button>
                             </div>
                           </div>
                         ) : (
                           <div className="flex justify-between items-center gap-6">
                             <div className="flex-1">
                               <p className="font-black text-sm text-gray-900 uppercase tracking-tight mb-1">{f.question}</p>
                               <p className="text-xs text-gray-500 font-medium line-clamp-1 italic">{f.answer}</p>
                             </div>
                             <div className="flex items-center gap-3">
                               <button 
                                  onClick={() => setEditingFaqId(f.id!)}
                                  className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                  title="Edit FAQ"
                               >
                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                               </button>
                               <button 
                                  onClick={() => deleteFAQ(f.id!)}
                                  className="p-3 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                  title="Delete FAQ"
                               >
                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
      </div>

      {/* RECEIPT MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto animate-fade-in">
           <div className="bg-white w-full max-w-2xl rounded-[1rem] shadow-2xl overflow-hidden border border-gray-100 my-auto">
              <div className="p-4 border-b flex justify-end bg-gray-50 print:hidden">
                 <button onClick={() => setSelectedLead(null)} className="text-2xl text-gray-400 hover:text-red-500 px-4">×</button>
              </div>
              <div className="p-12 bg-white" ref={receiptRef}>
                 <div className="flex justify-between items-start mb-12">
                    <div className="flex items-start space-x-4">
                      {config.logo ? (
                         <img src={config.logo} className="h-12 w-auto object-contain" alt="Logo" />
                      ) : (
                         <div className="bg-green-600 w-10 h-10 rounded-lg flex items-center justify-center text-white font-black">K</div>
                      )}
                      <div>
                        <h4 className="font-black uppercase text-base leading-tight tracking-tight text-gray-900">{fullBusinessName}</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">MILWAUKEE, WI • {config.phoneNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">FORM NUMBER</p>
                       <p className="text-lg font-black text-green-600 leading-none mb-4">{selectedLead.form_number}</p>
                    </div>
                 </div>
                 <div className="h-[1px] bg-gray-100 w-full mb-12"></div>
                 <div className="grid grid-cols-2 gap-x-12 gap-y-10 text-left">
                   <div className="space-y-8">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b pb-1">CONTACT INFO</p>
                      <div><p className="text-[10px] font-black text-gray-400 mb-1">FIRST NAME</p><p className="font-black text-gray-900 uppercase text-sm">{selectedLead.first_name}</p></div>
                      <div><p className="text-[10px] font-black text-gray-400 mb-1">LAST NAME</p><p className="font-black text-gray-900 uppercase text-sm">{selectedLead.last_name}</p></div>
                      <div><p className="text-[10px] font-black text-gray-400 mb-1">PHONE</p><p className="font-black text-green-600 text-sm">{selectedLead.phone}</p></div>
                   </div>
                   <div className="space-y-8">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b pb-1">VEHICLE DETAILS</p>
                      <div className="grid grid-cols-3 gap-2">
                        <div><p className="text-[10px] font-black text-gray-400 mb-1">YEAR</p><p className="font-black text-gray-900 text-sm">{selectedLead.year}</p></div>
                        <div><p className="text-[10px] font-black text-gray-400 mb-1">MAKE</p><p className="font-black text-gray-900 text-sm uppercase">{selectedLead.make}</p></div>
                        <div><p className="text-[10px] font-black text-gray-400 mb-1">MODEL</p><p className="font-black text-gray-900 text-sm uppercase">{selectedLead.model}</p></div>
                      </div>
                      <div><p className="text-[10px] font-black text-gray-400 mb-1">CONDITION</p><p className="font-black text-red-600 text-xs uppercase">{selectedLead.condition}</p></div>
                   </div>
                 </div>
              </div>
              <div className="p-8 bg-gray-50 border-t flex gap-4 print:hidden">
                <button onClick={downloadReceipt} className="flex-1 bg-green-600 text-white py-4 rounded-xl font-black text-xs uppercase shadow-xl hover:bg-green-700 transition-all tracking-widest">DOWNLOAD IMAGE</button>
                <button onClick={() => window.print()} className="flex-1 bg-gray-950 text-white py-4 rounded-xl font-black text-xs uppercase shadow-xl hover:bg-gray-800 transition-all tracking-widest">PRINT HARDCOPY</button>
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
        if (configRow?.config) {
          mergedConfig = { ...mergedConfig, ...configRow.config };
        }
        
        if (galleryRows?.length) {
          mergedConfig.gallery = galleryRows.map(g => ({ id: g.id, url: g.url, title: g.title || 'Job Site', desc: g.description || 'Milwaukee' }));
        }

        setConfig(mergedConfig);
        if (reviewRows) setTestimonials(reviewRows);
        if (faqRows?.length) setFaqs(faqRows); else setFaqs(FAQ_DATA);
      } catch (err) { 
        console.error("Initialization Error:", err); 
      } finally { 
        setIsLoading(false); 
      }
    };
    fetchEverything();
  }, []);

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white font-black uppercase tracking-[0.4em]">
      <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-8"></div>
      <div>MKE HQ CONNECTING...</div>
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
