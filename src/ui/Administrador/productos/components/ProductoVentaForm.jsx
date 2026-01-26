import React from 'react';
import { ShoppingBagIcon, TagIcon, CurrencyDollarIcon, StarIcon, CalculatorIcon } from '@heroicons/react/24/outline';

const ProductoVentaForm = ({ formData, onChange, categorias = [] }) => {
  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-restaurant-secondary focus:border-restaurant-secondary outline-none text-sm transition-all";
  const labelClass = "block text-xs font-bold text-gray-600 mb-1";

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-restaurant-primary h-fit max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-3">
        <div className="p-2 bg-restaurant-surface rounded-full">
          <ShoppingBagIcon className="w-6 h-6 text-restaurant-secondary" />
        </div>
        <h2 className="text-lg font-bold text-gray-800">Datos del Producto</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Columna Izquierda */}
        <div className="space-y-4">
            {/* Categoría */}
            <div>
               <label className={labelClass}>Categoría (Tipo Producto)</label>
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
              <label className={labelClass}>Nombre del Producto</label>
              <input 
                name="nombre" 
                value={formData.nombre} 
                onChange={onChange} 
                className={inputClass} 
                placeholder="Ej: Coca Cola 500ml, Galleta Soda"
                required 
              />
            </div>

            {/* Marca */}
            <div>
              <label className={labelClass}>Marca (Opcional)</label>
              <div className="relative">
                <StarIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input 
                    name="marca" 
                    value={formData.marca || ''} 
                    onChange={onChange} 
                    className={`${inputClass} pl-10`} 
                    placeholder="Ej: Coca Cola, San Jorge, Pilsen"
                />
              </div>
            </div>
        </div>

        {/* Columna Derecha */}
        <div className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
                {/* Precio Compra */}
                <div>
                    <label className={labelClass}>Precio Compra (Costo)</label>
                    <div className="relative">
                        <CurrencyDollarIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input 
                            type="number"
                            step="0.01"
                            name="precioCompra" 
                            value={formData.precioCompra} 
                            onChange={onChange} 
                            className={`${inputClass} pl-10`}
                            placeholder="0.00"
                        />
                    </div>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Stock Mínimo */}
                <div>
                    <label className={labelClass}>Stock Mínimo (Alerta)</label>
                    <div className="relative">
                        <CalculatorIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input 
                            type="number"
                            step="1"
                            name="stockMinimo" 
                            value={formData.stockMinimo} 
                            onChange={onChange} 
                            className={`${inputClass} pl-10`}
                            placeholder="10"
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
    </div>
  );
};

export default ProductoVentaForm;