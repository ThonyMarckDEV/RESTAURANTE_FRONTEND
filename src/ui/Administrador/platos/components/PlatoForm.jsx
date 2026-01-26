import React from 'react';
import { FireIcon, TagIcon, CurrencyDollarIcon, PhotoIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const PlatoForm = ({ formData, onChange, categorias = [] }) => {
  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-restaurant-secondary focus:border-restaurant-secondary outline-none text-sm transition-all";
  const labelClass = "block text-xs font-bold text-gray-600 mb-1";

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-restaurant-primary h-fit max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-3">
        <div className="p-2 bg-restaurant-surface rounded-full">
          <FireIcon className="w-6 h-6 text-restaurant-secondary" />
        </div>
        <h2 className="text-lg font-bold text-gray-800">Datos del Plato</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Columna Izquierda */}
        <div className="space-y-4">
            {/* Categoría */}
            <div>
               <label className={labelClass}>Categoría (Tipo Plato)</label>
               <div className="relative">
                 <TagIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                 <select 
                    name="categoriaId" 
                    value={formData.categoriaId} 
                    onChange={onChange} 
                    className={`${inputClass} pl-10`}
                    required
                 >
                    <option value="">-- Seleccione Categoría --</option>
                    {categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                 </select>
               </div>
            </div>

            {/* Nombre */}
            <div>
              <label className={labelClass}>Nombre del Plato</label>
              <input 
                name="nombre" 
                value={formData.nombre} 
                onChange={onChange} 
                className={inputClass} 
                placeholder="Ej: Lomo Saltado, Ceviche Mixto"
                required 
              />
            </div>

            {/* Precio Venta */}
            <div>
                <label className={labelClass}>Precio Venta (Público)</label>
                <div className="relative">
                    <CurrencyDollarIcon className="absolute left-3 top-2.5 h-4 w-4 text-emerald-600" />
                    <input 
                        type="number"
                        step="0.01"
                        name="precioVenta" 
                        value={formData.precioVenta} 
                        onChange={onChange} 
                        className={`${inputClass} pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500`}
                        placeholder="0.00"
                        required
                    />
                </div>
            </div>
            
            {/* Estado */}
            <div>
                <label className={labelClass}>Estado</label>
                <select name="estado" value={formData.estado} onChange={onChange} className={inputClass}>
                    <option value={1}>Activo (Disponible en Carta)</option>
                    <option value={0}>Inactivo (No Disponible)</option>
                </select>
            </div>
        </div>

        {/* Columna Derecha */}
        <div className="space-y-4">
            
            {/* Descripción */}
            <div>
              <label className={labelClass}>Descripción (Carta)</label>
              <div className="relative">
                <DocumentTextIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <textarea 
                    name="descripcion" 
                    value={formData.descripcion || ''} 
                    onChange={onChange} 
                    className={`${inputClass} pl-10 h-24 resize-none`} 
                    placeholder="Ej: Trozos de lomo fino salteados al wok con cebolla y tomate..."
                />
              </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default PlatoForm;