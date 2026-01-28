import React from 'react';
import { BuildingStorefrontIcon, CubeIcon, TagIcon } from '@heroicons/react/24/outline';

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
              placeholder="Ej: Almacén Seco Principal, Cámara Fría 1"
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

        {/* Tipo de Almacén */}
        <div>
            <label className={labelClass}>Tipo de Almacén</label>
            <div className="relative">
                <TagIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <select 
                    name="tipo_almacen" 
                    value={formData.tipo_almacen} 
                    onChange={onChange} 
                    className={`${inputClass} pl-10`}
                    required
                >
                    <option value={1}>Almacén Seco (General)</option>
                    <option value={2}>Refrigerado / Congelado</option>
                    <option value={3}>Área de Producción (Cocina)</option>
                    <option value={4}>Punto de Venta (Barra/Caja)</option>
                </select>
            </div>
            <p className="text-[10px] text-gray-400 mt-1 ml-1">
                Define la naturaleza de los insumos que se guardarán aquí.
            </p>
        </div>

        {/* Estado */}
        <div>
            <label className={labelClass}>Estado Inicial</label>
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