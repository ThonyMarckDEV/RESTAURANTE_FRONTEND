import React, { useState, useEffect, useRef } from 'react';
import { getProveedores } from 'services/proveedorService';
import { UserGroupIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ProveedorSearchSelect = ({ onSelect, initialValue }) => {

    const [inputValue, setInputValue] = useState(initialValue?.nombre || '');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);

    const lastIdRef = useRef(initialValue?.id);
    const wrapperRef = useRef(null);

    useEffect(() => {
        if (!initialValue) {
            setInputValue('');
            lastIdRef.current = null;
            return;
        }

        const newId = initialValue.id || initialValue;
        const newName = initialValue.nombre;

        if (newId !== lastIdRef.current) {
            if (newName) {
                setInputValue(newName);
            }
            lastIdRef.current = newId;
        }
    }, [initialValue]);

    const fetchProveedores = async (searchTerm = '') => {
        setLoading(true);
        try {
            const response = await getProveedores(1, searchTerm, 1);
            
            const data = response.data.content || response.data || [];

            setSuggestions(data);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Error buscando proveedores", error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    // Click Outside para cerrar el dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (prov) => {
        const nombreMostrar = prov.razon_social;
        
        setInputValue(nombreMostrar);
        lastIdRef.current = prov.id;
        
        onSelect({ id: prov.id, nombre: nombreMostrar }); 
        setShowSuggestions(false);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setInputValue('');
        lastIdRef.current = null;
        onSelect(null);
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="relative group">
                {/* Icono de Proveedor */}
                <UserGroupIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-restaurant-primary transition-colors" />
                
                <input
                    type="text"
                    value={inputValue}
                    placeholder={loading ? "Cargando..." : "Buscar Proveedor..."}
                    onFocus={() => {
                        fetchProveedores(inputValue);
                    }}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        fetchProveedores(e.target.value);
                    }}
                    className="w-full pl-9 pr-10 py-2 bg-white border border-gray-300 rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-restaurant-primary/20 focus:border-restaurant-primary"
                />
                
                <div className="absolute right-3 top-2.5 cursor-pointer">
                    {inputValue ? (
                        <XMarkIcon className="w-4 h-4 text-gray-400 hover:text-red-500" onClick={handleClear} />
                    ) : (
                        !loading && <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                    )}
                    {loading && <div className="w-4 h-4 border-2 border-gray-300 border-t-restaurant-primary rounded-full animate-spin" />}
                </div>
            </div>

            {showSuggestions && (
                <ul className="absolute z-[50] w-full bg-white border border-gray-100 rounded-lg mt-1 shadow-xl max-h-60 overflow-auto">
                    {suggestions.length > 0 ? (
                        suggestions.map(prov => (
                            <li 
                                key={prov.id} 
                                onClick={() => handleSelect(prov)} 
                                className="px-4 py-2 hover:bg-orange-50 hover:text-orange-700 cursor-pointer text-sm border-b border-gray-50 last:border-none flex justify-between items-center"
                            >
                                {/* Ajusta estos campos según tu DTO de Proveedor */}
                                <span>{prov.razon_social}</span>
                                {prov.ruc && <span className="text-xs text-gray-400 bg-gray-100 px-2 rounded">{prov.ruc}</span>}
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-3 text-gray-400 text-xs italic text-center">No se encontraron proveedores</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default ProveedorSearchSelect;