
import { SiteConfig, FAQItem, Testimonial } from './types';

const defaultSchema = {
  "@context": "https://schema.org",
  "@type": "AutoSalvage",
  "name": "On Kaul Auto Salvage LLC",
  "alternateName": "Milwaukee Junk Car Removal Specialists",
  "description": "Top-rated cash for junk cars service in Milwaukee. We buy junk cars for cash and offer free towing and same-day removal across all surrounding areas.",
  "url": "https://onkaulsalvage.com",
  "telephone": "(414) 719-6558",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "8520 W Kaul Ave",
    "addressLocality": "Milwaukee",
    "addressRegion": "WI",
    "postalCode": "53225",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 43.1080275,
    "longitude": -88.0195521
  },
  "openingHours": "Mo-Fr 08:00-18:00, Sa 08:00-15:00"
};

export const INITIAL_CONFIG: SiteConfig = {
  businessNamePart1: "On",
  businessNameColor1: "#111827",
  businessNamePart2: "Kaul Auto",
  businessNameColor2: "#111827",
  businessNamePart3: "Salvage",
  businessNameColor3: "#16a34a",
  businessNamePart4: "LLC",
  businessNameColor4: "#6b7280",
  
  // Hero Defaults
  headline: "Top Rated Cash for Junk Cars in Milwaukee",
  headlineSize: "6xl",
  headlineColor: "#ffffff",
  heroSubHeadline: "Looking to sell my junk car fast? We are the leading junk car buyers in Milwaukee. Get instant junk car removal and the most junk car for cash today with free towing.",
  heroSubHeadlineSize: "xl",
  heroSubHeadlineColor: "#f3f4f6",
  heroButtonText: "Get Cash for Junk Cars",
  heroButtonColor: "#16a34a",
  showHeroButton: true,
  heroButtonSize: "lg",
  heroButtonShape: "pill",
  heroImage: "https://images.unsplash.com/photo-1599404221775-816799042250?auto=format&fit=crop&q=80&w=2000",
  logo: "", 
  
  // Contact Default
  phoneNumber: "(414) 719-6558",
  showPhoneNumber: true,
  phoneTextColor: "#16a34a",
  phoneTextSize: "base",
  address: "8520 W Kaul Ave, Milwaukee, WI 53225",
  showAddress: true,
  addressTextColor: "#9ca3af",
  addressTextSize: "sm",
  email: "quotes@onkaulsalvage.com",
  showEmail: true,
  emailTextColor: "#9ca3af",
  emailTextSize: "sm",

  // Home Section 1 Defaults
  homeSection1Title: "Professional Junk Car Removal",
  homeSection1TitleSize: "5xl",
  homeSection1TitleColor: "#111827",
  homeSection1Sub: "We buy junk cars near me and offer the most competitive Cash For Junk Cars in the Milwaukee area.",
  homeSection1SubSize: "xl",
  homeSection1SubColor: "#6b7280",

  // Quote Section Defaults
  quoteSectionTitle: "Get Your Highest Cash Offer",
  quoteSectionTitleSize: "5xl",
  quoteSectionTitleColor: "#111827",
  quoteSectionSub: "We buy any junk car in Milwaukee. Our system connects your request directly to our secure yard for an instant review.",
  quoteSectionSubSize: "xl",
  quoteSectionSubColor: "#4b5563",

  // Map Section Defaults
  mapSectionTitle: "Our Milwaukee Yard",
  mapSectionTitleSize: "5xl",
  mapSectionTitleColor: "#111827",
  mapSectionSub: "Junk Yards Near Me • Open for Pickup",
  mapSectionSubSize: "base",
  mapSectionSubColor: "#6b7280",

  // Testimonials Defaults
  testimonialsSectionTitle: "Real Milwaukee Feedback",
  testimonialsSectionTitleSize: "5xl",
  testimonialsSectionTitleColor: "#111827",
  testimonialsSectionSub: "See why we are the top choice for junk car removal. Our reputation as trusted junk car buyers has helped thousands sell junk car units.",
  testimonialsSectionSubSize: "xl",
  testimonialsSectionSubColor: "#4b5563",

  // FAQ Section Defaults
  faqSectionTitle: "Frequently Asked Questions",
  faqSectionTitleSize: "4xl",
  faqSectionTitleColor: "#ffffff",
  faqSectionSub: "Everything you need to know about selling your junk car in Milwaukee.",
  faqSectionSubSize: "xl",
  faqSectionSubColor: "#9ca3af",

  socialLinks: [
    { id: '1', platform: 'Facebook', url: 'https://facebook.com/onkaul', isVisible: true },
    { id: '2', platform: 'WhatsApp', url: 'https://wa.me/14147196558', isVisible: true },
    { id: '3', platform: 'YouTube', url: 'https://youtube.com/@onkaul', isVisible: false }
  ],
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2912.8336336495343!2d-88.0195521!3d43.1080275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88051a808f907897%3A0x6a2135967000e39b!2sOn%20Kaul%20Auto%20Salvage!5e0!3m2!1sen!2sus!4v1740000000000!5m2!1sen!2sus",
  mapImage: "",
  locationDirectionsUrl: "https://maps.app.goo.gl/LDc7Gx1Fo7aP34Vz9",
  licenseNumber: "MV-SALVAGE-53225-01",
  
  heroTopBadgeText: "#1 Rated Junk Car Buyer in Milwaukee County",
  showHeroTopBadge: true,
  heroTopBadgeSize: "sm",
  heroTopBadgeColor: "#ffffff",
  heroTopBadgeBgColor: "#16a34a",

  heroTrustBadge1Text: "WI LICENSED & INSURED",
  showHeroTrustBadge1: true,
  heroTrustBadge2Text: "LOCAL MILWAUKEE OWNED",
  showHeroTrustBadge2: true,
  heroTrustBadgeSize: "sm",
  heroTrustBadgeColor: "#ffffff",
  
  seoKeywords: "Junk car for cash, Cash for junk cars, Sell my junk car, Junk car removal, Junk yards near me, Sell junk car, we buy junk cars, junk cars near me, junk car buyers, buy junk cars near me",
  hiddenKeywords: "",
  customSchema: JSON.stringify(defaultSchema, null, 2),
  keywordTextSize: "xs",
  keywordTextColor: "#9ca3af",
  keywordBadgeColor: "#e5e7eb",
  keywordBgColor: "#ffffff",

  directionsButtonText: "Open Directions",
  directionsButtonColor: "#16a34a",
  showDirectionsButton: true,
  directionsButtonSize: "sm",
  directionsButtonShape: "rounded",
  faqCallButtonText: "(414) 719-6558",
  faqCallButtonColor: "#16a34a",
  showFaqCallButton: true,
  faqCallButtonSize: "lg",
  faqCallButtonShape: "rounded",
  quoteButtonText: "GET CASH QUOTE NOW",
  quoteButtonColor: "#16a34a",
  showQuoteButton: true,
  quoteButtonSize: "lg",
  quoteButtonShape: "rounded",
  gallery: [
    { 
      id: '1',
      url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800", 
      title: "Fast Junk Car Removal", 
      desc: "Same-day pickup for junk cars near me." 
    },
    { 
      id: '2',
      url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800", 
      title: "Sell Junk Car Fast", 
      desc: "We buy junk cars in any condition, running or not." 
    }
  ]
};

