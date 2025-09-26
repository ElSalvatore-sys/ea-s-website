/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  future: {
    hoverOnlyWhenSupported: true, // Prevent hover states on touch devices
  },
  theme: {
    // Mobile-first breakpoints (default Tailwind is mobile-first)
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      // Touch-specific breakpoints
      'touch': { 'raw': '(hover: none)' },
      'no-touch': { 'raw': '(hover: hover)' },
    },
    extend: {
      // Typography
      fontFamily: {
        'inter': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'dm-sans': ['DM Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      // Mobile-optimized animations
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'slide-in': 'slide-in 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'lift': 'lift 0.2s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'slide-in': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'lift': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-2px)' },
        },
      },
      colors: {
        gray: {
          850: '#1f2937',
          950: '#111827',
        },
        // Minimalist background colors
        background: {
          primary: '#FAFAFA',
          secondary: '#FFFFFF',
          tertiary: '#F5F5F5',
        },
        // Industry-specific colors
        restaurant: {
          DEFAULT: '#C65D00',
          light: '#E87A1F',
          bg: '#FFF5F0',
          border: '#FFEDD5',
        },
        medical: {
          DEFAULT: '#0891B2',
          light: '#22D3EE',
          bg: '#F0FDFA',
          border: '#CCFBF1',
        },
        beauty: {
          DEFAULT: '#B76E79',
          light: '#D08A93',
          bg: '#FDF2F4',
          border: '#FECDD3',
        },
        automotive: {
          DEFAULT: '#1E40AF',
          light: '#3B82F6',
          bg: '#EFF6FF',
          border: '#DBEAFE',
        },
        // Keep minimal primary for fallback
        primary: {
          50: '#f3f1ff',
          100: '#ebe5ff',
          200: '#d9ccff',
          300: '#bea6ff',
          400: '#9f75ff',
          500: '#7c3aed',
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#3c1a78',
        },
      },
      // Touch-friendly spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        'touch': '44px', // Minimum touch target size
      },
      // Mobile-optimized typography
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },
      // Mobile-first container sizes
      maxWidth: {
        'screen-xs': '475px',
      },
      // Performance-optimized shadows
      boxShadow: {
        'subtle': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'hover': '0 4px 12px rgba(0, 0, 0, 0.12)',
        'elevated': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'glow-sm': '0 0 5px rgb(124 58 237 / 0.3)',
        'glow-md': '0 0 15px rgb(124 58 237 / 0.4)',
        'glow-lg': '0 0 25px rgb(124 58 237 / 0.5)',
      },
      // Mobile-optimized transitions
      transitionTimingFunction: {
        'bounce-gentle': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'ease-mobile': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      // Mobile-friendly blur effects
      backdropBlur: {
        'xs': '2px',
      },
      // Touch-optimized border radius
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [
    // Custom plugin for mobile-specific utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Touch-friendly tap targets
        '.tap-highlight-none': {
          '-webkit-tap-highlight-color': 'transparent',
        },
        '.tap-highlight-purple': {
          '-webkit-tap-highlight-color': theme('colors.purple.200'),
        },
        // Mobile-optimized scrolling
        '.scroll-smooth-mobile': {
          '-webkit-overflow-scrolling': 'touch',
          'scroll-behavior': 'smooth',
        },
        // Hardware acceleration
        '.gpu': {
          'transform': 'translateZ(0)',
          'will-change': 'transform',
        },
        // Mobile-safe transforms
        '.safe-transform': {
          'transform': 'translate3d(0, 0, 0)',
          'backface-visibility': 'hidden',
        },
        // Touch manipulation
        '.touch-manipulation': {
          'touch-action': 'manipulation',
        },
        // Mobile-optimized text rendering
        '.text-render-optimize': {
          'text-rendering': 'optimizeSpeed',
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
        },
      };
      addUtilities(newUtilities);
    }
  ],
};