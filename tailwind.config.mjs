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
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        vintage: '0.125rem',
      },
      boxShadow: {
        'organic': '0 4px 20px -4px hsl(155 30% 20% / 0.08), 0 8px 32px -8px hsl(155 30% 20% / 0.1)',
        'organic-lg': '0 8px 30px -6px hsl(155 30% 20% / 0.12), 0 16px 48px -12px hsl(155 30% 20% / 0.15)',
        'glow-warm': '0 0 40px hsl(32 95% 52% / 0.2)',
        'glow-accent': '0 8px 30px hsl(32 95% 52% / 0.25)',
        'soft': '0 2px 8px hsl(155 30% 20% / 0.06)',
      },
      colors: {
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        background: 'hsl(var(--background))',
        border: 'hsla(var(--border))',
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
        sunset: 'hsl(var(--sunset))',
        lavender: 'hsl(var(--lavender))',
        sky: 'hsl(var(--sky))',
      },
      fontFamily: {
        mono: ['var(--font-jetbrains-mono)'],
        sans: ['var(--font-space-grotesk)'],
        display: ['var(--font-display)'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '0.02em' }],
        'display-lg': ['3.5rem', { lineHeight: '1.15', letterSpacing: '0.02em' }],
        'display-md': ['2.5rem', { lineHeight: '1.2', letterSpacing: '0.01em' }],
        'display-sm': ['1.75rem', { lineHeight: '1.25', letterSpacing: '0.01em' }],
        'label': ['0.65rem', { lineHeight: '1', letterSpacing: '0.25em' }],
        'label-sm': ['0.55rem', { lineHeight: '1', letterSpacing: '0.3em' }],
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
        'stamp': '0.25em',
        'stamp-wide': '0.35em',
        'vintage': '0.15em',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      typography: () => ({
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': 'hsl(var(--foreground))',
              '--tw-prose-headings': 'hsl(var(--foreground))',
              '--tw-prose-links': 'hsl(var(--accent))',
              '--tw-prose-bold': 'hsl(var(--foreground))',
              '--tw-prose-bullets': 'hsl(var(--muted-foreground))',
              h1: {
                fontFamily: 'var(--font-display)',
                fontWeight: '400',
                letterSpacing: '0.02em',
                marginBottom: '0.35em',
              },
              h2: {
                fontFamily: 'var(--font-display)',
                fontWeight: '400',
                letterSpacing: '0.01em',
              },
              h3: {
                fontFamily: 'var(--font-display)',
                fontWeight: '400',
              },
              blockquote: {
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                borderLeftColor: 'hsl(var(--accent))',
                borderLeftWidth: '2px',
              },
              a: {
                textDecorationThickness: '1px',
                textUnderlineOffset: '3px',
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: 'hsl(var(--accent))',
                },
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
                fontWeight: '400',
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
