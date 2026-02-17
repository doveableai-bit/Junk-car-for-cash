
import React from 'react';
import { SiteConfig, TextSize } from '../types';

interface HeroProps {
  config: SiteConfig;
}

const getSizeClass = (size: TextSize) => {
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

const Hero: React.FC<HeroProps> = ({ config }) => {
  const { 
    headline, headlineSize, headlineColor,
    heroSubHeadline, heroSubHeadlineSize, heroSubHeadlineColor,
    heroButtonText, 
    heroImage, 
    phoneNumber,
    heroTopBadgeText,
    showHeroTopBadge,
    heroTopBadgeSize,
    heroTopBadgeColor,
    heroTopBadgeBgColor,
    heroTrustBadge1Text,
    showHeroTrustBadge1,
    heroTrustBadge2Text,
    showHeroTrustBadge2,
    heroTrustBadgeSize,
    heroTrustBadgeColor,
    heroButtonColor,
    showHeroButton,
    heroButtonSize,
    heroButtonShape
  } = config;

  const buttonSizeClasses = {
    sm: 'px-6 py-3 text-sm',
    md: 'px-8 py-4 text-base sm:text-lg',
    lg: 'px-10 py-5 text-lg sm:text-xl',
    xl: 'px-12 py-7 text-xl sm:text-2xl font-black'
  }[heroButtonSize || 'lg'];

  const shapeClasses = {
    sharp: 'rounded-none',
    rounded: 'rounded-xl',
    pill: 'rounded-full'
  }[heroButtonShape || 'pill'];

  const isColorBright = (hex: string) => {
    if (!hex || hex === '#ffffff') return true;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155;
  };

  return (
    <section id="home" className="relative min-h-[550px] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="Junk Car Removal Milwaukee" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-gray-50/10 md:bg-gradient-to-r md:from-black/85 md:to-black/30"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center md:text-left pt-24 sm:pt-32 pb-16 sm:pb-20">
        <div className="max-w-4xl mx-auto md:mx-0">
          {showHeroTopBadge && (
            <span 
              className={`inline-block font-black px-4 py-2 rounded-full mb-6 uppercase tracking-widest shadow-lg ${getSizeClass(heroTopBadgeSize)}`}
              style={{ color: heroTopBadgeColor, backgroundColor: heroTopBadgeBgColor }}
            >
              {heroTopBadgeText}
            </span>
          )}
          <h1 
            className={`font-black mb-6 leading-[1.1] tracking-tighter ${getSizeClass(headlineSize)}`}
            style={{ color: headlineColor }}
          >
            {headline}
          </h1>
          <p 
            className={`mb-8 sm:mb-10 font-bold max-w-2xl mx-auto md:mx-0 leading-relaxed ${getSizeClass(heroSubHeadlineSize)}`}
            style={{ color: heroSubHeadlineColor }}
          >
            {heroSubHeadline}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center md:justify-start">
            {showHeroButton && (
              <a 
                href={`tel:${phoneNumber.replace(/\D/g,'')}`}
                style={{ 
                  backgroundColor: heroButtonColor || '#16a34a',
                  color: isColorBright(heroButtonColor) ? '#000000' : '#ffffff' 
                }}
                className={`${buttonSizeClasses} ${shapeClasses} font-black flex items-center justify-center space-x-3 transition-all transform hover:scale-105 shadow-2xl hover:brightness-110 w-full sm:w-auto uppercase tracking-widest`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <span>{heroButtonText}</span>
              </a>
            )}
          </div>

          <div className="mt-12 flex flex-wrap gap-4 sm:gap-8 items-center justify-center md:justify-start">
            {showHeroTrustBadge1 && (
              <div 
                className={`flex items-center space-x-3 bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/10 ${getSizeClass(heroTrustBadgeSize)}`}
                style={{ color: heroTrustBadgeColor }}
              >
                <div className="bg-green-600 rounded-full p-0.5">
                   <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
                <span className="font-black tracking-widest uppercase">{heroTrustBadge1Text}</span>
              </div>
            )}
            {showHeroTrustBadge2 && (
              <div 
                className={`flex items-center space-x-3 bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/10 ${getSizeClass(heroTrustBadgeSize)}`}
                style={{ color: heroTrustBadgeColor }}
              >
                <div className="bg-green-600 rounded-full p-0.5">
                   <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
                <span className="font-black tracking-widest uppercase">{heroTrustBadge2Text}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
