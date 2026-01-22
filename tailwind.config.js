/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Agregamos la paleta de colores para el restaurante
      colors: {
        restaurant: {
          primary: '#8B0000',    // Un rojo vino profundo (Dark Red)
          secondary: '#D2691E',  // Chocolate/Naranja quemado
          accent: '#FFD700',     // Dorado para detalles
          surface: '#FFF8E1',    // Un crema suave para fondos claros (Milk white)
          dark: '#1A1A1A',       // Un negro suave
        }
      },
      // Mantenemos tus animaciones por si las usas en otra parte
      keyframes: {
        'move-stars': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        'star-sparkle': {
          '0%, 100%': { 
            opacity: '0.7',
            transform: 'scale(1)',
            boxShadow: '0 0 4px 1px rgba(255,255,255,0.5)'
          },
          '50%': { 
            opacity: '0.3',
            transform: 'scale(0.8)',
            boxShadow: '0 0 8px 3px rgba(255,255,255,0.8)'
          }
        },
        // Animación suave de entrada para el login
        'fade-in-up': {
            '0%': { opacity: '0', transform: 'translateY(20px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'move-stars': 'move-stars 20s linear infinite',
        'star-sparkle': 'star-sparkle 3s infinite',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
      }
    }
  },
  plugins: [],
}