import React, { useState, useMemo } from 'react';
import ProveedorSearchSelect from 'components/Shared/Comboboxes/ProveedorSearchSelect';
import AlmacenSearchSelect from 'components/Shared/Comboboxes/AlmacenSearchSelect';
import InsumoSearchSelect from 'components/Shared/Comboboxes/InsumoSearchSelect';
import { ShoppingCartIcon, PlusIcon, TrashIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { isNumeric, isDecimalMoney } from 'utilities/Validations/validations'; 

const CompraInsumoForm = ({ formData, setFormData, isViewOnly = false, isAlmacenLocked = false }) => {
    
    const [lineItem, setLineItem] = useState({
        insumo: null, 
        cantidad: '',
        precio: ''
    });

    const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-restaurant-secondary focus:border-restaurant-secondary outline-none text-sm transition-all";
    const labelClass = "block text-xs font-bold text-gray-600 mb-1";

    const isDuplicate = useMemo(() => {
        if (!lineItem.insumo) return false;
        return formData.detalles.some(d => d.insumo_id === lineItem.insumo.id);
    }, [lineItem.insumo, formData.detalles]);

    const selectedInsumoIds = useMemo(() => {
        return formData.detalles.map(d => d.insumo_id);
    }, [formData.detalles]);

    const handleHeaderChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // --- REFACTORIZADO CON VALIDACIONES CENTRALIZADAS ---
    const handleLineChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'cantidad') {
            if (isNumeric(value)) { // Usando helper
                setLineItem(prev => ({ ...prev, [name]: value }));
            }
        } else if (name === 'precio') {
            if (isDecimalMoney(value)) { // Usando helper
                setLineItem(prev => ({ ...prev, [name]: value }));
            }
        } else {
            setLineItem(prev => ({ ...prev, [name]: value }));
        }
    };

    const addLineItem = () => {
        if (!lineItem.insumo || !lineItem.cantidad || !lineItem.precio) return;
        if (isDuplicate) return;

        const precioNormalizado = lineItem.precio.replace(',', '.');

        const newItem = {
            insumo_id: lineItem.insumo.id,
            nombre_insumo: lineItem.insumo.nombre,
            unidad_medida: lineItem.insumo.unidad, 
            cantidad: parseInt(lineItem.cantidad),
            precio: parseFloat(precioNormalizado),
            subtotal: parseInt(lineItem.cantidad) * parseFloat(precioNormalizado)
        };

        setFormData(prev => ({
            ...prev,
            detalles: [...prev.detalles, newItem]
        }));

        setLineItem({ insumo: null, cantidad: '', precio: '' });
    };

    const removeLineItem = (index) => {
        setFormData(prev => ({
            ...prev,
            detalles: prev.detalles.filter((_, i) => i !== index)
        }));
    };

    const totalCalculado = useMemo(() => {
        return formData.detalles.reduce((acc, item) => acc + item.subtotal, 0);
    }, [formData.detalles]);

    // --- REFACTORIZADO CON VALIDACIONES CENTRALIZADAS ---
    const handleRowChange = (index, field, value) => {
        // Validamos antes de actualizar
        if (field === 'cantidad' && !isNumeric(value)) return;
        if (field === 'precio' && !isDecimalMoney(value)) return;

        const newDetalles = [...formData.detalles];
        newDetalles[index][field] = value;

        // Cálculos
        const cant = parseInt(newDetalles[index].cantidad) || 0;
        const precioStr = String(newDetalles[index].precio).replace(',', '.');
        const precio = parseFloat(precioStr) || 0;

        newDetalles[index].subtotal = cant * precio;

        setFormData(prev => ({ ...prev, detalles: newDetalles }));
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-restaurant-primary h-fit">
            
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-3">
                <div className="p-2 bg-restaurant-surface rounded-full">
                    <ShoppingCartIcon className="w-6 h-6 text-restaurant-secondary" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">
                    {isViewOnly ? 'Detalle de Compra' : 'Registrar Nueva Compra'}
                </h2>
            </div>

            {/* Datos Generales */}
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
                    {isViewOnly || isAlmacenLocked ? (
                        <div className={`p-2 rounded text-sm border ${isAlmacenLocked ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-gray-100 border-gray-200'}`}>
                            {formData.almacenObj?.nombre || 'Cargando...'}
                            {isAlmacenLocked && <span className="ml-2 text-[10px] font-bold">(No editable)</span>}
                        </div>
                    ) : (
                        <AlmacenSearchSelect 
                            tipos={[1, 2]}
                            initialValue={formData.almacenObj}
                            onSelect={(alm) => handleHeaderChange('almacenObj', alm)}
                        />
                    )}
                    {!isViewOnly && !isAlmacenLocked && <p className="text-[10px] text-gray-400 mt-1">El stock se sumará a este almacén.</p>}
                </div>
            </div>

            {/* Agregar Insumos */}
            {!isViewOnly && (
                <div className={`p-4 rounded-lg border mb-6 transition-colors ${isDuplicate ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                    
                    <div className="flex justify-between items-center mb-3">
                        <h3 className={`text-sm font-bold uppercase tracking-wide ${isDuplicate ? 'text-red-600' : 'text-restaurant-secondary'}`}>
                            {isDuplicate ? 'Este insumo ya está en lista' : 'Agregar Insumos'}
                        </h3>
                        {isDuplicate && <span className="text-xs text-red-500 font-medium">Edite la cantidad en la tabla inferior</span>}
                    </div>

                    <div className="grid grid-cols-12 gap-3 items-end">
                        <div className="col-span-12 md:col-span-5">
                            <div className="flex justify-between items-end mb-1">
                                <label className={labelClass}>Insumo</label>
                                {lineItem.insumo?.unidad && (
                                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wider">
                                        {lineItem.insumo.unidad}
                                    </span>
                                )}
                            </div>
                            
                            <InsumoSearchSelect 
                                initialValue={lineItem.insumo}
                                excludedIds={selectedInsumoIds} 
                                onSelect={(ins) => setLineItem(prev => ({ 
                                    ...prev, 
                                    insumo: ins,
                                    precio: ins?.precio || prev.precio
                                }))}
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
                                disabled={isDuplicate} 
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
                                    disabled={isDuplicate} 
                                />
                            </div>
                        </div>
                        <div className="col-span-12 md:col-span-2">
                            <button 
                                type="button"
                                onClick={addLineItem}
                                disabled={!lineItem.insumo || !lineItem.cantidad || !lineItem.precio || isDuplicate}
                                className={`w-full py-2 rounded-md transition-colors flex justify-center items-center gap-1 text-white
                                    ${isDuplicate 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed'
                                    }`}
                            >
                                {isDuplicate ? (
                                    <> <ExclamationCircleIcon className="w-4 h-4"/> Ya en lista </>
                                ) : (
                                    <> <PlusIcon className="w-4 h-4" /> Agregar </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabla de Detalles */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            <th className="px-4 py-3">Insumo</th>
                            <th className="px-4 py-3 text-center w-24">Cant.</th>
                            <th className="px-4 py-3 text-right w-32">Precio Unit.</th>
                            <th className="px-4 py-3 text-right w-32">Subtotal</th>
                            {!isViewOnly && <th className="px-4 py-3 text-center w-16">Acción</th>}
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
                                    <td className="px-4 py-3 font-medium text-gray-900 align-middle">
                                        <div className="flex items-center gap-2">
                                            <span>{item.nombre_insumo}</span>
                                            {item.unidad_medida && (
                                                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 uppercase tracking-wide">
                                                    {item.unidad_medida}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    
                                    <td className="px-4 py-3 text-center align-middle">
                                        {isViewOnly ? item.cantidad : (
                                            <input 
                                                value={item.cantidad}
                                                onChange={(e) => handleRowChange(index, 'cantidad', e.target.value)}
                                                className="w-full text-center border border-gray-300 rounded px-1 py-1 focus:ring-1 focus:ring-emerald-500 outline-none"
                                            />
                                        )}
                                    </td>

                                    <td className="px-4 py-3 text-right align-middle">
                                        {isViewOnly ? `S/ ${parseFloat(item.precio).toFixed(2)}` : (
                                            <div className="relative">
                                                <span className="absolute left-2 top-1 text-gray-400 text-xs">S/</span>
                                                <input 
                                                    value={item.precio}
                                                    onChange={(e) => handleRowChange(index, 'precio', e.target.value)}
                                                    className="w-full text-right border border-gray-300 rounded pl-6 pr-2 py-1 focus:ring-1 focus:ring-emerald-500 outline-none"
                                                />
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-4 py-3 text-right font-bold text-gray-800 align-middle">
                                        S/ {item.subtotal.toFixed(2)}
                                    </td>

                                    {!isViewOnly && (
                                        <td className="px-4 py-3 text-center align-middle">
                                            <button 
                                                type="button"
                                                onClick={() => removeLineItem(index)}
                                                className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded transition-colors"
                                                title="Eliminar fila"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
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