export const FAQ_DATA: FAQItem[] = [
  {
    question: "Do you pay cash for junk cars in Milwaukee?",
    answer: "Yes! On Kaul Auto Salvage pays top dollar cash on the spot for all junk cars, trucks, and SUVs in Milwaukee and surrounding areas. We provide immediate payments at the time of pickup."
  },
  {
    question: "How fast can I sell my junk car?",
    answer: "Most of our junk car removals are completed same-day. Once you accept our quote, we can often have a tow truck at your location within 1-4 hours to hand you cash and remove the vehicle."
  },
  {
    question: "Is junk car removal really free?",
    answer: "Absolutely. We never charge for towing or removal. The price we quote you is the exact amount of cash you will receive in your hand. No hidden fees or surprise deductions."
  },
  {
    question: "Do you buy cars that don’t run?",
    answer: "Yes, we buy cars in any condition! Whether your vehicle is wrecked, has engine failure, transmission issues, or is just old and taking up space, we will buy it for cash."
  },
  {
    question: "Can I sell my junk car without a title in Wisconsin?",
    answer: "In many cases, yes. While having a title makes the process faster, we can often purchase vehicles with just a valid registration and a driver's license matching the registration. Contact us to verify your specific situation."
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Michael R.',
    text: 'I needed to sell my junk car fast and these guys were great. They provided the best cash for junk cars near me. Professional junk car buyers!',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    date: '2024-02-15'
  }
];

export const SERVICE_AREAS = [
  "Milwaukee", "West Allis", "Wauwatosa", "Greenfield", 
  "Oak Creek", "South Milwaukee", "Cudahy", "Franklin",
  "Shorewood", "Brown Deer", "Glendale", "St. Francis",
  "Greendale", "Hales Corners", "Milwaukee County"
];
