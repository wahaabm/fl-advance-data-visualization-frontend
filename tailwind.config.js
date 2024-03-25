/** @type {import('tailwindcss').Config} */

import daisyui from "daisyui";
import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms"

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui, typography,forms ],
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
};
