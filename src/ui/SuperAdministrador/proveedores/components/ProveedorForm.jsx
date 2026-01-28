import React from 'react';
import { UserIcon, IdentificationIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { isNumeric } from 'utilities/Validations/validations';

const ProveedorForm = ({ formData, onChange }) => {
  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-restaurant-secondary focus:border-restaurant-secondary outline-none text-sm transition-all";
  const labelClass = "block text-xs font-bold text-gray-600 mb-1";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if ((name === 'ruc' || name === 'telefono') && !isNumeric(value)) {
        return; 
    }
    onChange(e);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-restaurant-primary h-fit max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-3">
        <div className="p-2 bg-restaurant-surface rounded-full">
          <UserIcon className="w-6 h-6 text-restaurant-secondary" />
        </div>
        <h2 className="text-lg font-bold text-gray-800">Datos del Proveedor</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Razón Social */}
        <div className="md:col-span-2">
          <label className={labelClass}>Razón Social</label>
          <input 
            name="razon_social" 
            value={formData.razon_social} 
            onChange={onChange} 
            className={inputClass} 
            placeholder="Nombre de la empresa"
            required 
          />
        </div>

        {/* RUC */}
        <div>
          <label className={labelClass}>
            RUC <span className="text-xs font-normal text-gray-400">(11 dígitos)</span>
          </label>
          <div className="relative">
            <IdentificationIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              name="ruc" 
              value={formData.ruc} 
              onChange={handleInputChange} 
              className={`${inputClass} pl-10`} 
              maxLength={11} 
              minLength={11} 
              placeholder="10XXXXXXXXX"
              inputMode="numeric" 
              required 
            />
          </div>
          {formData.ruc && formData.ruc.length !== 11 && (
            <p className="text-[10px] text-red-500 mt-1">* Debe tener 11 dígitos</p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label className={labelClass}>
            Teléfono / Celular <span className="text-xs font-normal text-gray-400">(9 dígitos)</span>
          </label>
          <div className="relative">
            <PhoneIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              name="telefono" 
              value={formData.telefono} 
              onChange={handleInputChange} 
              className={`${inputClass} pl-10`} 
              maxLength={9}  
              minLength={9}  
              placeholder="999888777"
              inputMode="numeric" 
              required 
            />
          </div>
          {formData.telefono && formData.telefono.length !== 9 && (
            <p className="text-[10px] text-red-500 mt-1">* Debe tener 9 dígitos</p>
          )}
        </div>

        {/* Estado */}
        <div className="md:col-span-2">
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

export default ProveedorForm;