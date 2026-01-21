# 🚀 Tamil Nadu Change Rally - மாற்றத்திற்க்கான மக்களின் மாநாடு 2026

A modern, responsive React application for the Tamil Nadu Change Rally (மாற்றத்திற்க்கான மக்களின் மாநாடு) event management and registration platform.

## ✨ Features

### Core Features
- **Attendance Registration Form** - User-friendly registration with photo upload and ID card generation
- **District-wise Registration Tracking** - Real-time registration statistics for all 35 Tamil Nadu districts
- **Interactive Tamil Nadu Map** - Visual district selector with registration rankings
- **Attendance Card Download** - Generate and download custom attendance cards with participant details
- **Social Media Sharing** - Share registration on WhatsApp and Facebook directly
- **Event Updates Timeline** - Upcoming events information and timeline
- **Live Registration Statistics** - Total registrations, district counts, and averages
- **Responsive Design** - Seamless experience across desktop, tablet, and mobile devices
- **Smooth Animations** - Professional animations using Framer Motion
- **Tamil Language Support** - Full Tamil language interface with proper typography

### Technical Features
- Type-safe React with TypeScript
- Tailwind CSS for responsive styling
- Canvas API for attendance card generation
- Scroll detection for dynamic content visibility
- Real-time data synchronization across components
- Modern ES modules with Vite

## 🛠 Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.2.0 | UI framework |
| **TypeScript** | 5.2.2 | Type safety |
| **Vite** | 5.0.0 | Build tool & dev server |
| **Tailwind CSS** | 3.3.6 | Styling & responsive design |
| **Framer Motion** | 10.16.16 | Animations & transitions |
| **React DOM** | 18.2.0 | DOM rendering |

## 📁 Project Structure

```
src/
├── components/
│   ├── AttendanceForm.tsx        # Registration form with photo upload
│   ├── CountdownTimer.tsx         # Event countdown display
│   ├── HeroSection.tsx            # Landing hero section
│   ├── IDCardGenerator.tsx        # ID card generation
│   ├── LiveRegistrationMap.tsx    # Live registration statistics
│   ├── LocationSection.tsx        # Venue information
│   ├── TamilNaduMap.tsx           # Interactive district map & rankings
│   ├── UpdatesSection.tsx         # Events timeline
│   └── App.css                    # Component styles
├── pages/
│   └── Index.tsx                  # Main page layout
├── App.tsx                        # Root app component
├── main.tsx                       # Application entry point
├── index.css                      # Global styles & CSS variables
└── App.css                        # App-level styles

public/
├── maanaadu-2026-logo-final.png   # Hero section logo
├── idcard_bg1.jpeg                # Attendance card background
└── annan-may-18-kovai-...png      # Hero section image

Root Config Files
├── vite.config.ts                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
├── tsconfig.json                  # TypeScript configuration
├── index.html                     # HTML entry point
└── package.json                   # Dependencies & scripts
```

## 🎨 Components Overview

### AttendanceForm
- Collects participant information (name, email, phone, district)
- Photo upload with preview
- Form validation
- Canvas-based attendance card generation
- Download as PNG
- Social media sharing (WhatsApp, Facebook)
- **Colors**: Red background (#ed1c24 / rgba(189, 15, 15, 0.6)), white labels
- **Height**: Compact design with py-4 padding

### TamilNaduMap
- Displays 35 districts with registration counts
- Interactive district ranking (sorted by registrations)
- Three-column layout:
  1. **Map Column** - Tamil Nadu SVG map with header
  2. **Rankings Column** - Scrollable district list (max 10 items)
  3. **Statistics Column** - Total registrations, district count, average
- Selected district details panel with gradient background
- **Color**: Red background (#ed1c24), gradient stats cards

### CountdownTimer
- Countdown to Feb 21, 2026, 10:00 AM
- Displays days, hours, minutes, seconds
- Registration statistics
- Compact sizing (py-6)
- **Color**: Red background (#ed1c24)

### UpdatesSection
- Event timeline with dates and descriptions
- District-wise event locations
- District badges with yellow background and red text
- **Color**: Red background (#ed1c24)

### LiveRegistrationMap
- Statistics cards with gradient backgrounds
- District grid visualization with density colors
- Top 15 districts by registration
- Constituency information

## 🎯 Color Scheme

| Color | Hex Code | Usage |
|-------|----------|-------|
| Primary Red | #ed1c24 | Main brand color, section backgrounds |
| Yellow | #fbbf24 | Accent, borders, buttons |
| Green | #10b981 | Secondary accent |
| White | #ffffff | Text on dark backgrounds |
| Light Gray | #f3f4f6 | Backgrounds, cards |

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository**
```bash
cd tamilnadu-change-rally
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
Navigate to `http://localhost:5173`

## 📝 Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint for code quality
npm run lint
```

## 🎓 Key Features Implementation

### Attendance Card Generation
- Canvas-based image generation
- Background image integration (idcard_bg1.jpeg)
- Square photo format (140x145px)
- Border styling with yellow (#fbbf24)
- Name and district text overlay
- PNG download functionality

### District Registration Tracking
- 35 districts with Tamil names
- Real-time registration counts
- Automatic sorting by registrations
- District ranking calculation
- Status level assignment (முதல்/இரண்டாம்/மூன்றாம்)

### Social Media Integration
- WhatsApp share with custom message
- Facebook share dialog
- Pre-filled with participant name and district
- Share button in attendance card modal

### Responsive Design
- Mobile-first approach
- Grid layouts (1 column mobile, 3+ columns desktop)
- Tailwind breakpoints (md, lg)
- Compact form design for mobile
- Scrollable content areas

## 🎨 Customization Guide

### Change Brand Colors
Edit [src/index.css](src/index.css):
```css
:root {
  --primary: 237 0 38; /* RGB for #ed1c24 */
  /* ... other variables ... */
}
```

### Modify Districts Data
Edit [src/components/TamilNaduMap.tsx](src/components/TamilNaduMap.tsx):
```typescript
const districts = [
  { name: 'Chennai', tamil: 'சென்னை', registrations: 5393 },
  // Add or modify districts
];
```

### Tailwind Configuration
Edit [tailwind.config.js](tailwind.config.js) for theme customization:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#ed1c24',
      },
    },
  },
}
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (single column layouts)
- **Tablet**: 768px - 1024px (2 columns)
- **Desktop**: > 1024px (3+ columns)

## 🔤 Typography

- **Primary Font**: Baloo Thambi 2, Anek Tamil (Tamil text)
- **Secondary Font**: Fredoka (English text, buttons)
- **Import**: Google Fonts via [src/index.css](src/index.css)

## 📊 Districts Data

The application tracks registration for all 35 Tamil Nadu districts:
- Chennai (சென்னை)
- Coimbatore (கோயம்பத்தூர்)
- Madurai (மதுரை)
- And 32 more...

Each district maintains:
- Registration count
- Tamil name
- Ranking position
- Status level

## 🚢 Building for Production

```bash
npm run build
```

Output files are generated in the `dist/` directory:
- Optimized JavaScript bundles
- Minified CSS
- Compressed assets
- Source maps (optional)

## 📄 License

MIT License © 2026 NTK_IT_WING

---

**Created with ❤️ for Tamil Nadu Change Rally NTK 2026**

For more information, visit the official website or contact the NTK IT Wing team.


## Support

For issues or questions, please create an issue in the repository.
