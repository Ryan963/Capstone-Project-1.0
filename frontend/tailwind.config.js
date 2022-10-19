/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "darkred",
        dark: "#112549",
        dark2: "#1b3768",
        light: "#f4f4f4",
        danger: "#dc3545",
        success: "#28a745",
        lightblue: "#009ffb",
        lightblue2: "#009ffb11",
        lightgrey: "#f7f7f8",
      },
    },
  },
  plugins: [],
};
