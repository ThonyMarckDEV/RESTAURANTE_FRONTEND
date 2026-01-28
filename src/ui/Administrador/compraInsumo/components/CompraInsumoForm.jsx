import React, { useState, useMemo } from 'react';
import ProveedorSearchSelect from 'components/Shared/Comboboxes/ProveedorSearchSelect';
import AlmacenSearchSelect from 'components/Shared/Comboboxes/AlmacenSearchSelect';
import InsumoSearchSelect from 'components/Shared/Comboboxes/InsumoSearchSelect'
import { ShoppingCartIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { isNumeric } from 'utilities/Validations/validations';

const CompraInsumoForm = ({ formData, setFormData, isViewOnly = false }) => {
    
    // --- ESTADOS LOCALES PARA LA LÍNEA QUE SE ESTÁ AGREGANDO ---
    const [lineItem, setLineItem] = useState({
        insumo: null, // Objeto {id, nombre}
        cantidad: '',
        precio: ''
    });

    const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-restaurant-secondary focus:border-restaurant-secondary outline-none text-sm transition-all";
    const labelClass = "block text-xs font-bold text-gray-600 mb-1";

    // --- MANEJADORES DE CABECERA ---
    const handleHeaderChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // --- MANEJADORES DE LÍNEA DE DETALLE ---
    const handleLineChange = (e) => {
        const { name, value } = e.target;
        // Validación numérica estricta para cantidad y precio
        if (name === 'cantidad') {
            // Cantidad solo permite enteros positivos
            if (value === '' || /^\d*$/.test(value)) {
                setLineItem(prev => ({ ...prev, [name]: value }));
            }
        } else if (name === 'precio') {
            // Precio permite decimales (punto o coma)
            if (value === '' || /^\d*([.,]\d{0,2})?$/.test(value)) {
                setLineItem(prev => ({ ...prev, [name]: value }));
            }
        } else {
            setLineItem(prev => ({ ...prev, [name]: value }));
        }
    };

    const addLineItem = () => {
        if (!lineItem.insumo || !lineItem.cantidad || !lineItem.precio) return;

        const precioNormalizado = lineItem.precio.replace(',', '.');

        const newItem = {
            insumo_id: lineItem.insumo.id,
            nombre_insumo: lineItem.insumo.nombre,
            cantidad: parseInt(lineItem.cantidad),
            precio: parseFloat(precioNormalizado),
            subtotal: parseInt(lineItem.cantidad) * parseFloat(lineItem.precio)
        };

        // Agregar a la lista de detalles del padre
        setFormData(prev => ({
            ...prev,
            detalles: [...prev.detalles, newItem]
        }));

        // Limpiar inputs de línea
        setLineItem({ insumo: null, cantidad: '', precio: '' });
    };

    const removeLineItem = (index) => {
        setFormData(prev => ({
            ...prev,
            detalles: prev.detalles.filter((_, i) => i !== index)
        }));
    };

    // --- CÁLCULO DE TOTAL AUTOMÁTICO ---
    const totalCalculado = useMemo(() => {
        return formData.detalles.reduce((acc, item) => acc + item.subtotal, 0);
    }, [formData.detalles]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-restaurant-primary h-fit">
            
            {/* --- ENCABEZADO --- */}
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-3">
                <div className="p-2 bg-restaurant-surface rounded-full">
                    <ShoppingCartIcon className="w-6 h-6 text-restaurant-secondary" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">
                    {isViewOnly ? 'Detalle de Compra' : 'Registrar Nueva Compra'}
                </h2>
            </div>

            {/* --- SECCIÓN 1: DATOS GENERALES (CABECERA) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className={labelClass}>Proveedor <span className="text-red-500">*</span></label>
                    {isViewOnly ? (
                        <div className="p-2 bg-gray-100 rounded text-sm">{formData.proveedorNombre}</div>
                    ) : (
                        <ProveedorSearchSelect 
                            initialValue={formData.proveedorObj}
                            onSelect={(prov) => handleHeaderChange('proveedorObj', prov)}
                        />
                    )}
                </div>
                <div>
                    <label className={labelClass}>Almacén Destino <span className="text-red-500">*</span></label>
                    {isViewOnly ? (
                        <div className="p-2 bg-gray-100 rounded text-sm">{formData.almacenNombre}</div>
                    ) : (
                        <AlmacenSearchSelect 
                            tipos={[1, 2]} // 1=Seco, 2=Congelado (Típicos para insumos)
                            initialValue={formData.almacenObj}
                            onSelect={(alm) => handleHeaderChange('almacenObj', alm)}
                        />
                    )}
                    {!isViewOnly && <p className="text-[10px] text-gray-400 mt-1">El stock se sumará a este almacén.</p>}
                </div>
            </div>

            {/* --- SECCIÓN 2: AGREGAR ITEMS (Solo si no es vista de lectura) --- */}
            {!isViewOnly && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                    <h3 className="text-sm font-bold text-restaurant-secondary mb-3 uppercase tracking-wide">Agregar Insumos</h3>
                    <div className="grid grid-cols-12 gap-3 items-end">
                        <div className="col-span-12 md:col-span-5">
                            <label className={labelClass}>Insumo</label>
                            <InsumoSearchSelect 
                                initialValue={lineItem.insumo}
                                onSelect={(ins) => setLineItem(prev => ({ ...prev, insumo: ins }))}
                            />
                        </div>
                        <div className="col-span-6 md:col-span-2">
                            <label className={labelClass}>Cantidad</label>
                            <input 
                                name="cantidad"
                                value={lineItem.cantidad}
                                onChange={handleLineChange}
                                className={inputClass}
                                placeholder="0"
                            />
                        </div>
                        <div className="col-span-6 md:col-span-3">
                            <label className={labelClass}>Costo Unit.</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-400 text-xs">S/</span>
                                <input 
                                    name="precio"
                                    value={lineItem.precio}
                                    onChange={handleLineChange}
                                    className={`${inputClass} pl-8`}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <div className="col-span-12 md:col-span-2">
                            <button 
                                type="button"
                                onClick={addLineItem}
                                disabled={!lineItem.insumo || !lineItem.cantidad || !lineItem.precio}
                                className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex justify-center items-center gap-1"
                            >
                                <PlusIcon className="w-4 h-4" /> Agregar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- SECCIÓN 3: TABLA DE DETALLES --- */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            <th className="px-4 py-3">Insumo</th>
                            <th className="px-4 py-3 text-center">Cant.</th>
                            <th className="px-4 py-3 text-right">Precio Unit.</th>
                            <th className="px-4 py-3 text-right">Subtotal</th>
                            {!isViewOnly && <th className="px-4 py-3 text-center">Acción</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {formData.detalles.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-400 italic">
                                    No hay insumos agregados a la compra.
                                </td>
                            </tr>
                        ) : (
                            formData.detalles.map((item, index) => (
                                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{item.nombre_insumo}</td>
                                    <td className="px-4 py-3 text-center">{item.cantidad}</td>
                                    <td className="px-4 py-3 text-right">S/ {parseFloat(item.precio).toFixed(2)}</td>
                                    <td className="px-4 py-3 text-right font-bold text-gray-800">S/ {item.subtotal.toFixed(2)}</td>
                                    {!isViewOnly && (
                                        <td className="px-4 py-3 text-center">
                                            <button 
                                                type="button"
                                                onClick={() => removeLineItem(index)}
                                                className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded hover:bg-red-100 transition-colors"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                    {/* FOOTER DE TOTALES */}
                    <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                        <tr>
                            <td colSpan={3} className="px-4 py-3 text-right font-bold text-gray-600 uppercase">Total a Pagar:</td>
                            <td className="px-4 py-3 text-right font-black text-lg text-restaurant-primary">
                                S/ {totalCalculado.toFixed(2)}
                            </td>
                            {!isViewOnly && <td></td>}
                        </tr>
                    </tfoot>
                </table>
            </div>

        </div>
    );
};

export default CompraInsumoForm;