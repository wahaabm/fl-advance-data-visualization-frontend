/** @type {import('tailwindcss').Config} */

import typography from '@tailwindcss/typography'
import daisyui from 'daisyui'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'selector',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Avenir"', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'login-green': '#4AEFAA',
        'signup-blue': '#3D4AE4',
        'darkmode-black': '#222429',
        'darkmode-gray': '#313642',
        'darkmode-input': '#222429',
      },
    },
  },
  plugins: [daisyui, typography],
  daisyui: {
    themes: ['light', 'dark'],
  },
}
