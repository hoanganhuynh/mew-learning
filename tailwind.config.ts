import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Brand semantic colours — driven by CSS variables ─────────────────
        // Values are RGB triplets so Tailwind can inject opacity modifiers.
        brand: {
          bg:      'rgb(var(--brand-bg)      / <alpha-value>)',
          surface: 'rgb(var(--brand-surface) / <alpha-value>)',
          surface2:'rgb(var(--brand-surface2)/ <alpha-value>)',
          text:    'rgb(var(--brand-text)    / <alpha-value>)',
          strong:  'rgb(var(--brand-strong)  / <alpha-value>)',
          muted:   'rgb(var(--brand-muted)   / <alpha-value>)',
          border:  'rgb(var(--brand-border)  / <alpha-value>)',
          input:   'rgb(var(--brand-input)   / <alpha-value>)',
        },
        // ── Duolingo product colours ──────────────────────────────────────────
        primary: {
          DEFAULT: '#58CC02',
          dark:    '#46A302',
          light:   '#89E219',
        },
        secondary: {
          DEFAULT: '#1CB0F6',
          dark:    '#0095D9',
          light:   '#69D2FF',
        },
        accent: {
          DEFAULT: '#FFC800',
          dark:    '#E6A800',
          light:   '#FFD84D',
        },
        danger: {
          DEFAULT: '#FF4B4B',
          dark:    '#CC0000',
          light:   '#FF8080',
        },
        success: '#23C552',
      },
      fontFamily: {
        sans: ['var(--font-nunito)', 'Nunito', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        card:       '0 2px 12px rgba(0,0,0,0.08)',
        'card-hover':'0 6px 24px rgba(0,0,0,0.12)',
        bubble:     '0 1px 4px rgba(0,0,0,0.1)',
        'dark-card': '0 2px 12px rgba(0,0,0,0.4)',
      },
      keyframes: {
        'bounce-in':    { '0%':  { transform: 'scale(0.8)', opacity: '0' }, '60%': { transform: 'scale(1.05)' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        'slide-up':     { '0%':  { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        'pulse-record': { '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,75,75,0.4)' }, '50%': { boxShadow: '0 0 0 12px rgba(255,75,75,0)' } },
        shimmer:        { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        'bounce-in':    'bounce-in 0.4s ease-out',
        'slide-up':     'slide-up 0.3s ease-out',
        'pulse-record': 'pulse-record 1.2s infinite',
        shimmer:        'shimmer 2s infinite linear',
      },
    },
  },
  plugins: [],
};

export default config;
