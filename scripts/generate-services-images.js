const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const brainDir =
  "/Users/sandycoder/.gemini/antigravity-ide/brain/ef0cdd98-b5a5-4632-9f70-9815a4a057ad";
const outDir = "/Users/sandycoder/sandydigitalhub/public/services";

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. Map existing generated AI images to their webp filenames
const aiImageMap = {
  "resume-cover-letter.webp": "resume_cover_letter_1788022116165.jpg",
  "pan-application-correction.webp": "pan_app_correction_1788022147839.jpg",
  "pf-epfo-kyc.webp": "pf_epfo_kyc_1788022171840.jpg",
  "up-scholarship.webp": "up_scholarship_1788022228255.jpg",
  "passport-photo-printing.webp": "passport_photo_print_1788022269189.jpg",
  "aadhaar-download-print.webp": "aadhaar_download_print_1788022310272.jpg",
  "pan-correction.webp": "pan_card_correction_1788022333623.jpg",
  "pan-new-application.webp": "pan_new_application_1788022352910.jpg",
  "passport-application.webp": "passport_application_1788022376687.jpg",
  "income-certificate.webp": "income_certificate_1788022527830.jpg",
  "caste-certificate.webp": "caste_certificate_1788022574057.jpg",
  "khasra-khatauni-bhulekh.webp": "bhulekh_land_records_1788022599744.jpg",
};

async function processAiImages() {
  for (const [targetName, srcName] of Object.entries(aiImageMap)) {
    const srcPath = path.join(brainDir, srcName);
    const destPath = path.join(outDir, targetName);
    if (fs.existsSync(srcPath)) {
      await sharp(srcPath)
        .resize(1280, 720, { fit: "cover", position: "center" })
        .webp({ quality: 88, effort: 6 })
        .toFile(destPath);
      console.log(`Converted AI image -> ${targetName}`);
    } else {
      console.warn(`Source file missing: ${srcPath}`);
    }
  }
}

// 2. High-quality 3D Hybrid SVG generators for the remaining 9 images
function generateSvgResidenceCertificate() {
  return `
  <svg width="1280" height="720" viewBox="0 0 1280 720" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bgGlow" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#1E1B4B" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#070B19" stop-opacity="1"/>
      </radialGradient>
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1E293B" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#0F172A" stop-opacity="0.95"/>
      </linearGradient>
      <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#06B6D4"/>
        <stop offset="100%" stop-color="#3B82F6"/>
      </linearGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FBBF24"/>
        <stop offset="100%" stop-color="#D97706"/>
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="20" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
      <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="125%">
        <feDropShadow dx="0" dy="25" stdDeviation="30" flood-color="#000000" flood-opacity="0.6"/>
      </filter>
    </defs>
    <rect width="1280" height="720" fill="#070B19"/>
    <rect width="1280" height="720" fill="url(#bgGlow)"/>
    
    <!-- Abstract Ambient Cyber Circles & Grid -->
    <g opacity="0.15" stroke="#38BDF8" stroke-width="1.5">
      <circle cx="640" cy="360" r="300" stroke-dasharray="10 15"/>
      <circle cx="640" cy="360" r="420"/>
      <line x1="140" y1="360" x2="1140" y2="360" stroke-dasharray="8 8"/>
      <line x1="640" y1="80" x2="640" y2="640" stroke-dasharray="8 8"/>
    </g>

    <!-- Glowing Orbs in Background -->
    <circle cx="380" cy="240" r="140" fill="#8B5CF6" opacity="0.18" filter="url(#glow)"/>
    <circle cx="900" cy="480" r="160" fill="#06B6D4" opacity="0.18" filter="url(#glow)"/>

    <!-- Left 3D Floating House & Location Pin -->
    <g transform="translate(180, 220)" filter="url(#cardShadow)">
      <rect x="0" y="0" width="220" height="260" rx="24" fill="url(#cardGrad)" stroke="#334155" stroke-width="2"/>
      <!-- House Icon 3D -->
      <path d="M110 50 L40 110 H60 V190 H160 V110 H180 Z" fill="url(#cyanGrad)" filter="url(#glow)"/>
      <path d="M95 140 H125 V190 H95 Z" fill="#0F172A"/>
      <!-- Location Pin Glow -->
      <circle cx="110" cy="100" r="14" fill="#FBBF24"/>
      <text x="110" y="230" text-anchor="middle" fill="#E2E8F0" font-family="system-ui, sans-serif" font-weight="800" font-size="14" letter-spacing="1">DOMICILE RESIDENCE</text>
    </g>

    <!-- Center 3D Laptop with Domicile Certificate Preview -->
    <g transform="translate(440, 150)" filter="url(#cardShadow)">
      <!-- Laptop Screen Outer Frame -->
      <rect x="0" y="0" width="460" height="300" rx="20" fill="#0F172A" stroke="#38BDF8" stroke-width="2.5"/>
      <rect x="15" y="15" width="430" height="270" rx="14" fill="#020617"/>
      
      <!-- Certificate Document Inside Screen -->
      <rect x="40" y="35" width="380" height="230" rx="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2"/>
      <rect x="55" y="50" width="350" height="200" fill="none" stroke="#D97706" stroke-width="1.5" stroke-dasharray="4 2"/>
      
      <!-- Certificate Header -->
      <text x="230" y="80" text-anchor="middle" fill="#1E293B" font-family="system-ui, sans-serif" font-weight="900" font-size="16">GOVERNMENT DIGITAL FACILITATION</text>
      <text x="230" y="102" text-anchor="middle" fill="#0284C7" font-family="system-ui, sans-serif" font-weight="800" font-size="14" letter-spacing="1.5">RESIDENCE / DOMICILE CERTIFICATE</text>
      <line x1="90" y1="115" x2="370" y2="115" stroke="#E2E8F0" stroke-width="2"/>
      
      <!-- Mock Form Lines -->
      <rect x="80" y="130" width="120" height="10" rx="4" fill="#94A3B8"/>
      <rect x="220" y="130" width="140" height="10" rx="4" fill="#CBD5E1"/>
      <rect x="80" y="155" width="140" height="10" rx="4" fill="#94A3B8"/>
      <rect x="240" y="155" width="120" height="10" rx="4" fill="#CBD5E1"/>
      <rect x="80" y="180" width="100" height="10" rx="4" fill="#94A3B8"/>
      <rect x="200" y="180" width="160" height="10" rx="4" fill="#CBD5E1"/>

      <!-- Verified Badge in Certificate -->
      <g transform="translate(180, 205)">
        <rect x="0" y="0" width="100" height="26" rx="13" fill="#10B981"/>
        <text x="50" y="18" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="900" font-size="11">✓ VERIFIED</text>
      </g>

      <!-- Laptop Base -->
      <path d="M-40 300 L500 300 L460 325 L0 325 Z" fill="#1E293B" stroke="#475569" stroke-width="1.5"/>
      <rect x="180" y="302" width="100" height="6" rx="3" fill="#64748B"/>
    </g>

    <!-- Right 3D Verification Shield -->
    <g transform="translate(940, 220)" filter="url(#cardShadow)">
      <rect x="0" y="0" width="180" height="240" rx="24" fill="url(#cardGrad)" stroke="#334155" stroke-width="2"/>
      <path d="M90 40 L140 65 V125 C140 165 90 190 90 190 C90 190 40 165 40 125 V65 Z" fill="url(#cyanGrad)" filter="url(#glow)"/>
      <path d="M75 110 L85 125 L110 95" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="90" y="215" text-anchor="middle" fill="#38BDF8" font-family="system-ui, sans-serif" font-weight="800" font-size="12" letter-spacing="1">100% ONLINE</text>
    </g>
  </svg>
  `;
}

