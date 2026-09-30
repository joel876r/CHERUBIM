/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#070A11',
        surface: {
          DEFAULT: '#0D1322',
          subtle: '#11182C',
          card: '#131D31',
          hover: '#18243C',
          border: '#1E2C47',
          active: '#243452'
        },
        telemetry: {
          cyan: '#38BDF8',
          emerald: '#10B981',
          gold: '#FBBF24',
          rose: '#F43F5E',
          purple: '#A855F7',
          indigo: '#6366F1',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(56, 189, 248, 0.25)',
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.25)',
        'glow-purple': '0 0 20px -3px rgba(168, 85, 247, 0.25)',
        'glow-gold': '0 0 20px -3px rgba(251, 191, 36, 0.25)',
      }
    },
  },
  plugins: [],
}
