import React from 'react';
import { TagIcon } from '@heroicons/react/24/outline';

const CategoriaForm = ({ formData, onChange }) => {
  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-restaurant-secondary focus:border-restaurant-secondary outline-none text-sm transition-all";
  const labelClass = "block text-xs font-bold text-gray-600 mb-1";

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-restaurant-primary h-fit max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-3">
        <div className="p-2 bg-restaurant-surface rounded-full">
          <TagIcon className="w-6 h-6 text-restaurant-secondary" />
        </div>
        <h2 className="text-lg font-bold text-gray-800">Datos de la Categoría</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className={labelClass}>Nombre de la Categoría</label>
          <input 
            name="nombre" 
            value={formData.nombre} 
            onChange={onChange} 
            className={inputClass} 
            placeholder="Ej: Bebidas, Entradas, Platos de Fondo"
            required 
          />
        </div>

        <div>
            <label className={labelClass}>Estado Inicial</label>
            <select name="estado" value={formData.estado} onChange={onChange} className={inputClass}>
                <option value={1}>Activo / Operativo</option>
                <option value={0}>Inactivo / Deshabilitado</option>
            </select>
        </div>
      </div>
    </div>
  );
};

export default CategoriaForm;