function generateSvgRationCard() {
  return `
  <svg width="1280" height="720" viewBox="0 0 1280 720" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bgGlow" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#1E1B4B" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="#070B19" stop-opacity="1"/>
      </radialGradient>
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1E293B" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="#0F172A" stop-opacity="0.98"/>
      </linearGradient>
      <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#14B8A6"/>
        <stop offset="100%" stop-color="#0284C7"/>
      </linearGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F59E0B"/>
        <stop offset="100%" stop-color="#D97706"/>
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="18" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
      <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="125%">
        <feDropShadow dx="0" dy="25" stdDeviation="30" flood-color="#000000" flood-opacity="0.6"/>
      </filter>
    </defs>
    <rect width="1280" height="720" fill="#070B19"/>
    <rect width="1280" height="720" fill="url(#bgGlow)"/>

    <!-- Ambient glows -->
    <circle cx="340" cy="300" r="160" fill="#06B6D4" opacity="0.15" filter="url(#glow)"/>
    <circle cx="940" cy="380" r="160" fill="#8B5CF6" opacity="0.15" filter="url(#glow)"/>

    <!-- Central 3D Smart Ration Card & Family Portal -->
    <g transform="translate(320, 160)" filter="url(#cardShadow)">
      <!-- Main Digital Ration Booklet / Smart Card -->
      <rect x="0" y="0" width="640" height="380" rx="28" fill="url(#cardGrad)" stroke="#38BDF8" stroke-width="2.5"/>
      <rect x="20" y="20" width="600" height="340" rx="20" fill="#020617" stroke="#1E293B" stroke-width="1.5"/>

      <!-- Header Strip -->
      <rect x="20" y="20" width="600" height="70" rx="20" fill="url(#tealGrad)"/>
      <text x="60" y="55" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="900" font-size="22" letter-spacing="1">NATIONAL RATION CARD PORTAL</text>
      <text x="60" y="75" fill="#E0F2FE" font-family="system-ui, sans-serif" font-weight="700" font-size="13">ONLINE APPLICATION &amp; FAMILY UNIT MANAGEMENT</text>

      <!-- Left: Family Unit Silhouettes & Add Member -->
      <g transform="translate(50, 120)">
        <rect x="0" y="0" width="240" height="190" rx="16" fill="#0F172A" stroke="#334155" stroke-width="1.5"/>
        <text x="20" y="30" fill="#38BDF8" font-family="system-ui, sans-serif" font-weight="800" font-size="13">REGISTERED FAMILY UNITS</text>
        
        <!-- Family Icons -->
        <circle cx="50" cy="70" r="16" fill="#64748B"/>
        <path d="M30 110 C30 95 70 95 70 110 Z" fill="#64748B"/>
        
        <circle cx="100" cy="70" r="16" fill="#64748B"/>
        <path d="M80 110 C80 95 120 95 120 110 Z" fill="#64748B"/>

        <!-- Add Member Button -->
        <g transform="translate(150, 55)">
          <circle cx="30" cy="30" r="28" fill="url(#tealGrad)" filter="url(#glow)"/>
          <path d="M30 18 V42 M18 30 H42" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
        </g>
        <text x="120" y="155" text-anchor="middle" fill="#10B981" font-family="system-ui, sans-serif" font-weight="800" font-size="12">✓ 4 MEMBERS ENROLLED</text>
        <text x="120" y="175" text-anchor="middle" fill="#94A3B8" font-family="system-ui, sans-serif" font-weight="700" font-size="11">+ ADD NEW MEMBER</text>
      </g>

      <!-- Right: Card Details & QR Verification -->
      <g transform="translate(320, 120)">
        <rect x="0" y="0" width="260" height="190" rx="16" fill="#0F172A" stroke="#334155" stroke-width="1.5"/>
        <text x="20" y="30" fill="#FBBF24" font-family="system-ui, sans-serif" font-weight="800" font-size="13">RATION BENEFIT STATUS</text>
        <rect x="20" y="50" width="120" height="10" rx="4" fill="#64748B"/>
        <rect x="20" y="70" width="160" height="10" rx="4" fill="#475569"/>
        <rect x="20" y="90" width="100" height="10" rx="4" fill="#475569"/>
        
        <!-- Status Pill -->
        <rect x="20" y="130" width="140" height="32" rx="16" fill="#059669"/>
        <text x="90" y="151" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="900" font-size="12">ACTIVE ALLOTMENT</text>

        <!-- QR code box -->
        <rect x="180" y="105" width="60" height="60" rx="8" fill="#FFFFFF"/>
        <rect x="188" y="113" width="44" height="44" fill="#0F172A"/>
        <rect x="196" y="121" width="28" height="28" fill="#FFFFFF"/>
        <rect x="204" y="129" width="12" height="12" fill="#0F172A"/>
      </g>
    </g>
  </svg>
  `;
}

