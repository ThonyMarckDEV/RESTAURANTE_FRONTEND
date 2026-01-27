import React from 'react';
import CategoryComboBox from 'components/Shared/Comboboxes/CategoriaSearchSelect';

const InsumoForm = ({ formData, onChange, tipoCategoria }) => {
    
    const unidades = [
        { value: 'KG', label: 'KILOGRAMOS (KG)' },
        { value: 'LT', label: 'LITROS (L)' },
        { value: 'UNIDAD', label: 'UNIDAD (UND)' },
        { value: 'LATA', label: 'LATA' },
        { value: 'PAQUETE', label: 'PAQUETE' }
    ];

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-l-4 border-restaurant-primary pl-3">
                Información del Insumo
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Categoría */}
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Categoría <span className="text-red-500">*</span>
                    </label>
                    <CategoryComboBox
                        value={formData.categoriaId}
                        onSelect={(newId) => onChange({ target: { name: 'categoriaId', value: newId } })}
                        
                        tipoCategoria={tipoCategoria}
                        placeholder="Buscar y seleccionar categoría..."
                        error={!formData.categoriaId}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Escriba para buscar entre las categorías de insumos disponibles.
                    </p>
                </div>

                {/* 2. Nombre */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Nombre del Insumo <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={onChange}
                        placeholder="Ej: Papa Amarilla, Aceite Vegetal..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-restaurant-primary focus:border-transparent transition-all outline-none"
                        required
                    />
                </div>

                {/* 3. Código Interno */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Código Interno / SKU
                    </label>
                    <input
                        type="text"
                        name="codigoInterno"
                        value={formData.codigoInterno}
                        onChange={onChange}
                        placeholder="Ej: INS-001"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-restaurant-primary focus:border-transparent transition-all outline-none"
                    />
                </div>

                {/* 4. Unidad de Medida */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Unidad de Medida <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="unidadMedida"
                        value={formData.unidadMedida}
                        onChange={onChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-restaurant-primary focus:border-transparent bg-white"
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
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Precio Compra Referencial (S/.)
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">S/.</span>
                        <input
                            type="number"
                            name="precioCompraPromedio"
                            value={formData.precioCompraPromedio}
                            onChange={onChange}
                            step="0.01"
                            min="0"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-restaurant-primary focus:border-transparent outline-none"
                        />
                    </div>
                </div>

                {/* 6. Stock Mínimo */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Stock Mínimo Alerta <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="stockMinimo"
                        value={formData.stockMinimo}
                        onChange={onChange}
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-restaurant-primary focus:border-transparent outline-none"
                        required
                    />
                </div>

                {/* 7. Estado */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Estado
                    </label>
                    <select
                        name="estado"
                        value={formData.estado}
                        onChange={onChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-restaurant-primary focus:border-transparent bg-white"
                    >
                        <option value={1}>Activo</option>
                        <option value={0}>Inactivo</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default InsumoForm;