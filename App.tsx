
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
       </div>
    </div>
  );
};

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
                <span key={i} className={`font-black uppercase tracking-widest border px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl shadow-sm ${getSizeClass(config.keywordTextSize)}`} style={{ color: config.keywordTextColor, borderColor: config.keywordBadgeColor, backgroundColor: config.keywordBgColor }}>{kw}</span>
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

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'logo' | 'hero' | 'gallery' | 'replace', id?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      if (target === 'gallery') {
        const nid = Date.now().toString();
        await supabase.from('gallery').insert([{ id: nid, url: base64, title: 'Job Site', description: 'Milwaukee' }]);
        setConfig({ ...config, gallery: [{ id: nid, url: base64, title: 'Job Site', desc: 'Milwaukee' }, ...config.gallery] });
      } else if (target === 'replace' && id) {
        await supabase.from('gallery').update({ url: base64 }).eq('id', id);
        setConfig({ ...config, gallery: config.gallery.map(g => g.id === id ? { ...g, url: base64 } : g) });
      } else if (target === 'logo') {
        const u = { ...config, logo: base64 };
        setConfig(u);
        saveConfig(u);
      } else if (target === 'hero') {
        const u = { ...config, heroImage: base64 };
        setConfig(u);
        saveConfig(u);
      }
    };
    reader.readAsDataURL(file);
  };

  const deleteGalleryItem = async (id: string) => {
    if (!confirm('Delete image?')) return;
    await supabase.from('gallery').delete().eq('id', id);
    setConfig({ ...config, gallery: config.gallery.filter(g => g.id !== id) });
  };

  const addFAQ = async () => { 
    if (!newFAQ.question || !newFAQ.answer) return;
    const { data } = await supabase.from('faqs').insert([{ question: newFAQ.question, answer: newFAQ.answer }]).select(); 
    if (data) { setFaqs([...faqs, data[0]]); setNewFAQ({ question: '', answer: '' }); } 
  };

  const updateFAQ = async (id: string | number, question: string, answer: string) => {
    await supabase.from('faqs').update({ question, answer }).eq('id', id);
    setFaqs(faqs.map(f => f.id === id ? { ...f, question, answer } : f));
    setEditingFaqId(null);
  };

  const deleteFAQ = async (id: string | number) => {
    if (!confirm('Delete FAQ?')) return;
    await supabase.from('faqs').delete().eq('id', id);
    setFaqs(faqs.filter(f => f.id !== id));
  };

  const addReview = async () => { 
    if (!newReview.name || !newReview.text) return;
    const { data } = await supabase.from('testimonials').insert([{ name: newReview.name, text: newReview.text, image_url: newReview.imageUrl, logo_color: newReview.logoColor, date: new Date().toISOString() }]).select(); 
    if (data) { setTestimonials([{ id: data[0].id, name: data[0].name, text: data[0].text, imageUrl: data[0].image_url, logoColor: data[0].logo_color, date: data[0].date }, ...testimonials]); setnewReview({ name: '', text: '', imageUrl: '', logoColor: '#16a34a' }); } 
  };

  const updateReview = async (id: string, name: string, text: string, imageUrl: string, logoColor: string) => {
    await supabase.from('testimonials').update({ name, text, image_url: imageUrl, logo_color: logoColor }).eq('id', id);
    setTestimonials(testimonials.map(t => t.id === id ? { ...t, name, text, imageUrl, logoColor } : t));
    setEditingReviewId(null);
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Delete review?')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    setTestimonials(testimonials.filter(t => t.id !== id));
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
    { id: 'leads', label: 'FORMS' }, { id: 'branding', label: 'IDENTITY' }, { id: 'content', label: 'CONTEXT' }, { id: 'buttons', label: 'BUTTONS' }, { id: 'contacts', label: 'CONTACTS' }, { id: 'gallery', label: 'GALLERY' }, { id: 'reviews', label: 'REVIEWS' }, { id: 'faq', label: 'FAQ' }, { id: 'keywords', label: 'KEYWORDS' }, { id: 'seo', label: 'SCHEMA' },
  ] as const;

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-[1600px]">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 sm:mb-12 bg-white p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4 lg:mb-0">
             <div className={`w-3 h-3 rounded-full ${isSaving ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
             <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter">ADMIN <span className="text-green-600">HQ</span></h2>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto gap-1 shadow-inner max-w-full no-scrollbar">
            {navTabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2.5 rounded-lg font-black uppercase text-[9px] sm:text-[10px] tracking-widest transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-green-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-800'}`}>{t.label}</button>
            ))}
          </div>
        </div>

        {activeTab === 'leads' && (
          <div className="bg-white rounded-[1.5rem] shadow-xl border overflow-hidden animate-fade-in border-gray-100">
             <div className="p-4 sm:p-8 border-b bg-gray-50 flex justify-between items-center">
               <h3 className="text-lg font-black uppercase tracking-tight">Lead Database</h3>
               <button onClick={fetchLeads} className="text-[10px] font-black bg-white px-6 py-2.5 border rounded-lg hover:bg-gray-100 uppercase tracking-widest shadow-sm">Refresh</button>
             </div>
             <div className="overflow-x-auto no-scrollbar">
               <table className="w-full text-left min-w-[1000px]">
                 <thead className="bg-gray-100 text-[10px] font-black uppercase text-gray-400">
                   <tr><th className="px-6 py-5">Date</th><th className="px-6 py-5">Form ID</th><th className="px-6 py-5">Customer</th><th className="px-6 py-5">Phone</th><th className="px-6 py-5">Vehicle</th><th className="px-6 py-5 text-right">Action</th></tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {leads.map(l => (
                     <tr key={l.id} className="hover:bg-gray-50"><td className="px-6 py-5 text-[11px] font-bold">{new Date(l.created_at).toLocaleDateString()}</td><td className="px-6 py-5 text-[11px] font-black text-green-700">{l.form_number}</td><td className="px-6 py-5 font-black uppercase text-[11px]">{l.first_name} {l.last_name}</td><td className="px-6 py-5 text-green-600 font-black text-[11px]">{l.phone}</td><td className="px-6 py-5 font-black text-[11px] uppercase">{l.year} {l.make} {l.model}</td><td className="px-6 py-5 text-right"><button onClick={() => setSelectedLead(l)} className="bg-green-600 text-white px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest">Receipt</button></td></tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {activeTab === 'branding' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
             <div className="bg-white p-6 sm:p-10 rounded-[2rem] shadow-xl border border-gray-100">
                <h3 className="text-xl font-black uppercase border-l-4 border-green-600 pl-4 mb-8">Business Identity</h3>
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="bg-gray-50 p-4 rounded-2xl mb-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Part {n}</label>
                    <div className="flex gap-4">
                      <input name={`businessNamePart${n}`} value={(config as any)[`businessNamePart${n}`] || ''} onChange={handleFieldChange} className="flex-1 p-4 bg-white border border-gray-200 rounded-xl font-black uppercase text-base outline-none focus:ring-2 focus:ring-green-500" />
                      <input type="color" name={`businessNameColor${n}`} value={(config as any)[`businessNameColor${n}`] || '#000000'} onChange={handleFieldChange} className="w-12 h-12 rounded-lg cursor-pointer bg-white border border-gray-200 p-1" />
                    </div>
                  </div>
                ))}
             </div>
             <div className="bg-white p-6 sm:p-10 rounded-[2rem] shadow-xl border border-gray-100">
                <h3 className="text-xl font-black uppercase border-l-4 border-green-600 pl-4 mb-8 tracking-tighter">Brand Assets</h3>
                <div className="space-y-6">
                  <div className="p-8 bg-gray-50 rounded-[2rem] text-center border-2 border-dashed border-gray-200">
                      <button onClick={() => logoInput.current?.click()} className="bg-green-600 text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg">Change Logo</button>
                      <input type="file" ref={logoInput} className="hidden" onChange={e => handleUpload(e, 'logo')} />
                      {config.logo && <img src={config.logo} className="h-16 mx-auto mt-6 object-contain" />}
                  </div>
                  <div className="p-8 bg-gray-50 rounded-[2rem] text-center border-2 border-dashed border-gray-200">
                      <button onClick={() => heroInput.current?.click()} className="bg-blue-600 text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg">Change Hero Image</button>
                      <input type="file" ref={heroInput} className="hidden" onChange={e => handleUpload(e, 'hero')} />
                      <img src={config.heroImage} className="h-24 w-full object-cover rounded-xl mt-6" />
                  </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
             <ContextEditorCard title="Hero Headline" textField="headline" sizeField="headlineSize" colorField="headlineColor" config={config} handleFieldChange={handleFieldChange} />
             <ContextEditorCard title="Hero Subheadline" textField="heroSubHeadline" sizeField="heroSubHeadlineSize" colorField="heroSubHeadlineColor" config={config} handleFieldChange={handleFieldChange} isTextArea />
             <ContextEditorCard title="Gallery Title" textField="homeSection1Title" sizeField="homeSection1TitleSize" colorField="homeSection1TitleColor" config={config} handleFieldChange={handleFieldChange} />
             <ContextEditorCard title="Gallery Subtitle" textField="homeSection1Sub" sizeField="homeSection1SubSize" colorField="homeSection1SubColor" config={config} handleFieldChange={handleFieldChange} isTextArea />
             <ContextEditorCard title="Quote Section Title" textField="quoteSectionTitle" sizeField="quoteSectionTitleSize" colorField="quoteSectionTitleColor" config={config} handleFieldChange={handleFieldChange} />
             <ContextEditorCard title="Testimonials Title" textField="testimonialsSectionTitle" sizeField="testimonialsSectionTitleSize" colorField="testimonialsSectionTitleColor" config={config} handleFieldChange={handleFieldChange} />
             <ContextEditorCard title="FAQ Title" textField="faqSectionTitle" sizeField="faqSectionTitleSize" colorField="faqSectionTitleColor" config={config} handleFieldChange={handleFieldChange} />
             <ContextEditorCard title="Map Section Title" textField="mapSectionTitle" sizeField="mapSectionTitleSize" colorField="mapSectionTitleColor" config={config} handleFieldChange={handleFieldChange} />
          </div>
        )}

        {activeTab === 'buttons' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
             <ButtonEditorCard title="Hero CTA Button" textField="heroButtonText" colorField="heroButtonColor" sizeField="heroButtonSize" shapeField="heroButtonShape" visibilityField="showHeroButton" config={config} handleFieldChange={handleFieldChange} toggleVisibility={toggleVisibility} />
             <ButtonEditorCard title="Quote Submission Button" textField="quoteButtonText" colorField="quoteButtonColor" sizeField="quoteButtonSize" shapeField="quoteButtonShape" visibilityField="showQuoteButton" config={config} handleFieldChange={handleFieldChange} toggleVisibility={toggleVisibility} />
             <ButtonEditorCard title="Directions Button" textField="directionsButtonText" colorField="directionsButtonColor" sizeField="directionsButtonSize" shapeField="directionsButtonShape" visibilityField="showDirectionsButton" config={config} handleFieldChange={handleFieldChange} toggleVisibility={toggleVisibility} />
             <ButtonEditorCard title="FAQ Contact Button" textField="faqCallButtonText" colorField="faqCallButtonColor" sizeField="faqCallButtonSize" shapeField="faqCallButtonShape" visibilityField="showFaqCallButton" config={config} handleFieldChange={handleFieldChange} toggleVisibility={toggleVisibility} />
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
             <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-black uppercase">Phone</h3>
                 <button onClick={() => toggleVisibility('showPhoneNumber', config.showPhoneNumber)} className={`w-12 h-6 rounded-full relative ${config.showPhoneNumber ? 'bg-green-600' : 'bg-gray-300'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.showPhoneNumber ? 'left-7' : 'left-1'}`}></div></button>
               </div>
               <input name="phoneNumber" value={config.phoneNumber} onChange={handleFieldChange} className="w-full p-4 bg-gray-50 rounded-xl font-bold mb-4" />
               <input type="color" name="phoneTextColor" value={config.phoneTextColor} onChange={handleFieldChange} className="w-full h-10 rounded-xl" />
             </div>
             <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-black uppercase">Email</h3>
                 <button onClick={() => toggleVisibility('showEmail', config.showEmail)} className={`w-12 h-6 rounded-full relative ${config.showEmail ? 'bg-green-600' : 'bg-gray-300'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.showEmail ? 'left-7' : 'left-1'}`}></div></button>
               </div>
               <input name="email" value={config.email} onChange={handleFieldChange} className="w-full p-4 bg-gray-50 rounded-xl font-bold mb-4" />
               <input type="color" name="emailTextColor" value={config.emailTextColor} onChange={handleFieldChange} className="w-full h-10 rounded-xl" />
             </div>
             <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-black uppercase">Address</h3>
                 <button onClick={() => toggleVisibility('showAddress', config.showAddress)} className={`w-12 h-6 rounded-full relative ${config.showAddress ? 'bg-green-600' : 'bg-gray-300'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.showAddress ? 'left-7' : 'left-1'}`}></div></button>
               </div>
               <textarea name="address" value={config.address} onChange={handleFieldChange} rows={2} className="w-full p-4 bg-gray-50 rounded-xl font-bold mb-4" />
               <input type="color" name="addressTextColor" value={config.addressTextColor} onChange={handleFieldChange} className="w-full h-10 rounded-xl" />
             </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="animate-fade-in space-y-8">
             <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 text-center">
                <button onClick={() => galleryInput.current?.click()} className="bg-green-600 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest shadow-lg">Upload Job Site Photo</button>
                <input type="file" ref={galleryInput} className="hidden" onChange={e => handleUpload(e, 'gallery')} />
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {config.gallery.map(img => (
                  <div key={img.id} className="bg-white p-4 rounded-[1.5rem] shadow-lg border border-gray-100 flex flex-col">
                    <img src={img.url} className="w-full aspect-square object-cover rounded-xl mb-4" />
                    <div className="flex gap-2 mt-auto">
                       <button onClick={() => { replaceInput.current?.click(); setEditingReviewId(img.id); }} className="flex-1 bg-gray-100 text-[9px] font-black uppercase py-2 rounded-lg">Replace</button>
                       <button onClick={() => deleteGalleryItem(img.id)} className="flex-1 bg-red-50 text-red-600 text-[9px] font-black uppercase py-2 rounded-lg">Delete</button>
                    </div>
                  </div>
                ))}
                <input type="file" ref={replaceInput} className="hidden" onChange={e => handleUpload(e, 'replace', editingReviewId!)} />
             </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="animate-fade-in space-y-8">
             <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-black uppercase">New Review</h3>
                  <input placeholder="Name" value={newReview.name} onChange={e => setnewReview({...newReview, name: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl font-bold" />
                  <textarea placeholder="Review Text" value={newReview.text} onChange={e => setnewReview({...newReview, text: e.target.value})} rows={3} className="w-full p-4 bg-gray-50 rounded-xl font-medium" />
                  <button onClick={addReview} className="w-full bg-green-600 text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg">Add Review</button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div><label className="text-[9px] font-black uppercase mb-2 block">Color</label><input type="color" value={newReview.logoColor} onChange={e => setnewReview({...newReview, logoColor: e.target.value})} className="w-full h-12 rounded-xl" /></div>
                   <div><label className="text-[9px] font-black uppercase mb-2 block">Avatar URL</label><input value={newReview.imageUrl} onChange={e => setnewReview({...newReview, imageUrl: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl text-[10px]" /></div>
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map(t => (
                  <div key={t.id} className="bg-white p-6 rounded-[2rem] shadow-lg border border-gray-100 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-black" style={{ backgroundColor: t.logoColor || '#16a34a' }}>{t.name[0]}</div>
                        <span className="font-black uppercase text-sm">{t.name}</span>
                      </div>
                      <button onClick={() => deleteReview(t.id)} className="text-red-400 hover:text-red-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                    </div>
                    <p className="text-xs text-gray-500 italic mb-4 flex-grow">"{t.text}"</p>
                    <div className="text-[8px] font-black text-gray-300 uppercase tracking-widest pt-3 border-t">{new Date(t.date).toLocaleDateString()}</div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="animate-fade-in space-y-8">
             <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
                <h3 className="text-lg font-black uppercase mb-6">New FAQ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="Question" value={newFAQ.question} onChange={e => setNewFAQ({...newFAQ, question: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl font-bold" />
                  <textarea placeholder="Answer" value={newFAQ.answer} onChange={e => setNewFAQ({...newFAQ, answer: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl" />
                  <button onClick={addFAQ} className="md:col-span-2 bg-green-600 text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg">Post FAQ</button>
                </div>
             </div>
             <div className="space-y-4">
                {faqs.map(f => (
                  <div key={f.id} className="bg-white p-6 rounded-[1.5rem] shadow-md border border-gray-100 flex justify-between items-center">
                    <div className="flex-1"><p className="font-black text-sm uppercase">{f.question}</p><p className="text-xs text-gray-400 mt-1">{f.answer}</p></div>
                    <button onClick={() => deleteFAQ(f.id!)} className="ml-4 text-red-400 hover:text-red-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'keywords' && (
          <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
                <h3 className="text-lg font-black uppercase mb-6">SEO Keywords (Visible)</h3>
                <textarea name="seoKeywords" value={config.seoKeywords} onChange={handleFieldChange} rows={8} className="w-full p-4 bg-gray-50 rounded-xl font-bold text-sm" placeholder="Keyword 1, Keyword 2..." />
                <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Separate with commas</p>
             </div>
             <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
                <h3 className="text-lg font-black uppercase mb-6">Keyword Styling</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-[9px] font-black uppercase mb-1 block">Text Color</label><input type="color" name="keywordTextColor" value={config.keywordTextColor} onChange={handleFieldChange} className="w-full h-10 rounded-xl" /></div>
                  <div><label className="text-[9px] font-black uppercase mb-1 block">Badge Color</label><input type="color" name="keywordBadgeColor" value={config.keywordBadgeColor} onChange={handleFieldChange} className="w-full h-10 rounded-xl" /></div>
                  <div><label className="text-[9px] font-black uppercase mb-1 block">Bg Color</label><input type="color" name="keywordBgColor" value={config.keywordBgColor} onChange={handleFieldChange} className="w-full h-10 rounded-xl" /></div>
                  <div><label className="text-[9px] font-black uppercase mb-1 block">Text Size</label><select name="keywordTextSize" value={config.keywordTextSize} onChange={handleFieldChange} className="w-full p-2 bg-gray-50 rounded-lg text-xs font-black uppercase">{['xs','sm','base','lg'].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 animate-fade-in">
             <h3 className="text-lg font-black uppercase mb-6">JSON-LD Schema</h3>
             <textarea name="customSchema" value={config.customSchema} onChange={handleFieldChange} rows={15} className="w-full p-6 bg-gray-950 text-green-400 font-mono text-xs rounded-2xl" />
             <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Standard Schema.org markup for AutoSalvage</p>
          </div>
        )}
      </div>

      {selectedLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
           <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden my-auto">
              <div className="p-4 border-b flex justify-end bg-gray-50">
                 <button onClick={() => setSelectedLead(null)} className="p-3 bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-xl"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <div className="p-12 bg-white" ref={receiptRef}>
                 <div className="flex justify-between items-start mb-10">
                   <h4 className="font-black uppercase text-xl tracking-tighter text-green-600">OFFICIAL QUOTE: {selectedLead.form_number}</h4>
                   <span className="text-[10px] font-black text-gray-400 uppercase border px-2 py-1 rounded">MKE BRANCH</span>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm font-bold text-gray-900 uppercase">
                    <div className="space-y-4">
                       <div className="border-l-4 border-green-500 pl-4 py-1"><label className="text-[9px] text-gray-400 block mb-0.5">CUSTOMER</label>{selectedLead.first_name} {selectedLead.last_name}</div>
                       <div className="border-l-4 border-green-500 pl-4 py-1"><label className="text-[9px] text-gray-400 block mb-0.5">PHONE</label>{selectedLead.phone}</div>
                    </div>
                    <div className="space-y-4">
                       <div className="border-l-4 border-blue-500 pl-4 py-1"><label className="text-[9px] text-gray-400 block mb-0.5">VEHICLE</label>{selectedLead.year} {selectedLead.make} {selectedLead.model}</div>
                       <div className="border-l-4 border-blue-500 pl-4 py-1"><label className="text-[9px] text-gray-400 block mb-0.5">CONDITION</label>{selectedLead.condition}</div>
                    </div>
                 </div>
                 <div className="mt-12 pt-8 border-t-2 border-dashed border-gray-100 text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status: {selectedLead.status || 'PENDING'}</p>
                 </div>
              </div>
              <div className="p-8 bg-gray-50 border-t flex flex-col sm:flex-row gap-4">
                <button onClick={async () => { if (receiptRef.current) { const dataUrl = await toPng(receiptRef.current); const link = document.createElement('a'); link.download = `receipt-${selectedLead.form_number}.png`; link.href = dataUrl; link.click(); } }} className="flex-1 bg-green-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg">Download Image</button>
                <button onClick={() => window.print()} className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg">Print Record</button>
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