function generateSvgVoterId() {
  return `
  <svg width="1280" height="720" viewBox="0 0 1280 720" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bgGlow" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#1E1B4B" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="#070B19" stop-opacity="1"/>
      </radialGradient>
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1E293B" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="#0F172A" stop-opacity="0.98"/>
      </linearGradient>
      <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#7C3AED"/>
        <stop offset="100%" stop-color="#3B82F6"/>
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="20" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
      <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="125%">
        <feDropShadow dx="0" dy="25" stdDeviation="30" flood-color="#000000" flood-opacity="0.6"/>
      </filter>
    </defs>
    <rect width="1280" height="720" fill="#070B19"/>
    <rect width="1280" height="720" fill="url(#bgGlow)"/>

    <!-- Glowing Accents -->
    <circle cx="400" cy="280" r="180" fill="#7C3AED" opacity="0.18" filter="url(#glow)"/>
    <circle cx="880" cy="440" r="180" fill="#06B6D4" opacity="0.18" filter="url(#glow)"/>

    <!-- Central 3D Digital Voter ID Card & Verification Interface -->
    <g transform="translate(340, 160)" filter="url(#cardShadow)">
      <!-- Outer Card Frame -->
      <rect x="0" y="0" width="600" height="380" rx="28" fill="url(#cardGrad)" stroke="#818CF8" stroke-width="2.5"/>
      <rect x="18" y="18" width="564" height="344" rx="20" fill="#020617"/>

      <!-- Header Strip -->
      <rect x="18" y="18" width="564" height="65" rx="20" fill="url(#purpleGrad)"/>
      <text x="50" y="52" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="900" font-size="20" letter-spacing="1">ELECTION COMMISION FACILITATION</text>
      <text x="50" y="70" fill="#E0E7FF" font-family="system-ui, sans-serif" font-weight="700" font-size="12">VOTER ID CARD (EPIC) ENROLLMENT &amp; CORRECTION</text>

      <!-- Photo Box Generic Silhouette -->
      <rect x="50" y="110" width="130" height="160" rx="14" fill="#0F172A" stroke="#475569" stroke-width="1.5"/>
      <circle cx="115" cy="165" r="28" fill="#64748B"/>
      <path d="M80 230 C80 205 150 205 150 230 Z" fill="#64748B"/>
      <text x="115" y="255" text-anchor="middle" fill="#94A3B8" font-family="system-ui, sans-serif" font-weight="700" font-size="10">EPIC CARDHOLDER</text>

      <!-- Right Form / Details Section -->
      <g transform="translate(210, 110)">
        <rect x="0" y="0" width="340" height="160" rx="14" fill="#0F172A" stroke="#334155" stroke-width="1.5"/>
        <text x="20" y="30" fill="#38BDF8" font-family="system-ui, sans-serif" font-weight="800" font-size="13">ELECTORAL IDENTITY DATA</text>
        <rect x="20" y="48" width="180" height="10" rx="4" fill="#64748B"/>
        <rect x="20" y="68" width="220" height="10" rx="4" fill="#475569"/>
        <rect x="20" y="88" width="150" height="10" rx="4" fill="#475569"/>
             <!-- Editable / Correction Indicator -->
        <g transform="translate(20, 115)">
          <rect x="0" y="0" width="140" height="28" rx="8" fill="#4338CA"/>
          <text x="70" y="18" text-anchor="middle" fill="#E0E7FF" font-family="system-ui, sans-serif" font-weight="800" font-size="11">CORRECTION READY</text>
        </g>
      </g>

      <!-- Bottom Verification Checkmark Bar -->
      <g transform="translate(50, 295)">
        <rect x="0" y="0" width="500" height="45" rx="12" fill="#064E3B" stroke="#059669" stroke-width="1.5"/>
        <circle cx="30" cy="22" r="12" fill="#10B981"/>
        <path d="M24 22 L28 26 L36 18" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
        <text x="55" y="27" fill="#6EE7B7" font-family="system-ui, sans-serif" font-weight="800" font-size="12">ONLINE POLLING BOOTH &amp; ADDRESS VERIFICATION ACTIVE</text>
      </g>
    </g>
  </svg>
  `;
}

