import type { Config } from "tailwindcss";
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {}
  },
  plugins: []
} satisfies Config;
