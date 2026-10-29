/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        docker: '#0db7ed',
        k8s: '#326ce5',
        nginx: '#009639',
        github: '#238636',
        dark: {
          900: '#0d1117',
          800: '#161b22',
          700: '#21262d',
          600: '#30363d',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      }
    },
  },
  plugins: [],
}
