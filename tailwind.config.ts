import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // newGreen: {
        //   50: "#aec296",
        //   100: "#9ab47d",
        //   200: "#86a565",
        //   300: "#72964c",
        //   400: "#5e8833",
        //   500: "#497a16",
        // },
        shades: {
          50: "#8b8b8b",
          100: "#717171",
          200: "#575757",
          300: "#3f3f3f",
          400: "#282828",
          500: "#121212",
        },
        neutral: {
          50: "#f9f9f9",
          100: "#f2f2f2",
          200: "#e6e6e6",
          300: "#d9d9d9",
          400: "#bfbfbf",
          500: "#a6a6a6",
          600: "#8c8c8c",
          700: "#737373",
          800: "#595959",
          900: "#404040",
        },
      },
      spacing: {
        slim: "480px",
      },
      fontSize: {
        xxs: ["0.625rem", "0.875rem"],
      },
    },
  },
  plugins: [],
}
export default config
