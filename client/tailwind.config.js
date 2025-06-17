/** @type {import('tailwindcss').Config} */

import daisyui from "daisyui";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Fixed content path
  ],
  theme: {
    extend: {
      colors: {
        softPink: "#FF6F91",
        deepCharcoal: "#333333",
        champagneGold: "#D4AF37",
        lightIvory: "#F8F6F0",
        lavender: "#B79ED1",
      },
    },
  },
  safelist: [
    /^bg-/, // Dynamic background color classes
    /^text-/, // Dynamic text color classes
  ],
  plugins: [daisyui],
};
