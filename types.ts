
export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  desc: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  imageUrl?: string;
  logoColor?: string; // Custom background color for initials
  youtubeUrl?: string;
  date: string;
}

export interface SocialLink {
  id: string;
  platform: string; // 'Facebook', 'Twitter', 'YouTube', 'TikTok', 'WhatsApp', or 'Other'
  url: string;
  isVisible: boolean;
  customIconUrl?: string; // URL for external icon if platform is 'Other'
}

export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';

export interface SiteConfig {
  // Hero Styles
  headline: string;
  headlineSize: TextSize;
  headlineColor: string;
  heroSubHeadline: string;
  heroSubHeadlineSize: TextSize;
  heroSubHeadlineColor: string;
  heroButtonText: string;
  heroImage: string;
  logo?: string;

  // Contact styling
  phoneNumber: string;
  showPhoneNumber: boolean;
  phoneTextColor: string;
  phoneTextSize: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  address: string;
  showAddress: boolean;
  addressTextColor: string;
  addressTextSize: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  email: string;
  showEmail: boolean;
  emailTextColor: string;
  emailTextSize: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  
  // Home Section 1 (Gallery/Features)
  homeSection1Title: string;
  homeSection1TitleSize: TextSize;
  homeSection1TitleColor: string;
  homeSection1Sub: string;
  homeSection1SubSize: TextSize;
  homeSection1SubColor: string;

  // Quote Section
  quoteSectionTitle: string;
  quoteSectionTitleSize: TextSize;
  quoteSectionTitleColor: string;
  quoteSectionSub: string;
  quoteSectionSubSize: TextSize;
  quoteSectionSubColor: string;

  // Testimonials Section
  testimonialsSectionTitle: string;
  testimonialsSectionTitleSize: TextSize;
  testimonialsSectionTitleColor: string;
  testimonialsSectionSub: string;
  testimonialsSectionSubSize: TextSize;
  testimonialsSectionSubColor: string;

  // Map Section
  mapSectionTitle: string;
  mapSectionTitleSize: TextSize;
  mapSectionTitleColor: string;
  mapSectionSub: string;
  mapSectionSubSize: TextSize;
  mapSectionSubColor: string;

  // FAQ Section
  faqSectionTitle: string;
  faqSectionTitleSize: TextSize;
  faqSectionTitleColor: string;
  faqSectionSub: string;
  faqSectionSubSize: TextSize;
  faqSectionSubColor: string;

  // Technical
  mapEmbedUrl: string;
  mapImage?: string;
  locationDirectionsUrl: string;
  licenseNumber: string;
  businessNamePart1: string;
  businessNameColor1: string;
  businessNamePart2: string;
  businessNameColor2: string;
  businessNamePart3: string;
  businessNameColor3: string;
  businessNamePart4: string;
  businessNameColor4: string;
  
  socialLinks: SocialLink[];
  gallery: GalleryImage[];
  
  // Badges
  heroTopBadgeText: string;
  showHeroTopBadge: boolean;
  heroTopBadgeSize: TextSize;
  heroTopBadgeColor: string;
  heroTopBadgeBgColor: string;
  
  heroTrustBadge1Text: string;
  showHeroTrustBadge1: boolean;
  heroTrustBadge2Text: string;
  showHeroTrustBadge2: boolean;
  heroTrustBadgeSize: TextSize;
  heroTrustBadgeColor: string;

  // SEO
  seoKeywords: string;
  hiddenKeywords: string;
  customSchema: string;
  keywordTextSize: TextSize;
  keywordTextColor: string;
  keywordBadgeColor: string;
  keywordBgColor: string;

  // Buttons
  heroButtonColor: string;
  showHeroButton: boolean;
  heroButtonSize: 'sm' | 'md' | 'lg' | 'xl';
  heroButtonShape: 'sharp' | 'rounded' | 'pill';
  directionsButtonText: string;
  directionsButtonColor: string;
  showDirectionsButton: boolean;
  directionsButtonSize: 'sm' | 'md' | 'lg' | 'xl';
  directionsButtonShape: 'sharp' | 'rounded' | 'pill';
  faqCallButtonText: string;
  faqCallButtonColor: string;
  showFaqCallButton: boolean;
  faqCallButtonSize: 'sm' | 'md' | 'lg' | 'xl';
  faqCallButtonShape: 'sharp' | 'rounded' | 'pill';
  quoteButtonText: string;
  quoteButtonColor: string;
  showQuoteButton: boolean;
  quoteButtonSize: 'sm' | 'md' | 'lg' | 'xl';
  quoteButtonShape: 'sharp' | 'rounded' | 'pill';
}

export interface FAQItem {
  id?: string | number;
  question: string;
  answer: string;
}
