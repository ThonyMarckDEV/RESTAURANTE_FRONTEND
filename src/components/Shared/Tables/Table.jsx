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
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        {filters.map((filter) => (
                            <div key={filter.id} className="flex flex-col gap-1 w-full">
                                <label className="text-xs font-bold text-gray-600 ml-1">
                                    {filter.label}
                                </label>
                                {filter.type === 'text' && (
                                    <input
                                        type="text"
                                        value={filter.value}
                                        onChange={(e) => filter.onChange(e.target.value)}
                                        placeholder={filter.placeholder}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-black/5 transition-all"
                                    />
                                )}
                                {filter.type === 'select' && (
                                    <select
                                        value={filter.value}
                                        onChange={(e) => filter.onChange(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-black/5 transition-all"
                                    >
                                        <option value="">{filter.emptyLabel || 'Todos'}</option>
                                        {filter.options?.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                )}
                                {filter.type === 'custom' && (<div className="w-full">{filter.render}</div>)}
                            </div>
                        ))}
                        {onClearFilters && (
                            <div className="flex pb-2">
                                <button onClick={onClearFilters} className="text-sm font-medium text-gray-500 hover:text-red-600 underline transition-colors">
                                    Limpiar filtros
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- CONTENIDO PRINCIPAL --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                
                {/* 1. VISTA MÓVIL (CARDS INDEPENDIENTES) - Visible solo en pantallas chicas (md:hidden) */}
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

                {/* 2. VISTA ESCRITORIO (TABLA CLÁSICA) - Oculta en pantallas chicas (hidden md:block) */}
                <div className="hidden md:block overflow-x-auto">
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
                                    <td colSpan={columns.length} className="p-10 text-center">
                                        <span className="text-sm font-medium text-gray-500">Cargando datos...</span>
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
                    <div className="border-t border-gray-100 bg-white">
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