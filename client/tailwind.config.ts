import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class', // Enable dark mode via class
  content: ['./src/**/*.{js,ts,jsx,tsx}'], // important!
  theme: {
    extend: {
      colors: {
        primary: '#22c55e', // tennis green
        background: '#ffffff',
        darkBackground: '#1f2937',
      },
    },
  },
  plugins: [],
}

export default config
