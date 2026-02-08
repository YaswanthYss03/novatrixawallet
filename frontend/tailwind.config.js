/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00D982', // Green accent from Trust Wallet
        background: '#0F1010',
        card: '#1A1B1F',
        text: {
          primary: '#FFFFFF',
          secondary: '#8E8E93',
        }
      },
    },
  },
  plugins: [],
}