function generateSvgDocumentPrintingBw() {
  return `
  <svg width="1280" height="720" viewBox="0 0 1280 720" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bgGlow" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#1E293B" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#070B19" stop-opacity="1"/>
      </radialGradient>
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1E293B" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="#0F172A" stop-opacity="0.98"/>
      </linearGradient>
      <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#E2E8F0"/>
        <stop offset="100%" stop-color="#64748B"/>
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="20" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
      <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="125%">
        <feDropShadow dx="0" dy="25" stdDeviation="30" flood-color="#000000" flood-opacity="0.6"/>
      </filter>
    </defs>
    <rect width="1280" height="720" fill="#070B19"/>
    <rect width="1280" height="720" fill="url(#bgGlow)"/>

    <!-- Subtle Circuit & Tech Accents -->
    <circle cx="640" cy="360" r="280" stroke="#475569" stroke-width="1" stroke-dasharray="10 10" opacity="0.25"/>
    <circle cx="640" cy="300" r="160" fill="#38BDF8" opacity="0.12" filter="url(#glow)"/>

    <!-- 3D High-Tech Monochrome Laser Printer Scene -->
    <g transform="translate(390, 160)" filter="url(#cardShadow)">
      <!-- Main Laser Printer Body -->
      <rect x="0" y="60" width="500" height="280" rx="28" fill="#1E293B" stroke="#64748B" stroke-width="2.5"/>
      <rect x="20" y="80" width="460" height="240" rx="20" fill="#0F172A"/>

      <!-- Printer Control Display -->
      <rect x="50" y="110" width="160" height="60" rx="10" fill="#020617" stroke="#38BDF8" stroke-width="1.5"/>
      <text x="65" y="135" fill="#38BDF8" font-family="system-ui, sans-serif" font-weight="900" font-size="12">LASER PRINT B&amp;W</text>
      <text x="65" y="155" fill="#10B981" font-family="system-ui, sans-serif" font-weight="800" font-size="11">READY 1200 DPI</text>

      <!-- Paper Tray / Output Feeder Slot -->
      <rect x="50" y="190" width="400" height="15" rx="7" fill="#020617"/>
      
      <!-- Crisply Ejected B&W Document -->
      <g transform="translate(140, 198)" filter="url(#cardShadow)">
        <rect x="0" y="0" width="220" height="190" rx="10" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2"/>
        <!-- Clean Black Lines & Typography Structure -->
        <rect x="25" y="25" width="110" height="12" rx="4" fill="#0F172A"/>
        <rect x="25" y="48" width="170" height="6" rx="3" fill="#334155"/>
        <rect x="25" y="60" width="170" height="6" rx="3" fill="#334155"/>
        <rect x="25" y="72" width="140" height="6" rx="3" fill="#334155"/>
        
        <!-- Monochrome Chart / Data Block -->
        <rect x="25" y="90" width="80" height="50" rx="6" fill="#E2E8F0" stroke="#64748B"/>
        <line x1="35" y1="125" x2="50" y2="105" stroke="#0F172A" stroke-width="3"/>
        <line x1="50" y1="105" x2="70" y2="120" stroke="#0F172A" stroke-width="3"/>
        <line x1="70" y1="120" x2="90" y2="98" stroke="#0F172A" stroke-width="3"/>

        <!-- Text Block Right -->
        <rect x="115" y="92" width="80" height="6" rx="3" fill="#475569"/>
        <rect x="115" y="104" width="80" height="6" rx="3" fill="#475569"/>
        <rect x="115" y="116" width="60" height="6" rx="3" fill="#475569"/>
      </g>

      <!-- Printer Paper Stack Top Input -->
      <path d="M120 60 L140 10 H360 L380 60 Z" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2"/>
    </g>
  </svg>
  `;
}

