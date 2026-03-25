import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // ── Fonts ──────────────────────────────────────────────────────
      fontFamily: {
        'inter':  ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'outfit': ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },

      // ── Design Tokens ──────────────────────────────────────────────
      colors: {
        // Brand palettes
        'brand-green': {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        'brand-gold': {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Semantic Surface tokens (map to CSS vars — light/dark aware)
        'surface': {
          base:    'var(--surface-base)',
          raised:  'var(--surface-raised)',
          overlay: 'var(--surface-overlay)',
          inset:   'var(--surface-inset)',
        },
        // Semantic Content tokens
        'content': {
          primary:   'var(--content-primary)',
          secondary: 'var(--content-secondary)',
          muted:     'var(--content-muted)',
          inverse:   'var(--content-inverse)',
        },
        // Semantic Border tokens
        'border-token': {
          subtle:  'var(--border-subtle)',
          default: 'var(--border-default)',
          strong:  'var(--border-strong)',
        },
        // Accent shortcuts
        'accent-green': 'var(--accent-green)',
        'accent-gold':  'var(--accent-gold)',
      },

      // ── Border Radius ──────────────────────────────────────────────
      borderRadius: {
        'token-sm':   '0.5rem',
        'token-md':   '0.75rem',
        'token-lg':   '1rem',
        'token-xl':   '1.25rem',
        'token-2xl':  '1.5rem',
        'token-pill': '9999px',
      },

      // ── Shadows ────────────────────────────────────────────────────
      boxShadow: {
        'elevation-1': '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
        'elevation-2': '0 4px 6px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.15)',
        'elevation-3': '0 10px 15px rgba(0,0,0,0.3), 0 4px 6px rgba(0,0,0,0.2)',
        'elevation-4': '0 20px 25px rgba(0,0,0,0.4), 0 10px 10px rgba(0,0,0,0.2)',
        'glow-green':  '0 0 20px rgba(34,197,94,0.15), 0 0 40px rgba(34,197,94,0.08)',
        'glow-gold':   '0 0 20px rgba(245,158,11,0.15), 0 0 40px rgba(245,158,11,0.08)',
        'sidebar':     '4px 0 24px rgba(0,0,0,0.4)',
        'card':        '0 1px 3px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.2)',
        'raised':      '0 4px 16px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.3)',
        'dropdown':    '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)',
      },

      // ── Typography ─────────────────────────────────────────────────
      fontSize: {
        'display':   ['2.5rem',   { lineHeight: '1.15', fontWeight: '800', letterSpacing: '-0.02em' }],
        'h1':        ['2rem',     { lineHeight: '1.2',  fontWeight: '700', letterSpacing: '-0.015em' }],
        'h2':        ['1.5rem',   { lineHeight: '1.3',  fontWeight: '700', letterSpacing: '-0.01em' }],
        'h3':        ['1.25rem',  { lineHeight: '1.4',  fontWeight: '600' }],
        'h4':        ['1.125rem', { lineHeight: '1.4',  fontWeight: '600' }],
        'body-lg':   ['1rem',     { lineHeight: '1.6' }],
        'body':      ['0.875rem', { lineHeight: '1.6' }],
        'body-sm':   ['0.8125rem',{ lineHeight: '1.5' }],
        'caption':   ['0.75rem',  { lineHeight: '1.4',  fontWeight: '500' }],
        'overline':  ['0.6875rem',{ lineHeight: '1.4',  fontWeight: '600', letterSpacing: '0.08em' }],
      },

      // ── Animations ─────────────────────────────────────────────────
      animation: {
        'fade-in':       'fade-in 0.25s ease-out forwards',
        'slide-up':      'slide-up 0.3s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.3s ease-out forwards',
        'scale-in':      'scale-in 0.2s ease-out forwards',
        'pulse-soft':    'pulse-soft 2s ease-in-out infinite',
        'shimmer':       'shimmer 2s linear infinite',
        'float':         'float 3s ease-in-out infinite',
        'notif-pulse':   'notification-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          '0%':   { opacity: '0', transform: 'translateX(-14px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.65' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        'notification-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(34,197,94,0.4)' },
          '50%':      { boxShadow: '0 0 0 6px rgba(34,197,94,0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
