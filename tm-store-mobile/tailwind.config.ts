import type { Config } from "tailwindcss";
// import tailwindcssPrimeui from 'tailwindcss-primeui'
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {}
  },
  plugins: []//[tailwindcssPrimeui]
} satisfies Config;