function generateSvgDocumentPrintingColor() {
  return `
  <svg width="1280" height="720" viewBox="0 0 1280 720" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bgGlow" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#1E1B4B" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#070B19" stop-opacity="1"/>
      </radialGradient>
      <linearGradient id="cmykGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#06B6D4"/>
        <stop offset="33%" stop-color="#EC4899"/>
        <stop offset="66%" stop-color="#FACC15"/>
        <stop offset="100%" stop-color="#10B981"/>
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="20" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
      <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="125%">
        <feDropShadow dx="0" dy="25" stdDeviation="30" flood-color="#000000" flood-opacity="0.6"/>
      </filter>
    </defs>
    <rect width="1280" height="720" fill="#070B19"/>
    <rect width="1280" height="720" fill="url(#bgGlow)"/>

    <!-- Colorful Ambient Glows -->
    <circle cx="380" cy="260" r="160" fill="#06B6D4" opacity="0.2" filter="url(#glow)"/>
    <circle cx="900" cy="420" r="160" fill="#EC4899" opacity="0.2" filter="url(#glow)"/>

    <!-- 3D High-Resolution Full Color Printer Scene -->
    <g transform="translate(390, 160)" filter="url(#cardShadow)">
      <!-- Main Printer Body with Cyan/Pink Glow Highlights -->
      <rect x="0" y="60" width="500" height="280" rx="28" fill="#1E293B" stroke="#06B6D4" stroke-width="2.5"/>
      <rect x="20" y="80" width="460" height="240" rx="20" fill="#0F172A"/>

      <!-- CMYK Indicator Bar -->
      <rect x="50" y="100" width="180" height="8" rx="4" fill="url(#cmykGrad)"/>

      <!-- Printer Control Display -->
      <rect x="50" y="120" width="180" height="55" rx="10" fill="#020617" stroke="#EC4899" stroke-width="1.5"/>
      <text x="65" y="142" fill="#F472B6" font-family="system-ui, sans-serif" font-weight="900" font-size="12">COLOR INKJET HD</text>
      <text x="65" y="160" fill="#38BDF8" font-family="system-ui, sans-serif" font-weight="800" font-size="11">4800 DPI GLOSSY</text>

      <!-- Paper Tray Output Slot -->
      <rect x="50" y="190" width="400" height="15" rx="7" fill="#020617"/>

      <!-- Vibrant Colorful Ejected Document -->
      <g transform="translate(140, 198)" filter="url(#cardShadow)">
        <rect x="0" y="0" width="220" height="190" rx="10" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
        
        <!-- Colorful Header Block -->
        <rect x="25" y="22" width="170" height="20" rx="6" fill="url(#cmykGrad)"/>
        
        <!-- Vibrant Pie & Bar Charts -->
        <circle cx="65" cy="85" r="28" fill="#3B82F6"/>
        <path d="M65 85 L65 57 A28 28 0 0 1 93 85 Z" fill="#EC4899"/>
        <path d="M65 85 L93 85 A28 28 0 0 1 65 113 Z" fill="#F59E0B"/>

        <!-- Color Bars Right -->
        <rect x="110" y="65" width="80" height="8" rx="4" fill="#06B6D4"/>
        <rect x="110" y="80" width="65" height="8" rx="4" fill="#8B5CF6"/>
        <rect x="110" y="95" width="75" height="8" rx="4" fill="#10B981"/>

        <!-- Photo / Graphics block -->
        <rect x="25" y="125" width="170" height="45" rx="8" fill="#F1F5F9" stroke="#E2E8F0"/>
        <circle cx="50" cy="147" r="14" fill="#F59E0B"/>
        <path d="M75 160 L95 140 L115 155 L135 135 L160 160 Z" fill="#3B82F6"/>
      </g>

      <!-- Paper Input Top -->
      <path d="M120 60 L140 10 H360 L380 60 Z" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
    </g>
  </svg>
  `;
}

function generateSvgPhotocopyBw() {
  return `
  <svg width="1280" height="720" viewBox="0 0 1280 720" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bgGlow" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#1E293B" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#070B19" stop-opacity="1"/>
      </radialGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="20" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
      <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="125%">
        <feDropShadow dx="0" dy="25" stdDeviation="30" flood-color="#000000" flood-opacity="0.6"/>
      </filter>
    </defs>
    <rect width="1280" height="720" fill="#070B19"/>
    <rect width="1280" height="720" fill="url(#bgGlow)"/>

    <circle cx="640" cy="300" r="160" fill="#38BDF8" opacity="0.1" filter="url(#glow)"/>

    <!-- 3D Multifunction Photocopier Scanning Glass & Monochrome Output -->
    <g transform="translate(360, 140)" filter="url(#cardShadow)">
      <!-- Large Commercial Photocopier Unit -->
      <rect x="0" y="40" width="560" height="340" rx="32" fill="#1E293B" stroke="#475569" stroke-width="2.5"/>
      <rect x="25" y="65" width="510" height="290" rx="24" fill="#0F172A"/>

      <!-- Scanner Glass Bed (Light Bar Active) -->
      <rect x="60" y="90" width="440" height="120" rx="14" fill="#020617" stroke="#38BDF8" stroke-width="2"/>
      
      <!-- Cyan Scanner Light Beam Scanning Across Document -->
      <rect x="260" y="92" width="18" height="116" rx="6" fill="#38BDF8" filter="url(#glow)"/>

      <!-- Scanned Original Document on Glass -->
      <rect x="100" y="105" width="140" height="90" rx="6" fill="#FFFFFF" opacity="0.9"/>
      <rect x="115" y="120" width="70" height="8" rx="2" fill="#0F172A"/>
      <rect x="115" y="135" width="110" height="4" rx="1" fill="#475569"/>
      <rect x="115" y="145" width="110" height="4" rx="1" fill="#475569"/>
      <rect x="115" y="155" width="90" height="4" rx="1" fill="#475569"/>

      <!-- Control Panel Display & Keypad -->
      <g transform="translate(60, 230)">
        <rect x="0" y="0" width="180" height="90" rx="12" fill="#020617" stroke="#64748B" stroke-width="1.5"/>
        <text x="20" y="30" fill="#38BDF8" font-family="system-ui, sans-serif" font-weight="900" font-size="13">PHOTOCOPY B&amp;W</text>
        <text x="20" y="52" fill="#10B981" font-family="system-ui, sans-serif" font-weight="800" font-size="11">COPIES: 50 | 100%</text>
        <rect x="20" y="62" width="140" height="18" rx="9" fill="#2563EB"/>
        <text x="90" y="75" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="900" font-size="10">COPYING ACTIVE</text>
      </g>

      <!-- Output Tray with Stacked Monochrome Copies -->
      <g transform="translate(280, 230)">
        <rect x="0" y="0" width="220" height="90" rx="12" fill="#020617" stroke="#475569" stroke-width="1.5"/>
        <!-- Layered Papers Output -->
        <rect x="25" y="15" width="170" height="60" rx="6" fill="#E2E8F0" stroke="#94A3B8"/>
        <rect x="20" y="20" width="170" height="60" rx="6" fill="#F8FAFC" stroke="#CBD5E1"/>
        <rect x="35" y="32" width="80" height="6" rx="2" fill="#0F172A"/>
        <rect x="35" y="44" width="140" height="4" rx="1" fill="#64748B"/>
        <rect x="35" y="52" width="140" height="4" rx="1" fill="#64748B"/>
      </g>
    </g>
  </svg>
  `;
}

