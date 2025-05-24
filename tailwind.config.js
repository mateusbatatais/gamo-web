/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // App Router
    "./pages/**/*.{js,ts,jsx,tsx}", // caso ainda tenha pages
    "./components/**/*.{js,ts,jsx,tsx}", // pasta de componentes (criaremos)
    "./src/**/*.{js,ts,jsx,tsx}", // se tiver src — não obrigatório
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
