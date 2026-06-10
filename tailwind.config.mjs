import tailwindcssAnimate from 'tailwindcss-animate'
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  plugins: [tailwindcssAnimate, typography],
  prefix: '',
  safelist: [
    'lg:col-span-4',
    'lg:col-span-6',
    'lg:col-span-8',
    'lg:col-span-12',
    'border-border',
    'bg-card',
    'border-error',
    'bg-error/30',
    'border-success',
    'bg-success/30',
    'border-warning',
    'bg-warning/30',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        '2xl': '2rem',
        DEFAULT: '1rem',
        lg: '2rem',
        md: '2rem',
        sm: '1rem',
        xl: '2rem',
      },
      screens: {
        '2xl': '86rem',
        lg: '64rem',
        md: '48rem',
        sm: '40rem',
        xl: '80rem',
      },
    },
    extend: {
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-up': 'fade-up 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.5s ease-out forwards',
        'reveal': 'reveal 0.8s ease-out forwards',
        'typewriter': 'typewriter 0.05s steps(1) forwards',
      },
      borderRadius: {
        sm: '3px',
        md: '6px',
        lg: '10px',
        xl: '16px',
        '2xl': '24px',
        arch: '999px 999px 0 0',
        vintage: '3px',
      },
      borderWidth: {
        hair: '1px',
        thin: '1.5px',
        stamp: '2.5px',
      },
      boxShadow: {
        // Flat DS shadow scale (sepia-800 base, subtle and warm)
        xs: '0 1px 0 rgba(56, 48, 31, 0.08)',
        sm: '0 1px 2px rgba(56, 48, 31, 0.1)',
        md: '0 6px 16px -8px rgba(56, 48, 31, 0.22)',
        lg: '0 16px 34px -16px rgba(56, 48, 31, 0.28)',
        xl: '0 28px 56px -22px rgba(56, 48, 31, 0.32)',
        'inset-press': 'inset 0 2px 3px rgba(56, 48, 31, 0.16)',
        // Legacy aliases (usages removed in the block restyle pass)
        soft: '0 1px 2px rgba(56, 48, 31, 0.1)',
        organic: '0 6px 16px -8px rgba(56, 48, 31, 0.22)',
        'organic-lg': '0 16px 34px -16px rgba(56, 48, 31, 0.28)',
        'glow-warm': '0 8px 28px -12px rgba(214, 162, 62, 0.44)',
        'glow-accent': '0 8px 30px -10px rgba(197, 107, 69, 0.4)',
      },
      colors: {
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        background: 'hsl(var(--background))',
        border: 'hsl(var(--border))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        foreground: 'hsl(var(--foreground))',
        highlight: 'hsl(var(--highlight))',
        input: 'hsl(var(--input))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        ring: 'hsl(var(--ring))',
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        success: 'hsl(var(--success))',
        error: 'hsl(var(--error))',
        warning: 'hsl(var(--warning))',
        // TEB raw palette — static hex so opacity modifiers work natively
        paper: '#FFFCF3',
        oat: {
          50: '#FAF3E2',
          100: '#F4E9D2',
          200: '#EBDBBC',
          300: '#DCC79F',
        },
        sepia: {
          400: '#B59A72',
          500: '#8C7350',
          600: '#6B5639',
          700: '#4E3F2A',
          800: '#38301F',
          900: '#261F13',
        },
        clay: {
          100: '#F7E5DA',
          200: '#EFCDBB',
          300: '#E3AB8F',
          400: '#D68A68',
          500: '#C56B45',
          600: '#B05636',
          700: '#97462A',
        },
        gold: {
          200: '#F5E7C4',
          300: '#EDD497',
          400: '#E3BB66',
          500: '#D6A23E',
          600: '#BE852A',
        },
        moss: {
          200: '#E0DEBE',
          300: '#C7C492',
          400: '#A6A266',
          500: '#87833F',
          600: '#6C6930',
          700: '#54521F',
        },
        denim: {
          200: '#D6E4E5',
          300: '#B2CCCF',
          400: '#84ABB0',
          500: '#58888F',
          600: '#3D6E72',
          700: '#2F565B',
        },
        rose: {
          300: '#E9B2A2',
          400: '#D98C79',
        },
        // Legacy `sky-*` usages retheme to denim (dusty teal)
        sky: {
          100: '#D6E4E5',
          200: '#D6E4E5',
          400: '#84ABB0',
          500: '#58888F',
          600: '#3D6E72',
          900: '#2F565B',
        },
      },
      fontFamily: {
        mono: ['var(--font-space-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        sans: ['var(--font-archivo)', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-archivo)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1.3' }],
        'display-xl': ['4rem', { lineHeight: '1.04', letterSpacing: '-0.02em' }],
        'display-lg': ['3rem', { lineHeight: '1.04', letterSpacing: '-0.02em' }],
        'display-md': ['2.25rem', { lineHeight: '1.16', letterSpacing: '-0.02em' }],
        'display-sm': ['1.75rem', { lineHeight: '1.16', letterSpacing: '-0.02em' }],
        'label': ['0.75rem', { lineHeight: '1.3', letterSpacing: '0.18em' }],
        'label-sm': ['0.6875rem', { lineHeight: '1.3', letterSpacing: '0.18em' }],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'reveal': {
          from: { opacity: '0', transform: 'translateY(30px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'typewriter': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      letterSpacing: {
        display: '-0.02em',
        label: '0.18em',
        // Legacy aliases — converge on the DS label tracking
        stamp: '0.18em',
        'stamp-wide': '0.22em',
        vintage: '0.12em',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      transitionDuration: {
        fast: '140ms',
        base: '260ms',
        slow: '480ms',
      },
      transitionTimingFunction: {
        'teb-out': 'cubic-bezier(0.22, 0.7, 0.3, 1)',
        'teb-inout': 'cubic-bezier(0.6, 0, 0.3, 1)',
      },
      typography: () => ({
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': 'hsl(var(--card-foreground))',
              '--tw-prose-headings': 'hsl(var(--foreground))',
              '--tw-prose-links': 'hsl(var(--primary))',
              '--tw-prose-bold': 'hsl(var(--foreground))',
              '--tw-prose-bullets': 'hsl(var(--muted-foreground))',
              '--tw-prose-quotes': 'hsl(var(--foreground))',
              h1: {
                fontFamily: 'var(--font-archivo)',
                fontStretch: '125%',
                fontWeight: '800',
                letterSpacing: '-0.02em',
                lineHeight: '1.04',
                marginBottom: '0.35em',
              },
              h2: {
                fontFamily: 'var(--font-archivo)',
                fontStretch: '125%',
                fontWeight: '800',
                letterSpacing: '-0.02em',
                lineHeight: '1.16',
              },
              h3: {
                fontFamily: 'var(--font-archivo)',
                fontStretch: '125%',
                fontWeight: '700',
                letterSpacing: '-0.01em',
              },
              h4: {
                fontFamily: 'var(--font-archivo)',
                fontStretch: '125%',
                fontWeight: '700',
              },
              blockquote: {
                fontStyle: 'italic',
                borderLeftColor: 'hsl(var(--primary))',
                borderLeftWidth: '2.5px',
              },
              a: {
                textDecorationThickness: '1px',
                textUnderlineOffset: '2px',
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: 'hsl(var(--accent))',
                },
              },
              code: {
                fontFamily: 'var(--font-space-mono)',
              },
            },
          ],
        },
        base: {
          css: [
            {
              h1: {
                fontSize: '2.8rem',
              },
              h2: {
                fontSize: '1.5rem',
              },
            },
          ],
        },
        md: {
          css: [
            {
              h1: {
                fontSize: '3.5rem',
              },
              h2: {
                fontSize: '2rem',
              },
            },
          ],
        },
      }),
    },
  },
}

export default config