function generateSvgPhotocopyColor() {
  return `
  <svg width="1280" height="720" viewBox="0 0 1280 720" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bgGlow" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#1E1B4B" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#070B19" stop-opacity="1"/>
      </radialGradient>
      <linearGradient id="colorGlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#06B6D4"/>
        <stop offset="50%" stop-color="#EC4899"/>
        <stop offset="100%" stop-color="#F59E0B"/>
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="20" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
      <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="125%">
        <feDropShadow dx="0" dy="25" stdDeviation="30" flood-color="#000000" flood-opacity="0.6"/>
      </filter>
    </defs>
    <rect width="1280" height="720" fill="#070B19"/>
    <rect width="1280" height="720" fill="url(#bgGlow)"/>

    <!-- Colorful Ambient Glows -->
    <circle cx="340" cy="300" r="160" fill="#EC4899" opacity="0.18" filter="url(#glow)"/>
    <circle cx="940" cy="400" r="160" fill="#06B6D4" opacity="0.18" filter="url(#glow)"/>

    <!-- 3D Commercial Color Photocopier Unit -->
    <g transform="translate(360, 140)" filter="url(#cardShadow)">
      <rect x="0" y="40" width="560" height="340" rx="32" fill="#1E293B" stroke="#06B6D4" stroke-width="2.5"/>
      <rect x="25" y="65" width="510" height="290" rx="24" fill="#0F172A"/>

      <!-- Scanner Glass Bed with Multicolored Scanning Beam -->
      <rect x="60" y="90" width="440" height="120" rx="14" fill="#020617" stroke="#EC4899" stroke-width="2"/>
      
      <!-- Multi-spectrum Scanner Light Beam -->
      <rect x="270" y="92" width="20" height="116" rx="6" fill="url(#colorGlowGrad)" filter="url(#glow)"/>

      <!-- Original Colorful Document on Scanner Glass -->
      <g transform="translate(90, 105)">
        <rect x="0" y="0" width="150" height="90" rx="6" fill="#FFFFFF"/>
        <rect x="15" y="15" width="120" height="14" rx="4" fill="url(#colorGlowGrad)"/>
        <circle cx="35" cy="55" r="16" fill="#3B82F6"/>
        <path d="M35 55 L35 39 A16 16 0 0 1 51 55 Z" fill="#EC4899"/>
        <rect x="65" y="45" width="60" height="6" rx="3" fill="#10B981"/>
        <rect x="65" y="58" width="50" height="6" rx="3" fill="#F59E0B"/>
      </g>

      <!-- Control Panel Display & Keypad -->
      <g transform="translate(60, 230)">
        <rect x="0" y="0" width="180" height="90" rx="12" fill="#020617" stroke="#EC4899" stroke-width="1.5"/>
        <text x="20" y="30" fill="#F472B6" font-family="system-ui, sans-serif" font-weight="900" font-size="13">PHOTOCOPY COLOR</text>
        <text x="20" y="52" fill="#38BDF8" font-family="system-ui, sans-serif" font-weight="800" font-size="11">CMYK HI-RES PRO</text>
        <rect x="20" y="62" width="140" height="18" rx="9" fill="#EC4899"/>
        <text x="90" y="75" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="900" font-size="10">COLOR DUPLEX</text>
      </g>

      <!-- Output Tray with Stacked Full-Color Copies -->
      <g transform="translate(280, 230)">
        <rect x="0" y="0" width="220" height="90" rx="12" fill="#020617" stroke="#38BDF8" stroke-width="1.5"/>
        <rect x="20" y="20" width="170" height="60" rx="6" fill="#FFFFFF" stroke="#CBD5E1"/>
        <rect x="35" y="30" width="140" height="10" rx="3" fill="url(#colorGlowGrad)"/>
        <circle cx="50" cy="55" r="10" fill="#3B82F6"/>
        <rect x="70" y="48" width="80" height="5" rx="2" fill="#10B981"/>
        <rect x="70" y="58" width="65" height="5" rx="2" fill="#EC4899"/>
      </g>
    </g>
  </svg>
  `;
}

