/**
 * Sandy Digital Hub — Master Translation Dictionary
 * All UI strings in English (en) and Hindi (hi).
 * NO third-party translation library used.
 */

export type Lang = 'en' | 'hi';

export type TranslationKey = keyof typeof translations;

export const translations = {

  // ── Navbar ──────────────────────────────────────────────────────
  Home:               { en: 'Home',            hi: 'होम' },
  Services:           { en: 'Services',        hi: 'सेवाएं' },
  Checklist:          { en: 'Checklist',       hi: 'चेकलिस्ट' },
  Calculator:         { en: 'Calculator',      hi: 'कैल्कुलेटर' },
  'Track Order':      { en: 'Track Order',     hi: 'ऑर्डर ट्रैक' },
  Portfolio:          { en: 'Portfolio',       hi: 'पोर्टफोलियो' },
  Reviews:            { en: 'Reviews',         hi: 'समीक्षाएं' },
  Resizer:            { en: 'Resizer',         hi: 'फोटो रिसाइजर' },
  Tools:              { en: 'Tools',           hi: 'टूल्स' },
  Pricing:            { en: 'Pricing',         hi: 'मूल्य' },
  Contact:            { en: 'Contact',         hi: 'संपर्क' },
  Login:              { en: 'Login',           hi: 'लॉग इन' },
  'Get Started':      { en: 'Get Started',     hi: 'शुरू करें' },
  'My Account':       { en: 'My Account',      hi: 'मेरा खाता' },
  Account:            { en: 'Account',         hi: 'खाता' },
  'My Requests':      { en: 'My Requests',     hi: 'मेरे अनुरोध' },
  Admin:              { en: 'Admin',           hi: 'एडमिन' },
  'Admin Dashboard':  { en: 'Admin Dashboard', hi: 'एडमिन डैशबोर्ड' },
  Logout:             { en: 'Logout',          hi: 'लॉग आउट' },

  // ── Hero Section ─────────────────────────────────────────────────
  'hero.badge':       { en: "India's Premier Digital Service & App Center", hi: 'भारत का प्रमुख डिजिटल सेवा केंद्र' },
  'hero.heading1':    { en: 'Empower Your Business With', hi: 'अपने व्यापार को शक्ति दें' },
  'hero.brand':       { en: 'Sandy Digital Hub', hi: 'Sandy Digital Hub' },
  'hero.subtext':     {
    en: 'From Custom Web & App Development to Passport Photo Generation, Official Govt Documents, GST Registration & Free Image Tools — We execute your digital needs at lightning speed!',
    hi: 'कस्टम वेब और ऐप डेवलपमेंट से लेकर पासपोर्ट फोटो, सरकारी दस्तावेज़, GST रजिस्ट्रेशन और मुफ्त इमेज टूल्स तक — हम आपकी डिजिटल जरूरतें तेज गति से पूरी करते हैं!'
  },
  'hero.cta.primary':   { en: 'Get Instant Service',        hi: 'तुरंत सेवा लें' },
  'hero.cta.secondary': { en: 'Explore 9 Free Image Tools', hi: '9 मुफ्त इमेज टूल्स देखें' },
  'hero.badge1.label':  { en: 'Service Delivery',           hi: 'सेवा वितरण' },
  'hero.badge1.value':  { en: 'Same Day / Express',         hi: 'उसी दिन / एक्सप्रेस' },
  'hero.badge2.label':  { en: 'Customer Rating',            hi: 'ग्राहक रेटिंग' },
  'hero.badge2.value':  { en: '4.9 / 5.0 (500+ Reviews)',  hi: '4.9 / 5.0 (500+ समीक्षाएं)' },
  'hero.guarantee1':    { en: '100% Satisfaction Guaranteed', hi: '100% संतुष्टि की गारंटी' },
  'hero.guarantee2':    { en: 'Fast Direct Support',          hi: 'तेज़ डायरेक्ट सपोर्ट' },
  'hero.guarantee3':    { en: 'GST Waived Offer',             hi: 'GST माफी ऑफर' },

  // ── Services Overview ────────────────────────────────────────────
  'services.heading':   { en: 'Our Services',    hi: 'हमारी सेवाएं' },
  'services.subtext':   {
    en: 'Explore our comprehensive range of digital solutions designed to help individuals and businesses thrive in the modern era.',
    hi: 'आधुनिक युग में व्यक्तियों और व्यवसायों को आगे बढ़ाने के लिए हमारी डिजिटल सेवाओं की विस्तृत श्रृंखला देखें।'
  },
  'services.learnMore': { en: 'Learn more', hi: 'और जानें' },

  // Service card titles
  'service.web.title':       { en: 'Website Development',     hi: 'वेबसाइट डेवलपमेंट' },
  'service.web.desc':        {
    en: 'Premium, fast, and SEO-optimized business websites, portfolios, and e-commerce stores.',
    hi: 'प्रीमियम, तेज़ और SEO-ऑप्टिमाइज़ व्यापारिक वेबसाइट, पोर्टफोलियो और ई-कॉमर्स स्टोर।'
  },
  'service.app.title':       { en: 'Mobile App Development',  hi: 'मोबाइल ऐप डेवलपमेंट' },
  'service.app.desc':        {
    en: 'Custom Android and iOS applications designed for performance and excellent user experience.',
    hi: 'प्रदर्शन और उत्कृष्ट उपयोगकर्ता अनुभव के लिए कस्टम Android और iOS ऐप्लिकेशन।'
  },
  'service.pan.title':       { en: 'PAN Card Services',        hi: 'पैन कार्ड सेवाएं' },
  'service.pan.desc':        {
    en: 'Fast and reliable new PAN card applications and correction services.',
    hi: 'नए पैन कार्ड आवेदन और सुधार सेवाएं तेज़ और भरोसेमंद तरीके से।'
  },
  'service.form.title':      { en: 'Online Form Filling',      hi: 'ऑनलाइन फॉर्म भरना' },
  'service.form.desc':       {
    en: 'Assistance with government forms, exam registrations, and online applications.',
    hi: 'सरकारी फॉर्म, परीक्षा पंजीकरण और ऑनलाइन आवेदनों में सहायता।'
  },
  'service.resume.title':    { en: 'Resume Building',          hi: 'रिज्यूमे बनाना' },
  'service.resume.desc':     {
    en: 'Professional and ATS-friendly resumes and cover letters for job seekers.',
    hi: 'नौकरी चाहने वालों के लिए प्रोफेशनल और ATS-फ्रेंडली रिज्यूमे और कवर लेटर।'
  },
  'service.design.title':    { en: 'Graphic Design',           hi: 'ग्राफिक डिज़ाइन' },
  'service.design.desc':     {
    en: 'Eye-catching logos, banners, social media posts, and complete business branding.',
    hi: 'आकर्षक लोगो, बैनर, सोशल मीडिया पोस्ट और पूर्ण बिज़नेस ब्रांडिंग।'
  },
  'service.marketing.title': { en: 'Digital Marketing',        hi: 'डिजिटल मार्केटिंग' },
  'service.marketing.desc':  {
    en: 'Data-driven SEO, social media management, and online advertising to grow your business.',
    hi: 'डेटा-संचालित SEO, सोशल मीडिया प्रबंधन और ऑनलाइन विज्ञापन से व्यापार बढ़ाएं।'
  },
  'service.support.title':   { en: 'Technical Support',        hi: 'तकनीकी सहायता' },
  'service.support.desc':    {
    en: 'Reliable IT support, software installations, and hardware troubleshooting.',
    hi: 'विश्वसनीय IT सहायता, सॉफ्टवेयर इंस्टॉलेशन और हार्डवेयर समस्या समाधान।'
  },
  'service.image.title':     { en: 'Free Image Tools',         hi: 'मुफ्त इमेज टूल्स' },
  'service.image.desc':      {
    en: 'Compress, resize, crop, convert, passport photo maker & more — all free, right in your browser.',
    hi: 'कंप्रेस, रीसाइज़, क्रॉप, कन्वर्ट, पासपोर्ट फोटो और बहुत कुछ — सब मुफ्त, सीधे ब्राउज़र में।'
  },

  // ── Why Choose Us ────────────────────────────────────────────────
  'why.heading':   { en: 'Why Choose Us?', hi: 'हमें क्यों चुनें?' },
  'why.subtext':   {
    en: "We don't just provide services; we build lasting relationships through trust, quality, and dedication.",
    hi: 'हम केवल सेवाएं नहीं देते; हम विश्वास, गुणवत्ता और समर्पण के माध्यम से स्थायी संबंध बनाते हैं।'
  },
  'why.affordable.title': { en: 'Affordable Pricing',    hi: 'किफायती मूल्य' },
  'why.affordable.desc':  {
    en: 'Premium quality services at competitive and transparent prices with no hidden costs.',
    hi: 'बिना किसी छुपे शुल्क के प्रतिस्पर्धी और पारदर्शी कीमत पर प्रीमियम गुणवत्ता सेवाएं।'
  },
  'why.fast.title':       { en: 'Fast Delivery',          hi: 'तेज़ डिलीवरी' },
  'why.fast.desc':        {
    en: 'We value your time. We ensure quick turnaround times without compromising on quality.',
    hi: 'हम आपके समय की कद्र करते हैं। गुणवत्ता से समझौता किए बिना त्वरित डिलीवरी सुनिश्चित करते हैं।'
  },
  'why.support.title':    { en: 'Professional Support',   hi: 'प्रोफेशनल सहायता' },
  'why.support.desc':     {
    en: 'Dedicated customer service to assist you at every step of your digital journey.',
    hi: 'आपकी डिजिटल यात्रा के हर कदम पर सहायता के लिए समर्पित ग्राहक सेवा।'
  },
  'why.secure.title':     { en: 'Secure Payments',        hi: 'सुरक्षित भुगतान' },
  'why.secure.desc':      {
    en: '100% secure payment gateways and data protection protocols to keep you safe.',
    hi: 'आपकी सुरक्षा के लिए 100% सुरक्षित पेमेंट गेटवे और डेटा सुरक्षा प्रोटोकॉल।'
  },
  'why.tech.title':       { en: 'Modern Technologies',    hi: 'आधुनिक तकनीक' },
  'why.tech.desc':        {
    en: 'We use the latest tech stacks to ensure your products are future-proof.',
    hi: 'हम नवीनतम तकनीक का उपयोग करते हैं ताकि आपके उत्पाद भविष्य-सुरक्षित हों।'
  },
  'why.satisfaction.title': { en: 'Customer Satisfaction', hi: 'ग्राहक संतुष्टि' },
  'why.satisfaction.desc':  {
    en: 'Our primary goal is to exceed your expectations and deliver complete satisfaction.',
    hi: 'हमारा प्राथमिक लक्ष्य आपकी अपेक्षाओं को पार करना और पूर्ण संतुष्टि प्रदान करना है।'
  },

  // ── Statistics ───────────────────────────────────────────────────
  'stats.projects':  { en: 'Projects Completed',          hi: 'प्रोजेक्ट पूर्ण हुए' },
  'stats.clients':   { en: 'Happy Clients',               hi: 'संतुष्ट ग्राहक' },
  'stats.websites':  { en: 'Websites Built',              hi: 'वेबसाइट बनाई' },
  'stats.services':  { en: 'Digital Services Delivered',  hi: 'डिजिटल सेवाएं दी गईं' },

  // ── Contact CTA ──────────────────────────────────────────────────
  'cta.heading':     {
    en: 'Ready to Transform Your Business Digitally?',
    hi: 'क्या आप अपने व्यापार को डिजिटल रूप से बदलने के लिए तैयार हैं?'
  },
  'cta.subtext':     {
    en: "Get in touch with us today for a free consultation. Let's discuss your ideas and bring them to life with cutting-edge technology.",
    hi: 'आज ही हमसे नि:शुल्क परामर्श के लिए संपर्क करें। आइए आपके विचारों पर चर्चा करें और उन्हें अत्याधुनिक तकनीक से जीवंत बनाएं।'
  },
  'cta.btn.project': { en: 'Start a Project', hi: 'प्रोजेक्ट शुरू करें' },
  'cta.btn.call':    { en: 'Call Us Now',     hi: 'अभी कॉल करें' },

  // ── Customer Reviews ─────────────────────────────────────────────
  'reviews.heading': { en: 'What Our Clients Say',         hi: 'हमारे ग्राहक क्या कहते हैं' },
  'reviews.subtext': {
    en: "Don't just take our word for it. Here is what people are saying about Sandy Digital Hub.",
    hi: 'केवल हमारी बात पर विश्वास न करें। देखें लोग Sandy Digital Hub के बारे में क्या कह रहे हैं।'
  },

  // ── Portfolio ────────────────────────────────────────────────────
  'portfolio.heading':  { en: 'Featured Projects',    hi: 'प्रमुख प्रोजेक्ट' },
  'portfolio.subtext':  {
    en: 'Take a look at some of our recent work. We take pride in delivering high-quality digital products.',
    hi: 'हमारे हाल के कुछ कामों पर एक नज़र डालें। हमें उच्च-गुणवत्ता के डिजिटल उत्पाद देने पर गर्व है।'
  },
  'portfolio.viewAll':  { en: 'View All Projects',    hi: 'सभी प्रोजेक्ट देखें' },
  'portfolio.viewLive': { en: 'View Live Project',    hi: 'लाइव प्रोजेक्ट देखें' },

  // ── Footer ───────────────────────────────────────────────────────
  'footer.tagline':     {
    en: 'Your One-Stop Digital Solution Center for Website Development, Mobile Apps, and Digital Services.',
    hi: 'वेबसाइट डेवलपमेंट, मोबाइल ऐप और डिजिटल सेवाओं के लिए आपका वन-स्टॉप डिजिटल सॉल्यूशन सेंटर।'
  },
  'footer.features':    { en: 'Features & Tools',    hi: 'फीचर्स और टूल्स' },
  'footer.company':     { en: 'Company',             hi: 'कंपनी' },
  'footer.legal':       { en: 'Legal',               hi: 'कानूनी' },
  'footer.contact':     { en: 'Contact Info',        hi: 'संपर्क जानकारी' },
  'footer.checklist':   { en: 'Document Checklist',     hi: 'दस्तावेज़ चेकलिस्ट' },
  'footer.calculator':  { en: 'Price Calculator',        hi: 'मूल्य कैल्कुलेटर' },
  'footer.trackorder':  { en: 'Track Order Status',      hi: 'ऑर्डर ट्रैक करें' },
  'footer.portfolio':   { en: 'Portfolio & Projects',    hi: 'पोर्टफोलियो और प्रोजेक्ट' },
  'footer.tools':       { en: 'Free Web Tools Hub',      hi: 'मुफ्त वेब टूल्स हब' },
  'footer.about':       { en: 'About Us',                   hi: 'हमारे बारे में' },
  'footer.portfoliolink': { en: 'Portfolio Case Studies',   hi: 'पोर्टफोलियो केस स्टडीज़' },
  'footer.pricing':     { en: 'Pricing',                    hi: 'मूल्य निर्धारण' },
  'footer.contactus':   { en: 'Contact Us',                 hi: 'संपर्क करें' },
  'footer.terms':       { en: 'Terms & Conditions',         hi: 'नियम और शर्तें' },
  'footer.privacy':     { en: 'Privacy Policy',             hi: 'गोपनीयता नीति' },
  'footer.refund':      { en: 'Refund & Cancellation',      hi: 'रिफंड और रद्दीकरण' },
  'footer.refundpolicy': { en: 'Refund Policy',             hi: 'रिफंड नीति' },
  'footer.copyright':   { en: '© {year} Sandy Digital Hub. All rights reserved.', hi: '© {year} Sandy Digital Hub. सर्वाधिकार सुरक्षित।' },

  // ── General ──────────────────────────────────────────────────────
  'Apply Online':       { en: 'Apply Online',       hi: 'ऑनलाइन आवेदन करें' },
  'Proceed to Checkout': { en: 'Proceed to Checkout', hi: 'चेकआउट पर जाएं' },
  'Track Status':       { en: 'Track Status',        hi: 'स्थिति ट्रैक करें' },
  Search:               { en: 'Search',              hi: 'खोजें' },
} as const;
