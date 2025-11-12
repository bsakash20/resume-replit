# ResumeAI - AI-Powered Resume Builder

## Overview
ResumeAI is a modern, production-ready web application that allows users to create professional resumes with AI assistance. The platform provides real-time editing, multiple professional templates, AI-powered content generation, and payment integration for premium features.

## Recent Changes
- **2024-11-12**: Payment-gated download system with Razorpay
  - Atomic credit operations to prevent race conditions
  - Two pricing tiers: ₹10 (1 download), ₹100 (20 downloads)
  - Server-side signature verification for security
  - Download credits displayed in Dashboard
  - Payment modal with UPI/card support
- **2024-01**: Initial MVP implementation with complete frontend and backend
  - Implemented Replit Auth with Google, GitHub, and email/password support
  - Created comprehensive resume editor with all core sections
  - Built AI-powered content generation for summaries and bullet points
  - Designed three professional resume templates (Classic, Modern, Minimalist)

## User Preferences
- Clean, professional, and minimal aesthetic
- Modern typography using Inter font
- Professional color palette with blue primary (#4F94D4)
- Responsive design optimized for all devices
- Dark/light mode support

## Project Architecture

### Frontend (React + TypeScript)
- **Landing Page**: Hero section, features, templates showcase, pricing, testimonials
- **Dashboard**: Resume management with stats, create/duplicate/delete operations
- **Resume Editor**: Split-view interface with live preview
  - Personal Information form
  - Professional Summary with AI generation
  - Work Experience with AI bullet point generation
  - Education, Skills, Projects
  - Certifications, Achievements, Languages, Interests
- **Templates**: Three professional templates (Classic, Modern, Minimalist)
- **Theme Toggle**: Dark/light mode with persistent preference

### Backend (Express + TypeScript)
- **Authentication**: Replit Auth (Google, GitHub, email/password)
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: User profiles, resumes, payments
- **API Endpoints**: 
  - `/api/auth/*` - Authentication routes
  - `/api/resumes` - CRUD operations for resumes
  - `/api/ai/*` - AI content generation endpoints
  - `/api/payments` - Razorpay payment processing

### Database Schema
- **users**: User profiles with AI credits, download credits, and premium status
- **resumes**: Complete resume data with JSON sections
- **payments**: Payment transactions (type: 'ai_credits' or 'download_credits')
- **sessions**: Session storage for authentication

### Download Credit System
- Users start with 0 download credits
- Purchase options:
  - ₹10 for 1 download credit (single PDF export)
  - ₹100 for 20 download credits (50% savings)
- Credits are deducted atomically before download
- Payment verification includes signature validation
- Download button opens payment modal when credits = 0

### AI Features
- **OpenAI Integration**: Using GPT-5 for content generation
- **Summary Generation**: Creates professional summaries from user context
- **Bullet Point Generation**: Generates achievement-focused work experience descriptions
- **Resume Scoring**: (Planned) Provides feedback on ATS optimization

### Payment Integration
- **Razorpay**: UPI (Google Pay, PhonePe, Paytm), cards, netbanking, wallets
- **Plans**: Free (3 AI credits), Pro (₹299/month), Lifetime (₹1,999 one-time)
- **Credits System**: AI generation credits with purchase/subscription options

## Tech Stack

### Core
- React 18 with TypeScript
- Express.js backend
- PostgreSQL database
- Drizzle ORM

### UI/UX
- Tailwind CSS
- shadcn/ui component library
- Framer Motion for animations
- Lucide React icons

### State Management
- TanStack Query v5 for server state
- React Context for theme
- Wouter for routing

### AI & Payments
- OpenAI API (GPT-5)
- Razorpay (payment gateway)

## Key Features (Implemented)

### MVP Features ✓
- [x] User authentication (Google, GitHub, email/password)
- [x] Section-based resume editor (all 9 sections)
- [x] Real-time live preview
- [x] Three professional templates
- [x] Autosave functionality
- [x] AI-powered summary generation
- [x] AI-powered bullet point generation
- [x] Multiple resume management
- [x] Dark/light mode
- [x] Responsive design
- [x] Form validation
- [x] Beautiful landing page
- [x] Dashboard with stats
- [x] **Payment-gated PDF downloads** (NEW!)
- [x] **Razorpay integration for UPI/cards** (NEW!)
- [x] **Download credit system** (NEW!)

### Pending Features
- [ ] AI resume scoring
- [ ] Job description analyzer
- [ ] LinkedIn import
- [ ] Shareable resume links
- [ ] DOCX and TXT export
- [ ] Analytics dashboard
- [ ] Admin panel

## Development Commands
- `npm run dev` - Start development server (frontend + backend)
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio for database management

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (auto-configured)
- `OPENAI_API_KEY` - OpenAI API key for AI features (configured)
- `SESSION_SECRET` - Session encryption key (auto-configured)
- `RAZORPAY_KEY_ID` - Razorpay API key (**REQUIRED for payments**)
- `RAZORPAY_KEY_SECRET` - Razorpay secret (**REQUIRED for payments**)

### Setting Up Razorpay (Required for Download Features)
1. Sign up at https://razorpay.com/
2. Go to Dashboard → Settings → API Keys
3. Generate Test Keys for development (starts with `rzp_test_`)
4. Add keys to Replit Secrets:
   - Key: `RAZORPAY_KEY_ID`, Value: your key ID
   - Key: `RAZORPAY_KEY_SECRET`, Value: your key secret
5. Restart the application
6. For production, generate Live Keys (starts with `rzp_live_`)

## File Structure
```
/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── editor/       # Resume editor forms
│   │   │   ├── ui/           # shadcn components
│   │   │   ├── ResumePreview.tsx
│   │   │   ├── TemplateSelector.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── lib/
│   │   │   ├── queryClient.ts
│   │   │   └── authUtils.ts
│   │   ├── pages/
│   │   │   ├── Landing.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ResumeEditor.tsx
│   │   │   └── not-found.tsx
│   │   ├── App.tsx
│   │   └── index.css
│   └── index.html
├── server/
│   ├── db.ts              # Database connection
│   ├── storage.ts         # Storage interface & implementation
│   ├── routes.ts          # API routes
│   ├── replitAuth.ts      # Authentication middleware
│   └── index.ts           # Server entry point
├── shared/
│   └── schema.ts          # Shared TypeScript types & Drizzle schema
├── design_guidelines.md   # Design system documentation
└── package.json
```

## Design System
- **Font**: Inter (clean, professional)
- **Primary Color**: Blue (#4F94D4)
- **Spacing**: Consistent 4px grid (2, 4, 6, 8, 12, 16, 20, 24, 32)
- **Border Radius**: Small (md) for most elements
- **Components**: Shadcn/ui for all UI components
- **Interactions**: Subtle hover-elevate and active-elevate-2 effects

## Next Steps
1. Implement backend API routes for resume CRUD
2. Set up Replit Auth authentication flow
3. Integrate OpenAI for AI generation endpoints
4. Add Razorpay payment processing
5. Implement PDF export functionality
6. Add comprehensive testing
7. Deploy to production

## Notes
- All user data is securely stored in PostgreSQL
- AI credits are tracked per user
- Payment integration supports UPI for Indian market
- Autosave triggers on 1-second debounce
- Dark mode preference is persisted in localStorage
