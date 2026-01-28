import React from 'react';
import { ArchiveBoxIcon, TagIcon } from '@heroicons/react/24/outline';

const CajaForm = ({ formData, onChange, isEditing = false }) => {
  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-restaurant-secondary focus:border-restaurant-secondary outline-none text-sm transition-all";
  const labelClass = "block text-xs font-bold text-gray-600 mb-1";

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-restaurant-primary h-fit">
      
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-3">
        <div className="p-2 bg-restaurant-surface rounded-full">
          <ArchiveBoxIcon className="w-6 h-6 text-restaurant-secondary" />
        </div>
        <h2 className="text-lg font-bold text-gray-800">
            {isEditing ? 'Información de la Caja' : 'Datos de la Nueva Caja'}
        </h2>
      </div>

      <div className="space-y-4">
          <div>
            <label className={labelClass}>Nombre de la Caja <span className="text-red-500">*</span></label>
            <div className="relative">
                <TagIcon className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                <input 
                  name="nombre" 
                  value={formData.nombre} 
                  onChange={onChange} 
                  className={`${inputClass} pl-9`} 
                  placeholder="Ej. Caja Principal, Caja 02, Barra..."
                  required 
                />
            </div>
            <p className="text-[10px] text-gray-400 mt-1 ml-1">
                El nombre debe ser único dentro de tu sede.
            </p>
          </div>
      </div>

    </div>
  );
};

export default CajaForm;