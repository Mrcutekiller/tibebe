import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          DEFAULT: '#0B5D3B',
          dark: '#083d28',
          light: '#12754b',
          muted: '#e8f5ee',
          50: '#f0faf4',
          100: '#dcf2e7',
          200: '#b8e4ce',
          300: '#81ceaa',
          400: '#45b17f',
          500: '#22955d',
          600: '#0B5D3B',
          700: '#084a2f',
          800: '#063b25',
          900: '#042e1c',
        },
        gold: {
          DEFAULT: '#E0A526',
          dark: '#c78f15',
          light: '#f0ba3e',
          muted: '#fdf3dc',
        },
        cream: {
          DEFAULT: '#FAF6EC',
          dark: '#f0e9d2',
        },
        ink: {
          DEFAULT: '#12202B',
          muted: '#2d3f4e',
          light: '#4a6174',
        },
        red: {
          tibeb: '#C8372D',
          light: '#f8d7d5',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        ethiopic: ['Noto Sans Ethiopic', 'sans-serif'],
        sans: ['Poppins', 'Noto Sans Ethiopic', 'sans-serif'],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
        '3xl': '28px',
      },
      boxShadow: {
        green: '0 4px 20px rgba(11,93,59,0.25)',
        gold: '0 4px 20px rgba(224,165,38,0.35)',
        card: '0 4px 12px rgba(0,0,0,0.08)',
        'card-hover': '0 12px 32px rgba(0,0,0,0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease both',
        'slide-up': 'slideUp 0.4s ease both',
        'scale-in': 'scaleIn 0.3s ease both',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'hero-pattern': "repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 0, transparent 50%)",
      },
      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [],
};

export default config;
