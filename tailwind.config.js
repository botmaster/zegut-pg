import forms from '@tailwindcss/forms'
import typo from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#eb1c26',
          dark: '#b9151b',
          light: '#ff4d4f'
        },
        accent: {
          DEFAULT: '#c7c7c7',
          dark: '#8c8c8c',
          light: '#e1e1e1'
        }
      }
    },
    container: {
      padding: {
        DEFAULT: '1rem',
        md: '3rem'
      }
    }
  },

  plugins: [forms({}), typo]
}
