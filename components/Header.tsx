
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SiteConfig } from '../types';

interface HeaderProps {
  config: SiteConfig;
}

const Header: React.FC<HeaderProps> = ({ config }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { 
    phoneNumber, 
    showPhoneNumber,
    logo, 
    businessNamePart1, businessNameColor1,
    businessNamePart2, businessNameColor2,
    businessNamePart3, businessNameColor3,
    businessNamePart4, businessNameColor4,
    mapEmbedUrl,
    locationDirectionsUrl,
    address,
    showAddress,
    showDirectionsButton,
    directionsButtonText,
    directionsButtonColor,
    directionsButtonSize,
    directionsButtonShape
  } = config;

  const fullBusinessName = `${businessNamePart1} ${businessNamePart2} ${businessNamePart3} ${businessNamePart4}`.trim();

  const btnSizeClasses = {
    sm: 'px-8 py-3 text-sm', md: 'px-10 py-4 text-base', lg: 'px-12 py-5 text-lg', xl: 'px-14 py-6 text-xl'
  }[directionsButtonSize || 'sm'];

  const btnShapeClasses = {
    sharp: 'rounded-none', rounded: 'rounded-xl', pill: 'rounded-full'
  }[directionsButtonShape || 'rounded'];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsMapModalOpen(false);
  }, [location]);

  const navItems = [
    { name: 'Home', path: '/', isHash: true, hash: 'home' },
    { name: 'Quote Form', path: '/', isHash: true, hash: 'quote' },
    { name: 'FAQ', path: '/', isHash: true, hash: 'faq' },
    { name: 'Contact Us', path: '/', isHash: true, hash: 'quote' },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.isHash) {
      if (location.pathname === '/') {
        const element = document.getElementById(item.hash!);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate(`/#${item.hash}`);
      }
    } else {
      navigate(item.path);
    }
    setIsMenuOpen(false);
  };

  const handleFormIconClick = () => {
    if (location.pathname === '/') {
      const element = document.getElementById('quote');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/#quote');
    }
  };

  const handleLocationIconClick = () => {
    setIsMapModalOpen(true);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-2 md:py-3">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="flex items-center">
              {logo ? (
                <div className="h-10 md:h-14 w-auto overflow-hidden mr-3">
                  <img src={logo} alt={fullBusinessName} className="h-full w-auto object-contain" />
                </div>
              ) : (
                <div className="bg-green-600 p-2 rounded-lg shadow-md shadow-green-900/10 h-10 w-10 flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
              <span className="font-extrabold text-lg md:text-xl tracking-tight uppercase flex items-center">
                {businessNamePart1 && <span style={{ color: businessNameColor1 || '#111827' }}>{businessNamePart1}</span>}
                {businessNamePart2 && <span className="ml-1.5" style={{ color: businessNameColor2 || '#111827' }}>{businessNamePart2}</span>}
                {businessNamePart3 && <span className="ml-1.5" style={{ color: businessNameColor3 || '#16a34a' }}>{businessNamePart3}</span>}
                {businessNamePart4 && <span className="ml-1.5" style={{ color: businessNameColor4 || '#6b7280' }}>{businessNamePart4}</span>}
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-1.5 sm:space-x-3">
            <Link 
              to="/" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-2.5 rounded-xl border-2 border-gray-100 bg-white text-gray-500 hover:border-green-200 hover:text-green-600 transition-all"
              aria-label="Go to Home"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>

            <button 
              onClick={handleLocationIconClick}
              className="p-2.5 rounded-xl border-2 border-gray-100 bg-white text-gray-500 hover:border-green-200 hover:text-green-600 transition-all"
              aria-label="View Map Modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            <button 
              onClick={handleFormIconClick}
              className="p-2.5 rounded-xl border-2 border-gray-100 bg-white text-gray-500 hover:border-green-200 hover:text-green-600 transition-all"
              aria-label="Get a Quote"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>

            {showPhoneNumber && (
              <a 
                href={`tel:${phoneNumber.replace(/\D/g,'')}`}
                className="hidden lg:flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full font-bold transition-all border border-green-100 hover:bg-green-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm font-bold">{phoneNumber}</span>
              </a>
            )}

            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl transition-all border-2 ${isMenuOpen ? 'border-green-600 bg-green-50 text-green-600' : 'border-gray-200 bg-white text-gray-700 hover:border-green-200'}`}
                aria-label="Toggle Menu"
              >
                <span className="font-bold text-sm hidden xs:block">{isMenuOpen ? 'CLOSE' : 'MENU'}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                  )}
                </svg>
              </button>

              <div className={`absolute right-0 mt-4 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-4 transition-all duration-300 origin-top-right transform ${isMenuOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <div className="px-6 py-2 border-b border-gray-50 mb-2 flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Navigation</span>
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Close Menu"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavClick(item)}
                      className={`w-full text-left flex items-center px-6 py-4 text-base font-bold transition-all ${
                        (item.isHash && location.pathname === '/' && location.hash === `#${item.hash}`) || (!item.isHash && location.pathname === item.path)
                        ? 'text-green-600 bg-green-50'
                        : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
                <div className="mt-4 px-4 pt-4 border-t border-gray-50">
                  {showPhoneNumber && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Instant Quote</p>
                      <a 
                        href={`tel:${phoneNumber.replace(/\D/g,'')}`}
                        className="flex items-center justify-center w-full bg-green-600 text-white py-4 rounded-xl font-black text-base hover:bg-green-700 transition-all shadow-lg shadow-green-900/20"
                      >
                        CALL: {phoneNumber}
                      </a>
                    </div>
                  )}
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-center py-2 text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors"
                  >
                    [ Close Menu ]
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Map Modal */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[80vh]">
            <div className="p-6 flex justify-between items-center border-b border-gray-100">
              <div>
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">On Kaul Auto Salvage</h3>
                {showAddress && <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">{address}</p>}
              </div>
              <button 
                onClick={() => setIsMapModalOpen(false)}
                className="p-3 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-2xl transition-all group"
              >
                <svg className="w-6 h-6 transform group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 bg-gray-100">
              <iframe 
                src={mapEmbedUrl} 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Map Popup"
              ></iframe>
            </div>
            <div className="p-6 bg-gray-50 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center space-x-4">
                 <div className="bg-green-600 p-2 rounded-lg text-white">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
                 <div className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                   Mon-Fri: 8am-6pm | Sat: 8am-3pm
                 </div>
              </div>
              {showDirectionsButton && (
                <a 
                  href={locationDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ backgroundColor: directionsButtonColor }}
                  className={`w-full sm:w-auto text-white ${btnSizeClasses} ${btnShapeClasses} font-black uppercase tracking-widest shadow-lg shadow-green-900/20 hover:brightness-110 transition-all text-center`}
                >
                  {directionsButtonText}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
