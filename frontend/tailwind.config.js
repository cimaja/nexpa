/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'sunset-orange': '#FF7A00',
        'ocean-blue': '#1A96B0',
        'sandy-beige': '#F2E3C9',
        'coral-pink': '#FF5A5F',
      },
      fontFamily: {
        sans: ['Nunito', 'Open Sans', 'sans-serif'],
        heading: ['Montserrat', 'Quicksand', 'sans-serif'],
        display: ['var(--font-surf)', 'sans-serif'],
      },
      backgroundImage: {
        'wave-pattern': "url('/images/wave-pattern.svg')",
        'gradient-sunset': 'linear-gradient(to right, #FF7A00, #FF5A5F)',
      },
    },
  },
  plugins: [],
}
