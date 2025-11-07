# ChatWaiter Landing Page

## Overview

A modern, highly convertible landing page built with Next.js, Tailwind CSS, and beautiful gradient designs inspired by Dia Browser. The landing page features:

- 🎨 **Modern Gradient Design** - Beautiful gradient backgrounds and animated orbs
- 🎬 **Hero Video Section** - Interactive video demo placeholder with smooth animations
- 📱 **Responsive Layout** - Fully responsive design that works on all devices
- ⚡ **Fast Performance** - Optimized with Next.js for lightning-fast loading
- 🌙 **Dark Mode Support** - Automatic dark mode support with smooth transitions

## Features

### Hero Section
- Eye-catching headline with gradient text effects
- AI-powered badge with sparkle icon
- Compelling value proposition
- Dual CTA buttons (Start Free Trial & Watch Demo)
- Interactive video demo placeholder with chat message animations

### Navigation
- Fixed navigation bar with glassmorphism effect
- Smooth scroll to sections
- Brand logo and navigation links
- CTA button in navigation

### Features Section
- Three key feature cards with hover effects
- Gradient icons and backgrounds
- Clear benefit descriptions

### Social Proof Section
- Gradient background with call-to-action
- Animated background orbs
- Strong conversion-focused messaging

## File Structure

```
src/frontend/
├── app/
│   ├── page.tsx              # Main landing page (root route)
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard application
│   ├── layout.tsx            # Root layout with metadata
│   └── globals.css           # Global styles with custom animations
└── components/
    └── landing-page.tsx      # Landing page component
```

## Routes

- `/` - Landing page (public)
- `/dashboard` - Dashboard application (protected)

## Customization

### Colors
The landing page uses a gradient color scheme with:
- Primary: Blue (#2f93f2)
- Secondary: Indigo
- Accent: Purple

You can customize these in `globals.css` CSS variables.

### Video Demo
To add your actual demo video:

1. Add your video file to the `public/` folder (e.g., `demo-video.mp4`)
2. The video placeholder already includes the correct path
3. Alternatively, use a YouTube or Vimeo embed for better performance

### Copy & Content
Update the following in `landing-page.tsx`:

- **Headline**: Line 54-61 - Main hero headline
- **Subheadline**: Line 64-67 - Supporting description
- **Features**: Lines 159-221 - Feature card titles and descriptions
- **CTA Text**: Lines 72-93 - Button text and links

## Animations

Custom animations are defined in `globals.css`:

- `animate-fade-in` - Fade in with slide up effect
- `animate-pulse` - Pulsing gradient orbs
- Delay classes: `delay-500`, `delay-1000`, `delay-2000`

## Navigation Behavior

- "Start Free Trial" button → Redirects to `/dashboard`
- "Watch Demo" button → Scrolls to video section and auto-plays
- "Get Started Now" button → Redirects to `/dashboard`

## Development

Run the development server:

```bash
cd src/frontend
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

## Production Build

```bash
pnpm build
pnpm start
```

## Dependencies

All necessary dependencies are already in `package.json`:
- Next.js 15+
- Tailwind CSS
- Lucide React (icons)
- shadcn/ui components

## Best Practices

1. **Images**: Add high-quality images to the `public/` folder
2. **Video**: Optimize video files for web (recommended max 5MB, MP4 format)
3. **Performance**: Use Next.js Image component for all images
4. **SEO**: Update metadata in `layout.tsx` for better search rankings
5. **Analytics**: Analytics are already integrated via Vercel Analytics

## Conversion Optimization Tips

1. Keep the headline focused on the main benefit
2. Use strong CTAs with action-oriented text
3. Add customer testimonials or logos for social proof
4. Include pricing or "Starting at $XX/month" for transparency
5. A/B test different headlines and CTA button colors

## Accessibility

The landing page includes:
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Sufficient color contrast ratios
- Responsive text sizing

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This landing page is part of the ChatWaiter project.
