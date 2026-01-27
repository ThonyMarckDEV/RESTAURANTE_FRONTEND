import React from 'react';
import Pagination from '../Pagination';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Table = ({ 
    columns, 
    data, 
    loading = false, 
    pagination = null,
    filters = [], 
    onClearFilters = null 
}) => {
    
    const hasActiveFilters = filters.some(f => f.value !== '');

    return (
        <div className="w-full">
            {/* --- BARRA DE HERRAMIENTAS GENÉRICA --- */}
            {filters.length > 0 && (
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        {filters.map((filter) => (
                            <div key={filter.id} className={filter.type === 'text' ? 'md:col-span-1' : ''}>
                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1 tracking-wider">
                                    {filter.label}
                                </label>
                                
                                {filter.type === 'text' ? (
                                    <div className="relative">
                                        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <input 
                                            type="text"
                                            placeholder={filter.placeholder || "Buscar..."}
                                            value={filter.value}
                                            onChange={(e) => filter.onChange(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-restaurant-primary/20 outline-none transition-all"
                                        />
                                    </div>
                                ) : (
                                    <select 
                                        value={filter.value}
                                        onChange={(e) => filter.onChange(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-restaurant-primary/20 outline-none cursor-pointer"
                                    >
                                        <option value="">{filter.emptyLabel || "Todos"}</option>
                                        {filter.options.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        ))}

                        {/* Botón Limpiar */}
                        {hasActiveFilters && onClearFilters && (
                            <div className="flex justify-start">
                                <button 
                                    onClick={onClearFilters}
                                    className="flex items-center gap-1.5 text-sm text-red-600 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
                                >
                                    <XMarkIcon className="w-4 h-4" /> 
                                    Limpiar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className={`transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                {/* VISTA MÓVIL (CARDS) */}
                <div className="block md:hidden space-y-4">
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <div key={row.id || rowIndex} className="bg-white p-5 rounded-xl shadow-md border border-gray-100 flex flex-col gap-3 relative overflow-hidden">
                                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-restaurant-primary"></div>
                                {columns.map((col, colIndex) => (
                                    <div key={colIndex} className="flex justify-between items-start border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{col.header}</span>
                                        <div className="text-sm text-gray-800 font-medium text-right ml-4">
                                            {col.render ? col.render(row) : row[col.accessor]}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <div className="bg-white p-8 rounded-xl shadow text-center text-gray-500">No se encontraron datos.</div>
                    )}
                </div>

                {/* VISTA DESKTOP (TABLE) */}
                <div className="hidden md:block bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr className="bg-gray-50 text-left text-gray-500 uppercase text-[10px] font-black tracking-widest border-b border-gray-200">
                                    {columns.map((col, index) => (
                                        <th key={index} className="px-6 py-4">{col.header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.length > 0 ? (
                                    data.map((row, rowIndex) => (
                                        <tr key={row.id || rowIndex} className="hover:bg-gray-50/50 transition-colors">
                                            {columns.map((col, colIndex) => (
                                                <td key={`${rowIndex}-${colIndex}`} className="px-6 py-4 text-sm text-gray-700">
                                                    {col.render ? col.render(row) : row[col.accessor]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={columns.length} className="text-center py-10 text-gray-500 italic">No hay registros para mostrar.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {pagination && data.length > 0 && (
                    <div className="mt-6">
                        <Pagination {...pagination} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Table;