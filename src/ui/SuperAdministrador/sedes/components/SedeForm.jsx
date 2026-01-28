import React from 'react';
import { BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { isNumeric } from 'utilities/Validations/validations';

const SedeForm = ({ formData = {}, onChange }) => {
    
    const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-restaurant-secondary focus:border-restaurant-secondary outline-none text-sm transition-all";
    const labelClass = "block text-xs font-bold text-gray-600 mb-1";

    const handleNumberChange = (e) => {
        if (isNumeric(e.target.value)) {
            onChange(e);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-restaurant-secondary h-fit">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-3">
                <div className="p-2 bg-restaurant-surface rounded-full">
                    <BuildingOffice2Icon className="w-6 h-6 text-restaurant-primary" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">1. Datos del Local</h2>
            </div>

            <div className="space-y-5">
                <div>
                    <label className={labelClass}>Nombre de Sede</label>
                    <input 
                        name="nombre" 
                        value={formData?.nombre || ''} 
                        onChange={onChange} 
                        className={inputClass} 
                        placeholder="Ej. Sede Central Sullana"
                        required 
                    />
                </div>
                <div>
                    <label className={labelClass}>Dirección</label>
                    <input 
                        name="direccion" 
                        value={formData?.direccion || ''} 
                        onChange={onChange} 
                        className={inputClass} 
                        placeholder="Ej. Calle Transversal Tarapacá 456"
                    />
                </div>
                <div>
                    <label className={labelClass}>Código SUNAT (Solo números)</label>
                    <input 
                        name="codigo_sunat" 
                        value={formData?.codigo_sunat || ''} 
                        onChange={handleNumberChange}
                        className={inputClass} 
                        maxLength={4} 
                        placeholder="Ej. 0001"
                        inputMode="numeric" 
                    />
                </div>
            </div>
        </div>
    );
};

export default SedeForm;