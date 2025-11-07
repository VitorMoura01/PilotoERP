# Landing Page - Quick Start Guide

## What We Built

A stunning, conversion-optimized landing page inspired by Dia Browser with:

### ✨ Key Features

1. **Hero Section with Gradients**
   - Large, bold headline with gradient text
   - Smooth gradient background with animated orbs
   - AI-powered badge indicator
   - Two prominent CTA buttons

2. **Video Demo Section**
   - Interactive video placeholder
   - Animated chat message previews
   - Glassmorphism effects
   - Click-to-play functionality

3. **Features Showcase**
   - 3 feature cards with gradient icons
   - Hover effects and animations
   - Clear benefit descriptions

4. **Call-to-Action Section**
   - Gradient background
   - Strong conversion messaging
   - Final CTA button

## Quick Setup

### 1. Run the Development Server

```bash
cd src/frontend
pnpm dev
```

### 2. View the Landing Page

Open your browser to: **http://localhost:3000**

### 3. Add Your Demo Video (Optional)

Place your video file in `src/frontend/public/demo-video.mp4`

Or update the video source in `landing-page.tsx` (line 126):

```tsx
<video
  className="w-full h-full"
  controls
  autoPlay
  src="/your-video-name.mp4"  // Change this
>
```

## Design Elements

### Color Scheme
- **Primary Gradient**: Blue → Indigo (#2f93f2 → Indigo)
- **Accent Gradient**: Blue → Indigo → Purple
- **Background**: Slate with subtle blue/indigo tint

### Typography
- **Headlines**: 6xl-8xl (large, bold, gradient)
- **Body**: xl-2xl (readable, clear)
- **Font**: Geist Sans (modern, clean)

### Visual Effects
- ✓ Animated gradient orbs
- ✓ Glassmorphism (frosted glass effect)
- ✓ Smooth hover animations
- ✓ Fade-in transitions
- ✓ Shadow effects

## Navigation Flow

```
Landing Page (/)
    ↓
    Click "Start Free Trial" or "Get Started Now"
    ↓
Dashboard (/dashboard)
```

## Customization Quick Tips

### Change the Main Headline
File: `landing-page.tsx` - Lines 54-61

```tsx
<h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
  <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
    Chat with your  {/* ← Edit this */}
  </span>
  <br />
  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
    restaurant data  {/* ← Edit this */}
  </span>
</h1>
```

### Update Feature Cards
File: `landing-page.tsx` - Lines 159-221

Each feature card has:
- Icon component
- Title (h3)
- Description (p)

### Modify CTA Buttons
File: `landing-page.tsx` - Lines 72-93

Update button text and onClick handlers as needed.

## Testing Checklist

- [ ] Landing page loads at http://localhost:3000
- [ ] "Start Free Trial" button navigates to /dashboard
- [ ] "Watch Demo" button scrolls to video section
- [ ] Video placeholder shows chat animations
- [ ] All gradient effects display correctly
- [ ] Responsive design works on mobile
- [ ] Dark mode toggles properly
- [ ] Hover effects on feature cards work
- [ ] Navigation links scroll smoothly

## Performance Tips

1. **Images**: Use Next.js Image component
2. **Video**: Keep video files under 5MB
3. **Fonts**: Fonts are already optimized with Geist
4. **Build**: Run `pnpm build` to test production performance

## Next Steps

1. Add real customer testimonials
2. Include pricing section
3. Add social proof (customer logos)
4. Set up analytics tracking
5. A/B test different headlines
6. Add more feature sections
7. Include FAQ section
8. Add footer links (About, Contact, etc.)

## Support

For more details, see `LANDING_PAGE.md` in the frontend directory.

---

**Built with**: Next.js 15, Tailwind CSS, shadcn/ui, Lucide Icons

**Inspired by**: Dia Browser design (https://www.diabrowser.com/)
