
import React from 'react';
import { SiteConfig, Testimonial, TextSize } from '../types';

interface TestimonialsProps {
  testimonials: Testimonial[];
  config: SiteConfig;
}

const getSizeClass = (size: TextSize) => {
  return {
    xs: 'text-xs', sm: 'text-sm', base: 'text-base', lg: 'text-lg', xl: 'text-xl',
    '2xl': 'text-2xl', '3xl': 'text-3xl', '4xl': 'text-4xl', '5xl': 'text-5xl',
    '6xl': 'text-6xl', '7xl': 'text-7xl'
  }[size] || 'text-base';
};

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials, config }) => {
  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  return (
    <section id="reviews" className="py-24 bg-gray-50 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 
            className={`font-black uppercase tracking-tight mb-4 ${getSizeClass(config.testimonialsSectionTitleSize)}`}
            style={{ color: config.testimonialsSectionTitleColor }}
          >
            {config.testimonialsSectionTitle}
          </h2>
          <p 
            className={`max-w-3xl mx-auto font-medium leading-relaxed ${getSizeClass(config.testimonialsSectionSubSize)}`}
            style={{ color: config.testimonialsSectionSubColor }}
          >
            {config.testimonialsSectionSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all border border-gray-100 p-8 flex flex-col">
              <div className="flex items-center space-x-4 mb-6">
                {t.imageUrl ? (
                  <img src={t.imageUrl} alt={t.name} className="w-14 h-14 rounded-2xl object-cover ring-4 ring-green-50 shadow-md" />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-green-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-green-900/20">
                    {t.name[0]}
                  </div>
                )}
                <div>
                  <h4 className="font-black text-gray-900 uppercase tracking-tight">{t.name}</h4>
                  <div className="flex text-yellow-400 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-gray-600 italic mb-6 flex-grow font-medium leading-relaxed">"{t.text}"</p>

              {t.youtubeUrl && (
                <div className="mt-4 aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black border-4 border-white">
                  <iframe width="100%" height="100%" src={getYouTubeEmbedUrl(t.youtubeUrl) || ''} title="Testimonial Video" frameBorder="0" allowFullScreen></iframe>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-100 text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Verified Customer Review</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