function generateSvgDrivingLicense() {
  return `
  <svg width="1280" height="720" viewBox="0 0 1280 720" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bgGlow" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#1E1B4B" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="#070B19" stop-opacity="1"/>
      </radialGradient>
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1E293B" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="#0F172A" stop-opacity="0.98"/>
      </linearGradient>
      <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F59E0B"/>
        <stop offset="100%" stop-color="#D97706"/>
      </linearGradient>
      <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#3B82F6"/>
        <stop offset="100%" stop-color="#1D4ED8"/>
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="20" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
      <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="125%">
        <feDropShadow dx="0" dy="25" stdDeviation="30" flood-color="#000000" flood-opacity="0.6"/>
      </filter>
    </defs>
    <rect width="1280" height="720" fill="#070B19"/>
    <rect width="1280" height="720" fill="url(#bgGlow)"/>

    <circle cx="360" cy="280" r="180" fill="#3B82F6" opacity="0.18" filter="url(#glow)"/>
    <circle cx="920" cy="420" r="180" fill="#F59E0B" opacity="0.18" filter="url(#glow)"/>

    <!-- Central 3D Driving License & RTO Application Portal -->
    <g transform="translate(340, 160)" filter="url(#cardShadow)">
      <!-- Main Smart DL Card -->
      <rect x="0" y="0" width="600" height="380" rx="28" fill="url(#cardGrad)" stroke="#38BDF8" stroke-width="2.5"/>
      <rect x="18" y="18" width="564" height="344" rx="20" fill="#020617"/>

      <!-- Header Strip with Indian Transport Theme -->
      <rect x="18" y="18" width="564" height="65" rx="20" fill="url(#blueGrad)"/>
      <text x="50" y="52" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="900" font-size="20" letter-spacing="1">TRANSPORT CITIZEN FACILITATION</text>
      <text x="50" y="70" fill="#DBEAFE" font-family="system-ui, sans-serif" font-weight="700" font-size="12">DRIVING LICENCE (LEARNING &amp; PERMANENT) APPLICATION</text>

      <!-- Left: Photo Box & Vehicle Silhouette -->
      <g transform="translate(45, 105)">
        <rect x="0" y="0" width="140" height="175" rx="14" fill="#0F172A" stroke="#475569" stroke-width="1.5"/>
        <circle cx="70" cy="60" r="26" fill="#64748B"/>
        <path d="M35 125 C35 100 105 100 105 125 Z" fill="#64748B"/>
        
        <!-- Car Silhouette / LMVs Badge -->
        <g transform="translate(20, 135)">
          <rect x="0" y="0" width="100" height="26" rx="8" fill="#1E293B" stroke="#64748B"/>
          <text x="50" y="17" text-anchor="middle" fill="#38BDF8" font-family="system-ui, sans-serif" font-weight="800" font-size="11">LMV + MCWG</text>
        </g>
      </g>

      <!-- Right: Form Data & Slot Booking -->
      <g transform="translate(210, 105)">
        <rect x="0" y="0" width="345" height="175" rx="14" fill="#0F172A" stroke="#334155" stroke-width="1.5"/>
        <text x="20" y="30" fill="#FBBF24" font-family="system-ui, sans-serif" font-weight="800" font-size="13">RTO APPOINTMENT &amp; VERIFICATION</text>
        <rect x="20" y="48" width="180" height="10" rx="4" fill="#64748B"/>
        <rect x="20" y="68" width="240" height="10" rx="4" fill="#475569"/>
        
        <!-- Calendar Slot Pill -->
        <g transform="translate(20, 95)">
          <rect x="0" y="0" width="150" height="28" rx="8" fill="#1E3A8A" stroke="#3B82F6"/>
          <text x="75" y="18" text-anchor="middle" fill="#93C5FD" font-family="system-ui, sans-serif" font-weight="800" font-size="11">TEST SLOT BOOKED</text>
        </g>

        <!-- Status Pill -->
        <g transform="translate(180, 95)">
          <rect x="0" y="0" width="145" height="28" rx="8" fill="#065F46" stroke="#10B981"/>
          <text x="72" y="18" text-anchor="middle" fill="#A7F3D0" font-family="system-ui, sans-serif" font-weight="800" font-size="11">SARATHI VERIFIED</text>
        </g>
      </g>

      <!-- Bottom Highway / Speed Graphic Bar -->
      <g transform="translate(45, 300)">
        <rect x="0" y="0" width="510" height="42" rx="12" fill="#0F172A" stroke="#38BDF8" stroke-width="1.5"/>
        <line x1="20" y1="21" x2="490" y2="21" stroke="#F59E0B" stroke-width="3" stroke-dasharray="16 12"/>
        <text x="255" y="26" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="900" font-size="11" letter-spacing="1">INSTANT LL TEST ASSISTANCE &amp; DL FORM FILLING</text>
      </g>
    </g>
  </svg>
  `;
}

