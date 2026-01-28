import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getAlmacenes } from 'services/almacenService';
import { BuildingStorefrontIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';

/**
 * @param {function} onSelect - Callback cuando se elige un almacén
 * @param {object} initialValue - Valor inicial {id, nombre}
 * @param {number|number[]} tipos - (Opcional) Filtrar por tipo de almacén (1: Seco, 2: Congelado, etc.)
 */
const AlmacenSearchSelect = ({ onSelect, initialValue, tipos }) => {

    const [inputValue, setInputValue] = useState(initialValue?.nombre || '');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);

    const lastIdRef = useRef(initialValue?.id);
    const wrapperRef = useRef(null);

    // Mapeo de tipos para mostrar etiquetas visuales (Opcional pero útil)
    const TIPO_LABELS = {
        1: { label: 'SECO', color: 'bg-amber-100 text-amber-700' },
        2: { label: 'FRÍO', color: 'bg-sky-100 text-sky-700' },
    };

    // Memorizamos los tipos permitidos para evitar re-renderizados innecesarios
    const allowedTypes = useMemo(() => {
        if (tipos === undefined || tipos === null) return null;
        return Array.isArray(tipos) ? tipos : [tipos];
    }, [tipos]);

    useEffect(() => {
        if (!initialValue) {
            setInputValue('');
            lastIdRef.current = null;
            return;
        }
        const newId = initialValue.id || initialValue;
        const newName = initialValue.nombre;

        if (newId !== lastIdRef.current) {
            if (newName) setInputValue(newName);
            lastIdRef.current = newId;
        }
    }, [initialValue]);

    const fetchAlmacenes = async (searchTerm = '') => {
        setLoading(true);
        try {
            const tipoBackend = (allowedTypes && allowedTypes.length === 1) ? allowedTypes[0] : '';
            
            // Llamamos al servicio: page 1, search, estado '1' (activos), tipo específico
            const response = await getAlmacenes(1, searchTerm, '1', tipoBackend);
            let data = response.data.content || response.data || [];

            // Filtrado adicional en frontend si se permiten múltiples tipos (ej: [1, 2])
            if (allowedTypes && allowedTypes.length > 1) {
                data = data.filter(alm => allowedTypes.includes(Number(alm.tipo_almacen)));
            }

            setSuggestions(data);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Error buscando almacenes", error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (almacen) => {
        setInputValue(almacen.nombre);
        lastIdRef.current = almacen.id;
        onSelect({ id: almacen.id, nombre: almacen.nombre, tipo: almacen.tipo_almacen }); 
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
                <BuildingStorefrontIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-restaurant-primary transition-colors" />
                
                <input
                    type="text"
                    value={inputValue}
                    placeholder={loading ? "Cargando..." : "Buscar Almacén..."}
                    onFocus={() => fetchAlmacenes(inputValue)}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        fetchAlmacenes(e.target.value);
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
                        suggestions.map(alm => {
                            const tipoInfo = TIPO_LABELS[alm.tipo_almacen] || { label: 'OTRO', color: 'bg-gray-100 text-gray-600' };
                            
                            return (
                                <li 
                                    key={alm.id} 
                                    onClick={() => handleSelect(alm)} 
                                    className="px-4 py-2 hover:bg-orange-50 hover:text-orange-700 cursor-pointer text-sm border-b border-gray-50 last:border-none flex justify-between items-center"
                                >
                                    <span>{alm.nombre}</span>
                                    
                                    {/* Etiqueta del Tipo de Almacén */}
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${tipoInfo.color}`}>
                                        {tipoInfo.label}
                                    </span>
                                </li>
                            );
                        })
                    ) : (
                        <li className="px-4 py-3 text-gray-400 text-xs italic text-center">No se encontraron almacenes</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default AlmacenSearchSelect;