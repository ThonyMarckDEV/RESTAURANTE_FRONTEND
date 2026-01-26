import React, { useState } from 'react';
import Pagination from '../Pagination';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Table = ({ 
    columns, 
    data, 
    loading = false, 
    pagination = null, 
    onSearch = null,
    searchPlaceholder = "Buscar..."
}) => {
    
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchSubmit = () => {
        if (onSearch) {
            onSearch(searchTerm);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        if (onSearch) {
            onSearch('');
        }
    };

    return (
        <div className="w-full">
            
            {/* --- BARRA DE BÚSQUEDA --- */}
            {onSearch && (
                <div className="mb-6 flex gap-2 items-center w-full md:max-w-md">
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-restaurant-primary focus:ring-1 focus:ring-restaurant-primary sm:text-sm transition duration-150 ease-in-out shadow-sm"
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                        />

                        {searchTerm && (
                            <button 
                                onClick={handleClear}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                    
                    <button
                        onClick={handleSearchSubmit}
                        disabled={loading}
                        className="px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium disabled:opacity-50 shadow-md"
                    >
                        Buscar
                    </button>
                </div>
            )}

            {/* --- CONTENEDOR PRINCIPAL (Maneja opacidad al cargar) --- */}
            <div className={`transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                
                {/* ======================================================= */}
                {/* VISTA MÓVIL: CARDS (Visible solo en pantallas pequeñas) */}
                {/* ======================================================= */}
                <div className="block md:hidden space-y-4">
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <div 
                                key={row.id || rowIndex} 
                                className="bg-white p-5 rounded-xl shadow-md border border-gray-100 flex flex-col gap-3 relative overflow-hidden"
                            >
                                {/* Decoración visual opcional a la izquierda */}
                                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-restaurant-primary"></div>

                                {columns.map((col, colIndex) => (
                                    <div key={colIndex} className="flex justify-between items-start border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-1">
                                            {col.header}
                                        </span>
                                        <div className="text-sm text-gray-800 font-medium text-right ml-4">
                                            {col.render 
                                                ? col.render(row) 
                                                : row[col.accessor]
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <div className="bg-white p-8 rounded-xl shadow text-center text-gray-500">
                            No se encontraron datos.
                        </div>
                    )}
                </div>

                {/* ======================================================= */}
                {/* VISTA DESKTOP: TABLA (Visible solo en md o superior)    */}
                {/* ======================================================= */}
                <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr className="bg-gray-50 text-left text-gray-600 uppercase text-xs tracking-wider border-b border-gray-200">
                                    {columns.map((col, index) => (
                                        <th key={index} className="px-6 py-4 font-bold">
                                            {col.header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.length > 0 ? (
                                    data.map((row, rowIndex) => (
                                        <tr key={row.id || rowIndex} className="hover:bg-gray-50 transition-colors">
                                            {columns.map((col, colIndex) => (
                                                <td key={`${rowIndex}-${colIndex}`} className="px-6 py-4 text-sm text-gray-700">
                                                    {col.render 
                                                        ? col.render(row) 
                                                        : row[col.accessor]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={columns.length} className="text-center py-10 text-gray-500">
                                            No se encontraron datos.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- PAGINACIÓN (Común para ambas vistas) --- */}
                {pagination && (
                    <div className="mt-6">
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