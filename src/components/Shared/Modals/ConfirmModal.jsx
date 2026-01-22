// src/components/Shared/Modals/ConfirmModal.jsx

import React from 'react';
// Asegúrate de tener instalado @heroicons/react
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ConfirmModal = ({ message, onConfirm, onCancel, confirmText = 'Sí, continuar', cancelText = 'Cancelar' }) => {
    return (
        // 1. Fondo oscuro con desenfoque (Backdrop Blur)
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-restaurant-dark/70 backdrop-blur-sm transition-opacity duration-300">
            
            {/* 2. Tarjeta del Modal */}
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm transform transition-all scale-100 overflow-hidden border-t-8 border-restaurant-secondary">
                
                <div className="p-6 text-center">
                    {/* Icono decorativo (Alerta) */}
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 mb-5 ring-4 ring-orange-50 animate-pulse">
                        <ExclamationTriangleIcon className="h-7 w-7 text-restaurant-secondary" aria-hidden="true" />
                    </div>

                    {/* Título y Mensaje */}
                    <h3 className="text-xl font-serif font-bold text-restaurant-primary mb-2">
                        Confirmación Requerida
                    </h3>
                    <p className="text-sm text-gray-500 mb-8 px-2 font-medium">
                        {message}
                    </p>

                    {/* 3. Botones Centrados y Estilizados */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        
                        {/* Botón Cancelar (Estilo secundario/outline) */}
                        <button
                            onClick={onCancel}
                            className="w-full sm:w-auto min-w-[100px] px-4 py-2.5 rounded-lg border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 transition-colors duration-200 focus:outline-none"
                        >
                            {cancelText}
                        </button>

                        {/* Botón Confirmar (Estilo Primario - Rojo Vino) */}
                        <button
                            onClick={onConfirm}
                            className="w-full sm:w-auto min-w-[100px] px-4 py-2.5 rounded-lg bg-restaurant-primary text-white font-bold text-sm shadow-lg hover:bg-red-900 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-restaurant-secondary"
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>

                {/* Decoración inferior (opcional) */}
                <div className="h-1 w-full bg-gradient-to-r from-restaurant-secondary via-restaurant-accent to-restaurant-secondary opacity-50"></div>
            </div>
        </div>
    );
};

export default ConfirmModal;