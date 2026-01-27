import React from 'react';
import Pagination from 'components/Shared/Pagination';

const Table = ({ 
    columns, 
    data, 
    loading, 
    filters = [],
    onClearFilters, 
    pagination
}) => {
    return (
        <div className="w-full">

            {/* --- FILTROS --- */}
            {filters && filters.length > 0 && (
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6 relative z-20 overflow-visible">

                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {filters.map((filter) => (
                            <div key={filter.id} className="flex flex-col">
                                <label htmlFor={filter.id} className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                                    {filter.label}
                                </label>
                                
                                {/* Contenedor relativo para asegurar posicionamiento */}
                                <div className="relative w-full">
                                    {filter.component ? (
                                        // 1. Componente personalizado (Tu Buscador de Categorías)
                                        filter.component
                                    ) : filter.type === 'select' ? (
                                        // 2. Select Standard
                                        <select
                                            id={filter.id}
                                            value={filter.value}
                                            onChange={(e) => filter.onChange(e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-restaurant-primary/20 focus:border-restaurant-primary transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Todos</option>
                                            {filter.options.map((opt) => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        // 3. Input Texto Standard
                                        <input
                                            type={filter.type || 'text'}
                                            id={filter.id}
                                            value={filter.value}
                                            onChange={(e) => filter.onChange(e.target.value)}
                                            placeholder={filter.placeholder}
                                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-restaurant-primary/20 focus:border-restaurant-primary transition-all"
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
             
                        {onClearFilters && (
                            <div className="flex items-end pb-1">
                                <button 
                                    onClick={onClearFilters} 
                                    className="text-sm font-medium text-gray-400 hover:text-red-600 underline transition-colors h-10 flex items-center"
                                >
                                    Limpiar filtros
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}


            {/* --- CONTENIDO PRINCIPAL (TABLA) --- */}
            {/* z-0 para que quede debajo de los filtros al desplegar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative z-0">
                
                {/* 1. VISTA MÓVIL */}
                <div className="block md:hidden bg-gray-50 p-4 space-y-4">
                    {loading ? (
                        <div className="p-10 text-center text-gray-500">Cargando datos...</div>
                    ) : data && data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <div key={rowIndex} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-3">
                                {columns.map((col, colIndex) => (
                                    <div key={colIndex} className="flex justify-between items-start border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            {col.header}
                                        </span>
                                        <span className="text-sm text-gray-700 font-medium text-right ml-4">
                                            {col.render ? col.render(row) : row[col.accessor]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <div className="p-10 text-center text-gray-400 italic text-sm">
                            No se encontraron registros
                        </div>
                    )}
                </div>

                {/* 2. VISTA ESCRITORIO */}
                <div className="hidden md:block overflow-x-auto min-h-[300px]">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                {columns.map((col, idx) => (
                                    <th key={idx} className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        {col.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={columns.length} className="p-20 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <div className="w-8 h-8 border-4 border-gray-200 border-t-restaurant-primary rounded-full animate-spin"></div>
                                            <span className="text-sm font-medium text-gray-500">Cargando...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : data && data.length > 0 ? (
                                data.map((row, rowIndex) => (
                                    <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                                        {columns.map((col, colIndex) => (
                                            <td key={colIndex} className="p-4 text-sm text-gray-600 align-middle">
                                                {col.render ? col.render(row) : row[col.accessor]}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="p-10 text-center text-gray-400 italic text-sm">
                                        No se encontraron registros
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* --- PAGINACIÓN --- */}
                {pagination && pagination.totalPages > 0 && (
                    <div className="border-t border-gray-100 bg-white p-2">
                        <Pagination 
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={pagination.onPageChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Table;