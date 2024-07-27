import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        fadeInto: 'fadeIn .5s ease-in-out',
        fadeOuto: 'fadeOut .5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        fadeOut: {
          from: { opacity: '1' },
          to: { opacity: '0' }
        }
      }
    },
    colors: {
      primary: '#8d60d5',
      amethyst: {
        DEFAULT: '#8d60d5',
        100: '#1b0d31',
        200: '#361a62',
        300: '#512793',
        400: '#6c34c5',
        500: '#8d60d5',
        600: '#a581de',
        700: '#bba1e6',
        800: '#d2c0ee',
        900: '#e8e0f7'
      },
      salmon_pink: {
        DEFAULT: '#f6a3ad',
        100: '#4a070f',
        200: '#950f1e',
        300: '#df162d',
        400: '#ee5869',
        500: '#f6a3ad',
        600: '#f8b5bd',
        700: '#f9c7cd',
        800: '#fbdade',
        900: '#fdecee'
      },
      carrot_orange: {
        DEFAULT: '#f79e39',
        100: '#3b2002',
        200: '#764105',
        300: '#b06107',
        400: '#eb820a',
        500: '#f79e39',
        600: '#f8b262',
        700: '#fac689',
        800: '#fcd9b1',
        900: '#fdecd8'
      },
      mint_green: {
        DEFAULT: '#c0ede8',
        100: '#13433d',
        200: '#26867a',
        300: '#3ac7b7',
        400: '#7ddacf',
        500: '#c0ede8',
        600: '#ccf1ec',
        700: '#d9f4f1',
        800: '#e6f8f6',
        900: '#f2fbfa'
      },
      moonstone: {
        DEFAULT: '#709ea8',
        100: '#152023',
        200: '#2b4146',
        300: '#406168',
        400: '#55818b',
        500: '#709ea8',
        600: '#8db1b9',
        700: '#aac5cb',
        800: '#c6d8dc',
        900: '#e3ecee'
      }
    },
  },
  daisyui: {
    themes: [{
      default: {
        "primary": "8d60d5",
        "primary-content": "#001008",
        "secondary": "#f6a3ad",
        "secondary-content": "#001008",
        "accent": "#f79e39",
        "accent-content": "#001008",
        "neutral": "#709ea8",
        "neutral-content": "#ffffff",
        "base-100": "#ffffff",
        "base-200": "#ddd9de",
        "base-300": "#d1d5db",
        "base-content": "#161516",
        "info": "#38bdf8",
        "info-content": "#000615",
        "success": "#a3e635",
        "success-content": "#060d00",
        "warning": "#fde047",
        "warning-content": "#0e0400",
        "error": "#ff838d",
        "error-content": "#160607",
      }
    }]
  },
  plugins: [
    require("daisyui"),
    require("@tailwindcss/typography")
  ],
};
export default config;
