import React from 'react';
// Importamos el spinner que quieras. 
// Opciones populares: HashLoader, PropagateLoader, PuffLoader, BeatLoader
import { PuffLoader } from 'react-spinners';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      
      {/* El Spinner de la librería */}
      <PuffLoader 
        color="#8B0000" 
        size={60} 
        speedMultiplier={1.5}
      />

      {/* Texto de carga */}
      <div className="mt-6 flex flex-col items-center">
        <h3 className="text-lg font-bold text-gray-800 tracking-widest animate-pulse">
          CARGANDO
        </h3>
        <p className="text-sm text-gray-500 font-medium mt-1">
          Estamos preparando todo...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;