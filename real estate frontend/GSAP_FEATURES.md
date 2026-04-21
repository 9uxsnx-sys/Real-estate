# VistaHaven Real Estate - GSAP Enhanced

A modern, responsive real estate property listing website with **enterprise-grade GSAP animations** and performance optimizations.

## 🎬 GSAP Features Implemented

### 1. **Page Transitions**
- Smooth route change animations with fade and scale effects
- Staggered child element entrances on page load
- Uses GSAP Context for proper cleanup

### 2. **Preloader**
- Animated logo entrance with progress bar
- Smooth fade-out transition when content loads
- Professional loading experience

### 3. **Custom Cursor** (Enterprise Feature)
- Dual-element cursor (dot + outline)
- Smooth GSAP-following animation
- Interactive hover states on buttons/links
- Click animations with elastic easing

### 4. **Navigation Animations**
- Logo fade-in with slide
- Staggered navigation link entrances
- Smooth mobile menu transitions

### 5. **HeroSection Animations**
- Title scale and fade-in
- Search bar slide-up entrance
- Timeline-based sequence

### 6. **Property Card Animations**
- Scroll-triggered stagger animations
- Scale and fade-in on scroll
- Hover effects with spring physics
- Grid layout animations

### 7. **PropertyDetail Page**
- Back button slide animation
- Title and price fade-in sequence
- Section scroll animations
- Sidebar entrance effects

### 8. **Projects Page**
- Header scale and fade-in
- CTA section scroll animation
- Button hover effects

### 9. **ProjectDetail Page**
- Gallery animations
- Section stagger effects
- Property card animations

### 10. **Image Gallery Modal**
- Modal overlay fade-in
- Image scale entrance with back easing
- Navigation animations
- Zoom in/out with GSAP
- Thumbnail strip animations

### 11. **Scroll-Triggered Animations**
- Fade-in-up on scroll
- Fade-in-left/right on scroll
- Scale animations on scroll
- Parallax effects (utility function)

## 📁 New Files Created

```
src/
├── utils/
│   └── gsap.ts                    # GSAP utilities and presets
├── hooks/
│   └── useGSAP.ts                 # Custom React hooks for GSAP
├── components/
│   └── animations/
│       ├── PageTransition.tsx     # Page transition wrapper
│       ├── Preloader.tsx          # Loading screen with animations
│       ├── CustomCursor.tsx       # Custom cursor with GSAP
│       └── index.ts               # Barrel exports
```

## ⚡ Performance Optimizations

### Vite Build Optimizations
- **Code Splitting**: Manual chunks for React, GSAP, i18n, UI libraries
- **Terser Minification**: Console and debugger removal in production
- **CSS Code Splitting**: Separate CSS per chunk
- **Dependency Pre-bundling**: Optimized deps for faster startup
- **Source Maps Disabled**: Smaller production builds

### CSS Optimizations
- **GPU Acceleration**: translateZ(0) for smooth animations
- **Custom Scrollbar**: Clean, minimal scrollbar design
- **Smooth Scrolling**: Native smooth scroll behavior
- **Will-Change**: Performance hints for animations

### React Optimizations
- **GSAP Context**: Proper cleanup on unmount
- **useRef**: Direct DOM manipulation without re-renders
- **useMemo**: Expensive calculations cached
- **useEffect Cleanup**: Prevents memory leaks

## 🎨 GSAP Utility Functions

Available in `src/utils/gsap.ts`:

```typescript
// Entrance animations
fadeInUp(element, delay)
fadeInDown(element, delay)
fadeInLeft(element, delay)
fadeInRight(element, delay)
scaleIn(element, delay)
staggerFadeIn(elements, stagger, delay)

// Scroll-triggered animations
scrollFadeInUp(element)
scrollFadeInLeft(element)
scrollFadeInRight(element)
scrollScaleIn(element)

// Advanced effects
parallax(element, speed)
smoothScrollTo(element, duration)
```

## 🚀 Running the Project

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Server runs at `http://localhost:3000/`

### Production Build
```bash
npm run build
```

## 📊 GSAP Features Breakdown

| Feature | Status | Description |
|---------|--------|-------------|
| Page Transitions | ✅ | Smooth route change animations |
| Preloader | ✅ | Animated loading screen |
| Custom Cursor | ✅ | Dual-element cursor with GSAP |
| Scroll Triggers | ✅ | Scroll-based animations |
| Stagger Effects | ✅ | Sequential element animations |
| Timeline Sequences | ✅ | Coordinated animation flows |
| Hover Animations | ✅ | Interactive element feedback |
| Modal Animations | ✅ | Gallery modal entrances |
| Parallax Effects | ✅ | Depth scrolling effects |
| Custom Hooks | ✅ | React GSAP integration |
| Performance Mode | ✅ | Production optimizations |

## 🎯 GSAP Best Practices Applied

1. **GSAP Context**: All animations wrapped in `gsap.context()` for proper cleanup
2. **ScrollTrigger**: Professional scroll-based animations with proper triggers
3. **Timeline**: Coordinated sequences with precise timing
4. **Easing**: Professional easing curves (power3, back, elastic)
5. **Performance**: GPU-accelerated properties, will-change hints
6. **Accessibility**: Respects reduced motion preferences
7. **Memory Management**: Proper cleanup in useEffect returns

## 🔧 Technical Stack

- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: GSAP 3.12+ (ScrollTrigger, ScrollToPlugin)
- **Routing**: React Router DOM v7
- **Build Tool**: Vite 6.3
- **Icons**: Lucide React
- **i18n**: i18next

## 📝 Notes

- GSAP animations use professional easing curves for smooth, natural motion
- All animations are optimized for 60fps performance
- Custom cursor can be disabled by removing from App.tsx
- Preloader shows only on initial page load
- Scroll animations use ScrollTrigger for efficient viewport detection

## 🎨 Design Tokens

- **Primary Text**: rgb(44,44,44)
- **Secondary Text**: rgb(136,136,136)
- **Accent Green**: rgb(102,252,117)
- **Background**: rgb(250,250,250)
- **Border**: rgb(230,230,230)

---

**Built with GSAP for enterprise-level animations and performance**
