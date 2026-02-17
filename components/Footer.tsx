
import React from 'react';
import { SiteConfig } from '../types';
import { Link } from 'react-router-dom';

interface FooterProps {
  config: SiteConfig;
}

const SocialIcon = ({ platform, customUrl }: { platform: string; customUrl?: string }) => {
  const p = platform.toLowerCase();
  
  if (p === 'other' && customUrl) {
    return <img src={customUrl} alt="Custom Social" className="w-5 h-5 object-contain" />;
  }

  // Define SVGs for common platforms
  switch (p) {
    case 'facebook':
      return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>;
    case 'twitter':
    case 'x':
      return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
    case 'youtube':
      return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
    case 'tiktok':
      return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.1-3.44-3.37-3.47-5.75-.02-1.48.4-2.99 1.27-4.21 1.49-2.04 4.03-3.33 6.58-3.03.08.7.07 1.41.07 2.11-.01.03-.02.04-.05.04-1.2-.18-2.43.03-3.46.67-1.14.68-1.9 1.85-1.97 3.14-.12 1.48.51 2.99 1.69 3.86 1.02.73 2.25.99 3.51.81 1.12-.17 2.19-.88 2.75-1.87.29-.51.45-1.08.46-1.67.02-4.14.01-8.28.01-12.42z"/></svg>;
    case 'whatsapp':
      return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;
    default:
      return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
  }
};

const Footer: React.FC<FooterProps> = ({ config }) => {
  const fullBusinessName = `${config.businessNamePart1} ${config.businessNamePart2} ${config.businessNamePart3} ${config.businessNamePart4}`.trim();
  
  // Resolve Size Classes
  const phoneSizeClass = { xs: 'text-xs', sm: 'text-sm', base: 'text-base', lg: 'text-lg', xl: 'text-xl font-bold' }[config.phoneTextSize || 'base'];
  const addressSizeClass = { xs: 'text-xs', sm: 'text-sm', base: 'text-base', lg: 'text-lg', xl: 'text-xl font-bold' }[config.addressTextSize || 'sm'];
  const emailSizeClass = { xs: 'text-xs', sm: 'text-sm', base: 'text-base', lg: 'text-lg', xl: 'text-xl font-bold' }[config.emailTextSize || 'sm'];

  const visibleSocialLinks = config.socialLinks.filter(link => link.isVisible);

  return (
    <footer id="contact" className="bg-gray-950 text-gray-400 py-20 border-t border-gray-900 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="inline-block mb-6" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              {config.logo ? (
                <div className="h-20 w-auto overflow-hidden">
                  <img src={config.logo} alt={fullBusinessName} className="h-full w-auto object-contain" />
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="bg-green-600 p-2 rounded-lg h-10 w-10 flex items-center justify-center overflow-hidden">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="font-extrabold text-xl tracking-tight text-white uppercase">
                    MKE Salvage
                  </span>
                </div>
              )}
            </Link>
            <p className="mb-6 text-gray-400 leading-relaxed text-sm font-medium">
              Milwaukee's premier <span className="text-white font-bold">junk car buyer</span>. We offer the best <span className="text-white font-bold">cash for junk cars</span> deals with fast removal.
            </p>
            {visibleSocialLinks.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {visibleSocialLinks.map(link => (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="bg-gray-900 p-3 rounded-2xl hover:bg-blue-600 hover:text-white transition-all text-gray-400 flex items-center justify-center shadow-lg" title={link.platform}>
                    <SocialIcon platform={link.platform} customUrl={link.customIconUrl} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-4 font-bold text-sm">
              <li><Link to="/" className="hover:text-green-500 transition-colors uppercase tracking-widest text-[10px]">Home</Link></li>
              <li><button onClick={() => document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-green-500 transition-colors uppercase tracking-widest text-[10px]">Quote System</button></li>
              <li><Link to="/admin" className="hover:text-green-500 transition-colors uppercase tracking-widest text-[10px] text-gray-300">Admin Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">Our Solutions</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
              <li><span className="text-gray-500 hover:text-green-500 transition-colors cursor-default">Junk Car for Cash</span></li>
              <li><span className="text-gray-500 hover:text-green-500 transition-colors cursor-default">Sell My Junk Car</span></li>
              <li><span className="text-gray-500 hover:text-green-500 transition-colors cursor-default">Junk Car Removal</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">Milwaukee HQ</h4>
            <ul className="space-y-4">
              {config.showAddress && (
                <li className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className={`${addressSizeClass}`} style={{ color: config.addressTextColor }}>{config.address}</span>
                </li>
              )}
              {config.showPhoneNumber && (
                <li className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${config.phoneNumber.replace(/\D/g,'')}`} className={`${phoneSizeClass} hover:text-white transition-colors`} style={{ color: config.phoneTextColor }}>{config.phoneNumber}</a>
                </li>
              )}
              {config.showEmail && (
                <li className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${config.email}`} className={`${emailSizeClass} hover:text-white transition-colors`} style={{ color: config.emailTextColor }}>{config.email}</a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-900 flex flex-col md:flex-row items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
          <p>On Kaul Salvage Reserved All Rights 2026</p>
          <div className="flex space-x-6 mt-4 md:mt-0 items-center">
            <span>Milwaukee Junk Car Buyers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
