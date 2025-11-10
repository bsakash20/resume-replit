# AI-Powered Resume Builder - Design Guidelines

## Design Approach

**Hybrid Strategy**: Modern productivity aesthetic with marketing page creativity
- **Editor Interface**: Linear-inspired minimalism focused on content creation efficiency
- **Landing Pages**: Creative layouts with strategic visual impact (inspired by Canva, Resume.io)
- **Design System**: Custom system built on Tailwind + shadcn/ui with emphasis on clarity and professionalism

### Core Design Principles
1. **Trust & Professionalism**: Users entrust their career documents to this platform
2. **Clarity Over Cleverness**: Editing interface prioritizes usability
3. **Premium Feel**: Even free tier should feel high-quality
4. **Guided Experience**: Clear visual hierarchy guides users through resume creation

---

## Typography System

**Font Families**:
- **Primary**: Inter (headings, UI elements, body text)
- **Display**: Cal Sans or Clash Display (landing page heroes, large headings)

**Hierarchy**:
- **Hero Headlines**: 56-72px (3xl-5xl), display font, font-bold
- **Section Headings**: 32-40px (2xl-3xl), font-semibold
- **Subheadings**: 20-24px (xl), font-medium
- **Body Text**: 16px (base), font-normal, leading-relaxed
- **UI Labels**: 14px (sm), font-medium
- **Captions**: 12px (xs), font-normal

---

## Layout & Spacing System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16, 20, 24, 32**
- Micro spacing: p-2, gap-2 (8px)
- Component spacing: p-4, p-6 (16-24px)
- Section padding: py-12, py-16, py-20 (48-80px)
- Large gaps: gap-8, gap-12 (32-48px)

**Container Strategy**:
- Landing page sections: max-w-7xl mx-auto px-6
- Editor workspace: max-w-6xl mx-auto
- Form content: max-w-2xl
- Text content: max-w-prose

**Grid Patterns**:
- Feature cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Template showcase: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6
- Dashboard cards: grid-cols-1 lg:grid-cols-2 gap-6

---

## Component Library

### Navigation
- **Header**: Sticky top navigation with logo, nav links, auth buttons
  - Height: h-16
  - Backdrop blur on scroll: backdrop-blur-sm
  - CTA button in header: "Get Started Free"

### Landing Page Components

**Hero Section** (h-auto min-h-[600px]):
- Large headline with display font
- Subheading with value proposition
- Primary CTA + Secondary action
- Hero image/illustration: Professional workspace or resume mockup showcase
- Trust indicators below fold: "Trusted by 50,000+ job seekers"

**Features Grid** (3 columns on desktop):
- Icon (lucide-react icons, size-6)
- Feature title (text-xl font-semibold)
- Description (text-base)
- Each card: p-6, rounded-xl, border

**Template Showcase** (masonry or grid):
- Template preview cards with hover effect
- Label badges for "Popular", "New", "Premium"
- Quick preview on hover (scale transform)

**Pricing Cards** (3 tiers):
- Free, Pro, Enterprise
- Feature comparison list
- Prominent CTA buttons
- "Most Popular" badge on recommended tier

**Social Proof**:
- Testimonial cards: 2-3 columns
- User avatar, name, role, company
- Star ratings visualization

**CTA Section** (full-width, py-20):
- Centered content
- Headline + supporting text
- Primary action button
- Supporting visuals or stats

### Editor Interface Components

**Sidebar Navigation** (w-64, fixed):
- Section list with icons
- Active state highlighting
- Add section button
- Template switcher

**Editor Canvas** (split view):
- Left: Form inputs (w-1/2)
- Right: Live preview (w-1/2, sticky top-20)
- Mobile: Tabbed interface

**Form Elements**:
- Input fields: rounded-lg, border-2, px-4 py-3
- Focus states: ring-2 ring-offset-2
- Labels: text-sm font-medium mb-2
- Helper text: text-xs text-muted-foreground
- Error states: border-red-500, text-red-600

**Section Cards**:
- Each resume section in collapsible card
- Drag handle icon (grip-vertical)
- Edit/Delete action buttons
- Add item button within section

**Resume Preview**:
- Paper-like container: bg-white shadow-2xl
- A4 proportions simulation
- Zoom controls (+/- buttons)
- Download/Share buttons floating above

### Modals & Overlays
- Template selector: Full-screen modal with grid
- AI assistant: Slide-over panel from right
- Payment checkout: Centered modal
- Confirmation dialogs: Small centered modals

### Buttons
- **Primary**: Solid background, rounded-lg, px-6 py-3, font-medium
- **Secondary**: Border variant, same padding
- **Ghost**: Transparent with hover state
- **Icon buttons**: Square, p-2, rounded-md
- **Floating action**: Fixed bottom-right, rounded-full, shadow-lg

### Cards
- Base: rounded-xl, border, p-6
- Interactive: hover:shadow-lg transition-shadow
- Elevated: shadow-md

---

## Page-Specific Layouts

### Landing Page Structure
1. **Hero** with background gradient/image
2. **How It Works** (4-step process, horizontal timeline)
3. **Features Grid** (3x3 features)
4. **Template Gallery** (showcase 6-9 templates)
5. **AI Features Highlight** (2-column layout with demo)
6. **Pricing Plans** (3 cards)
7. **Testimonials** (2-3 columns)
8. **Final CTA** (centered, bold)
9. **Footer** (multi-column with links, social, newsletter signup)

### Dashboard Layout
- Top stats bar: Total resumes, AI credits, account type
- Resume cards grid: 2-3 columns
- Each card: Thumbnail, title, last edited, quick actions
- "Create New Resume" prominent card

### Editor Layout
- Fixed header: Logo, resume title (editable), save status, actions (download, share)
- Sidebar: Section navigation
- Main area: Split view (form + preview)
- Bottom bar: AI assistant trigger, template switcher

---

## Interaction Patterns

**Autosave Indicator**: 
- Floating badge in editor header
- States: "Saving...", "Saved", "Error"

**Drag & Drop**:
- Visual feedback on drag (opacity-50)
- Drop zone highlighting
- Smooth reordering animations

**AI Generation**:
- Inline loading spinner in input field
- Generated content appears with subtle animation
- Accept/Reject buttons for AI suggestions

**Template Switching**:
- Instant preview updates
- Smooth transition (no page reload)

---

## Responsive Behavior

**Breakpoints**:
- Mobile: < 768px (single column, stacked sections)
- Tablet: 768-1024px (2 columns where appropriate)
- Desktop: > 1024px (full multi-column layouts)

**Editor Mobile Adaptation**:
- Tabs instead of split view
- Bottom navigation for sections
- Full-screen preview mode

---

## Special Considerations

### Premium Features Gating
- Lock icon on premium templates
- Upgrade prompts: Subtle, non-intrusive
- Feature comparison table in pricing

### Payment Integration (Razorpay/UPI)
- Payment modal with UPI options displayed prominently
- Show Google Pay, PhonePe, Paytm icons
- QR code display for UPI payment
- Secure badge and trust indicators

### Dark Mode
- Toggle in header
- Preserve contrast ratios
- Darker preview paper in dark mode (bg-gray-900)

---

## Images & Visual Assets

**Hero Section**: 
- Large hero image showing polished resume examples or professional workspace
- Alternative: Animated mockup of resume builder in action

**Features Section**:
- Icon illustrations (lucide-react or heroicons)

**Template Gallery**:
- High-fidelity screenshots of actual resume templates
- Hover previews showing full template

**Testimonials**:
- User avatars (circular, consistent size)

**Trust Indicators**:
- Partner logos or certification badges in footer