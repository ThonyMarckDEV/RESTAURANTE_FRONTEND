import React from 'react';
import { BuildingStorefrontIcon, CubeIcon } from '@heroicons/react/24/outline';

const AlmacenForm = ({ formData, onChange }) => {
  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-restaurant-secondary focus:border-restaurant-secondary outline-none text-sm transition-all";
  const labelClass = "block text-xs font-bold text-gray-600 mb-1";

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-restaurant-primary h-fit max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-3">
        <div className="p-2 bg-restaurant-surface rounded-full">
          <CubeIcon className="w-6 h-6 text-restaurant-secondary" />
        </div>
        <h2 className="text-lg font-bold text-gray-800">Datos del Almacén</h2>
      </div>

      <div className="space-y-4">
        
        {/* Nombre */}
        <div>
          <label className={labelClass}>Nombre del Almacén</label>
          <div className="relative">
            <BuildingStorefrontIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              name="nombre" 
              value={formData.nombre} 
              onChange={onChange} 
              className={`${inputClass} pl-10`} 
              placeholder="Ej: Cocina Principal, Barra, Congeladora 1"
              required 
            />
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className={labelClass}>Descripción (Opcional)</label>
          <textarea 
            name="descripcion" 
            value={formData.descripcion || ''} 
            onChange={onChange} 
            className={inputClass} 
            rows="2"
            placeholder="Detalles sobre qué se guarda aquí..."
          />
        </div>

        {/* Es Refrigerado */}
        <div>
            <label className={labelClass}>Tipo de Ambiente</label>
            <select name="esRefrigerado" value={formData.esRefrigerado} onChange={onChange} className={inputClass}>
                <option value={false}>Ambiente Seco / Normal</option>
                <option value={true}>Refrigerado / Congelado</option>
            </select>
        </div>

        {/* Estado */}
        <div>
            <label className={labelClass}>Estado</label>
            <select name="estado" value={formData.estado} onChange={onChange} className={inputClass}>
                <option value={1}>Activo</option>
                <option value={0}>Inactivo</option>
            </select>
        </div>
      </div>
    </div>
  );
};

export default AlmacenForm;