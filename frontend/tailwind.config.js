module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        // Oscurecer los tonos de gris para obtener mayor contraste
        gray: {
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563', // Original: #6b7280
          700: '#374151', // Original: #4b5563
          800: '#1f2937', // Original: #374151
          900: '#111827', // Original: #1f2937
        }
      },
      textColor: {
        // Define colores de texto con mejor contraste
        base: '#111827', // Texto base más oscuro
        muted: '#374151', // Texto secundario más oscuro
        'blue-primary': '#1e40af', // Azul más contrastante
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
