import React from 'react';
import { TagIcon, SwatchIcon } from '@heroicons/react/24/outline';

const CategoriaForm = ({ formData, onChange }) => {
  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-restaurant-secondary focus:border-restaurant-secondary outline-none text-sm transition-all";
  const labelClass = "block text-xs font-bold text-gray-600 mb-1";

  const handleLetterChange = (e) => {
    const { value } = e.target;
    // Permite letras y espacios
    if (value === '' || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
      onChange(e);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-restaurant-primary h-fit max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-3">
        <div className="p-2 bg-restaurant-surface rounded-full">
          <TagIcon className="w-6 h-6 text-restaurant-secondary" />
        </div>
        <h2 className="text-lg font-bold text-gray-800">Datos de la Categoría</h2>
      </div>

      <div className="space-y-4">
        {/* Nombre */}
        <div>
          <label className={labelClass}>Nombre de la Categoría</label>
          <input 
            name="nombre" 
            value={formData.nombre} 
            onChange={handleLetterChange} 
            className={inputClass} 
            placeholder="Ej: Bebidas, Entradas, Carnes"
            required 
          />
        </div>

        {/* Tipo de Categoría (NUEVO) */}
        <div>
            <label className={labelClass}>Tipo de Ítem</label>
            <div className="relative">
                <SwatchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <select 
                    name="tipoCategoria" 
                    value={formData.tipoCategoria} 
                    onChange={onChange} 
                    className={`${inputClass} pl-10`}
                    required
                >
                    <option value={1}>Insumo (Solo Almacén)</option>
                    <option value={2}>Producto (Solo Venta)</option>
                    <option value={3}>Plato (Solo Cocina)</option>
                    <option value={4}>Mixto (General)</option>
                </select>
            </div>
            <p className="text-[10px] text-gray-400 mt-1 ml-1">
                Define dónde aparecerá esta categoría en el sistema.
            </p>
        </div>

        {/* Estado */}
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