function generateSvgWebsiteDevelopment() {
  return `
  <svg width="1280" height="720" viewBox="0 0 1280 720" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bgGlow" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#1E1B4B" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#070B19" stop-opacity="1"/>
      </radialGradient>
      <linearGradient id="codeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#06B6D4"/>
        <stop offset="100%" stop-color="#8B5CF6"/>
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="20" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
      <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="125%">
        <feDropShadow dx="0" dy="25" stdDeviation="30" flood-color="#000000" flood-opacity="0.6"/>
      </filter>
    </defs>
    <rect width="1280" height="720" fill="#070B19"/>
    <rect width="1280" height="720" fill="url(#bgGlow)"/>

    <circle cx="340" cy="240" r="180" fill="#06B6D4" opacity="0.2" filter="url(#glow)"/>
    <circle cx="940" cy="420" r="180" fill="#8B5CF6" opacity="0.2" filter="url(#glow)"/>

    <!-- Central 3D Developer Workspace & Multi-Screen Responsive Mockup -->
    <g transform="translate(300, 140)" filter="url(#cardShadow)">
      <!-- Main Monitor Frame (Desktop) -->
      <rect x="0" y="0" width="560" height="340" rx="24" fill="#0F172A" stroke="#06B6D4" stroke-width="2.5"/>
      <rect x="16" y="16" width="528" height="308" rx="16" fill="#020617"/>

      <!-- Window Header -->
      <rect x="16" y="16" width="528" height="36" rx="16" fill="#1E293B"/>
      <circle cx="36" cy="34" r="5" fill="#EF4444"/>
      <circle cx="52" cy="34" r="5" fill="#F59E0B"/>
      <circle cx="68" cy="34" r="5" fill="#10B981"/>
      <text x="280" y="38" text-anchor="middle" fill="#94A3B8" font-family="monospace" font-weight="700" font-size="12">https://client-portal.dev &lt;/&gt;</text>

      <!-- Code & UI Split Screen inside Monitor -->
      <!-- Left: Code Editor -->
      <g transform="translate(36, 68)">
        <rect x="0" y="0" width="220" height="235" rx="10" fill="#090D16" stroke="#1E293B"/>
        <text x="15" y="25" fill="#38BDF8" font-family="monospace" font-size="11">import React from 'react';</text>
        <text x="15" y="45" fill="#F472B6" font-family="monospace" font-size="11">export function App() {</text>
        <text x="25" y="65" fill="#FBBF24" font-family="monospace" font-size="11">  return (</text>
        <text x="35" y="85" fill="#34D399" font-family="monospace" font-size="11">    &lt;HeroSection&gt;</text>
        <text x="45" y="105" fill="#60A5FA" font-family="monospace" font-size="11">      &lt;FastHosting /&gt;</text>
        <text x="45" y="125" fill="#A78BFA" font-family="monospace" font-size="11">      &lt;SecureAPI /&gt;</text>
        <text x="35" y="145" fill="#34D399" font-family="monospace" font-size="11">    &lt;/HeroSection&gt;</text>
        <text x="25" y="165" fill="#FBBF24" font-family="monospace" font-size="11">  );</text>
        <text x="15" y="185" fill="#F472B6" font-family="monospace" font-size="11">}</text>
        <rect x="15" y="200" width="90" height="18" rx="4" fill="#059669"/>
        <text x="60" y="213" text-anchor="middle" fill="#FFFFFF" font-family="monospace" font-weight="800" font-size="10">BUILD SUCCESS</text>
      </g>

      <!-- Right: Responsive UI Preview -->
      <g transform="translate(275, 68)">
        <rect x="0" y="0" width="245" height="235" rx="10" fill="#0F172A" stroke="#334155"/>
        <rect x="15" y="15" width="215" height="40" rx="8" fill="url(#codeGrad)"/>
        <text x="122" y="39" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="900" font-size="12">MODERN WEB APP</text>
        
        <rect x="15" y="65" width="95" height="60" rx="8" fill="#1E293B" stroke="#475569"/>
        <rect x="120" y="65" width="110" height="60" rx="8" fill="#1E293B" stroke="#475569"/>
        
        <rect x="15" y="135" width="215" height="85" rx="8" fill="#1E293B" stroke="#475569"/>
        <text x="122" y="180" text-anchor="middle" fill="#38BDF8" font-family="system-ui, sans-serif" font-weight="800" font-size="11">FAST - SEO - RESPONSIVE</text>
      </g>

      <!-- Monitor Stand -->
      <path d="M230 340 L250 380 H310 L330 340 Z" fill="#1E293B"/>
      <rect x="200" y="380" width="160" height="12" rx="6" fill="#334155"/>
    </g>

    <!-- Floating Mobile Tablet Device Right -->
    <g transform="translate(860, 260)" filter="url(#cardShadow)">
      <rect x="0" y="0" width="110" height="200" rx="18" fill="#0F172A" stroke="#8B5CF6" stroke-width="2"/>
      <rect x="8" y="12" width="94" height="176" rx="12" fill="#020617"/>
      <rect x="16" y="24" width="78" height="25" rx="6" fill="url(#codeGrad)"/>
      <rect x="16" y="58" width="78" height="40" rx="6" fill="#1E293B"/>
      <rect x="16" y="106" width="78" height="70" rx="6" fill="#1E293B"/>
      <circle cx="55" cy="180" r="4" fill="#64748B"/>
    </g>
  </svg>
  `;
}

const svgGenerators = {
  "residence-certificate.webp": generateSvgResidenceCertificate,
  "ration-card.webp": generateSvgRationCard,
  "voter-id.webp": generateSvgVoterId,
  "document-printing-bw.webp": generateSvgDocumentPrintingBw,
  "document-printing-color.webp": generateSvgDocumentPrintingColor,
  "photocopy-bw.webp": generateSvgPhotocopyBw,
  "photocopy-color.webp": generateSvgPhotocopyColor,
  "driving-license.webp": generateSvgDrivingLicense,
  "website-development.webp": generateSvgWebsiteDevelopment,
};

async function processSvgImages() {
  for (const [filename, generator] of Object.entries(svgGenerators)) {
    const destPath = path.join(outDir, filename);
    const svgStr = generator();
    const svgBuffer = Buffer.from(svgStr);
    await sharp(svgBuffer)
      .resize(1280, 720, { fit: "cover" })
      .webp({ quality: 90, effort: 6 })
      .toFile(destPath);
    console.log(`Rendered SVG 3D Hybrid -> ${filename}`);
  }
}

async function main() {
  console.log("--- Processing AI Generated Images ---");
  await processAiImages();
  console.log("--- Rendering Remaining 3D Vector Compositions ---");
  await processSvgImages();
  console.log("All 21 images generated in public/services successfully!");
}

main().catch(console.error);
