import React from 'react';
import { ArchiveBoxIcon, TagIcon, CurrencyDollarIcon, ScaleIcon, QrCodeIcon } from '@heroicons/react/24/outline';

const InsumoForm = ({ formData, onChange, categorias = [] }) => {
  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-restaurant-secondary focus:border-restaurant-secondary outline-none text-sm transition-all";
  const labelClass = "block text-xs font-bold text-gray-600 mb-1";

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-restaurant-primary h-fit max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-3">
        <div className="p-2 bg-restaurant-surface rounded-full">
          <ArchiveBoxIcon className="w-6 h-6 text-restaurant-secondary" />
        </div>
        <h2 className="text-lg font-bold text-gray-800">Datos del Insumo</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Columna Izquierda */}
        <div className="space-y-4">
            {/* Categoría */}
            <div>
               <label className={labelClass}>Categoría</label>
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
              <label className={labelClass}>Nombre del Insumo</label>
              <input 
                name="nombre" 
                value={formData.nombre} 
                onChange={onChange} 
                className={inputClass} 
                placeholder="Ej: Lomo Fino, Arroz Extra, Aceite"
                required 
              />
            </div>

            {/* Código Interno */}
            <div>
              <label className={labelClass}>Código Interno (Opcional)</label>
              <div className="relative">
                <QrCodeIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input 
                    name="codigoInterno" 
                    value={formData.codigoInterno || ''} 
                    onChange={onChange} 
                    className={`${inputClass} pl-10`} 
                    placeholder="Ej: INS-001"
                />
              </div>
            </div>
        </div>

        {/* Columna Derecha */}
        <div className="space-y-4">
            {/* Unidad de Medida */}
            <div>
                <label className={labelClass}>Unidad de Medida</label>
                <div className="relative">
                    <ScaleIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <select name="unidadMedida" value={formData.unidadMedida} onChange={onChange} className={`${inputClass} pl-10`}>
                        <option value="KG">Kilogramos (KG)</option>
                        <option value="LT">Litros (LT)</option>
                        <option value="UNIDAD">Unidad (UND)</option>
                        <option value="PAQUETE">Paquete</option>
                        <option value="LATA">Lata</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Precio Compra */}
                <div>
                    <label className={labelClass}>Costo Promedio</label>
                    <div className="relative">
                        <CurrencyDollarIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input 
                            type="number"
                            step="0.01"
                            name="precioCompraPromedio" 
                            value={formData.precioCompraPromedio} 
                            onChange={onChange} 
                            className={`${inputClass} pl-10`}
                            placeholder="0.00"
                        />
                    </div>
                </div>

                {/* Stock Mínimo */}
                <div>
                    <label className={labelClass}>Stock Mínimo (Alerta)</label>
                    <input 
                        type="number"
                        step="0.01"
                        name="stockMinimo" 
                        value={formData.stockMinimo} 
                        onChange={onChange} 
                        className={inputClass}
                        placeholder="5.00"
                    />
                </div>
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
    </div>
  );
};

export default InsumoForm;