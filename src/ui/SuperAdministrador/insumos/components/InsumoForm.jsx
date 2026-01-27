import React, { useState, useEffect } from 'react';
import CategoriaSearchSelect from 'components/Shared/Comboboxes/CategoriaSearchSelect';
import { CubeIcon, TagIcon } from '@heroicons/react/24/outline';

const InsumoForm = ({ formData, onChange }) => {
    
    const [selectedCategoryObj, setSelectedCategoryObj] = useState(null);

    useEffect(() => {
        if (formData.categoriaId && !selectedCategoryObj) {
            setSelectedCategoryObj({ 
                id: formData.categoriaId, 
                nombre: formData.categoriaNombre
            });
        }
    }, [formData.categoriaId, formData.categoriaNombre , selectedCategoryObj ]);

    const unidades = [
        { value: 'KG', label: 'KILOGRAMOS (KG)' },
        { value: 'LT', label: 'LITROS (L)' },
        { value: 'UNIDAD', label: 'UNIDAD (UND)' },
        { value: 'LATA', label: 'LATA' },
        { value: 'PAQUETE', label: 'PAQUETE' },
        { value: 'GR', label: 'GRAMOS (GR)' },
        { value: 'ML', label: 'MILILITROS (ML)' }
    ];

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-restaurant-primary h-fit mx-auto max-w-xl">
            
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-3">
                <div className="p-2 bg-restaurant-surface rounded-full">
                    <CubeIcon className="w-6 h-6 text-restaurant-secondary" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Datos del Insumo</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Categoría  */}
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                        Categoría <span className="text-red-500">*</span>
                    </label>
                    
                    <CategoriaSearchSelect 
                        categoryTypes={[1]} // 1 = INSUMOS
                        initialValue={selectedCategoryObj}
                        onSelect={(cat) => {
                            setSelectedCategoryObj(cat);
                            onChange({ 
                                target: { 
                                    name: 'categoriaId', 
                                    value: cat ? cat.id : '' 
                                } 
                            });
                        }}
                    />
                    
                    <p className="text-[10px] text-gray-400 mt-1 ml-1">
                        Busca la categoría a la que pertenece este insumo.
                    </p>
                </div>

                {/* 2. Nombre */}
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                        Nombre del Insumo <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={onChange}
                        placeholder="Ej: Papa Amarilla, Aceite Vegetal..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-restaurant-primary focus:border-transparent outline-none transition-all bg-white"
                        required
                    />
                </div>

                {/* 3. Código Interno */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Código Interno / SKU</label>
                    <div className="relative">
                        <TagIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            name="codigoInterno"
                            value={formData.codigoInterno}
                            onChange={onChange}
                            placeholder="Ej: INS-001"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-restaurant-primary focus:border-transparent outline-none transition-all bg-white"
                        />
                    </div>
                </div>

                {/* 4. Unidad de Medida */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                        Unidad de Medida <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="unidadMedida"
                        value={formData.unidadMedida}
                        onChange={onChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-restaurant-primary focus:border-transparent outline-none transition-all bg-white"
                        required
                    >
                        {unidades.map((u) => (
                            <option key={u.value} value={u.value}>
                                {u.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 5. Precio Compra Promedio */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Precio Ref. Compra</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500 text-sm font-bold">S/.</span>
                        <input
                            type="number"
                            name="precioCompraPromedio"
                            value={formData.precioCompraPromedio}
                            onChange={onChange}
                            step="0.01"
                            min="0"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-restaurant-primary focus:border-transparent outline-none transition-all bg-white"
                        />
                    </div>
                </div>

                {/* 6. Stock Mínimo */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                        Stock Mínimo Alerta <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="stockMinimo"
                        value={formData.stockMinimo}
                        onChange={onChange}
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-restaurant-primary focus:border-transparent outline-none transition-all bg-white"
                        required
                    />
                </div>

                {/* 7. Estado */}
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Estado Inicial</label>
                    <select
                        name="estado"
                        value={formData.estado}
                        onChange={onChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-restaurant-primary focus:border-transparent outline-none transition-all bg-white"
                    >
                        <option value={1}>Activo / Disponible</option>
                        <option value={0}>Inactivo / No Disponible</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default InsumoForm;