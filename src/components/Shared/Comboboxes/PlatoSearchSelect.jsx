import React, { useState, useEffect, useRef } from 'react';
import { getPlatos } from 'services/platoService';
import {ChevronDownIcon, XMarkIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { UtensilsCrossedIcon } from 'lucide-react';

const PlatoSearchSelect = ({ onSelect, initialValue, excludedIds = [] }) => {

    const [inputValue, setInputValue] = useState(initialValue?.nombre || '');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);

    const lastIdRef = useRef(initialValue?.id);
    const wrapperRef = useRef(null);

    // Sincronizar valor inicial cuando cambia externamente
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

    const fetchPlatos = async (searchTerm = '') => {
        setLoading(true);
        try {
            const filters = { 
                search: searchTerm, 
                estado: 1 
            };
            
            const response = await getPlatos(1, filters);
            
            const data = response.data.content || response.data || [];
            setSuggestions(data);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Error buscando platos", error);
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

    const handleSelect = (plato, isDisabled) => {
        if (isDisabled) return;

        setInputValue(plato.nombre);
        lastIdRef.current = plato.id;
        
        onSelect({ 
            id: plato.id, 
            nombre: plato.nombre, 
            precio_venta: plato.precio_venta,
            categoria_nombre: plato.categoria_nombre 
        }); 
        
        setShowSuggestions(false);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setInputValue('');
        lastIdRef.current = null;
        onSelect(null);
        setSuggestions([]);
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="relative group">
                {/* Cambiado a UtensilsIcon para platos */}
                <UtensilsCrossedIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-restaurant-secondary transition-colors" />
                
                <input
                    type="text"
                    value={inputValue}
                    placeholder={loading ? "Cargando..." : "Buscar plato en el catálogo..."}
                    onFocus={() => fetchPlatos(inputValue)}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        fetchPlatos(e.target.value);
                    }}
                    className="w-full pl-9 pr-10 py-2 bg-white border border-gray-300 rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-restaurant-secondary/20 focus:border-restaurant-secondary"
                />
                
                <div className="absolute right-3 top-2.5 cursor-pointer flex items-center">
                    {inputValue ? (
                        <XMarkIcon className="w-4 h-4 text-gray-400 hover:text-red-500" onClick={handleClear} />
                    ) : (
                        !loading && <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                    )}
                    {loading && <div className="w-4 h-4 border-2 border-gray-300 border-t-restaurant-secondary rounded-full animate-spin" />}
                </div>
            </div>

            {showSuggestions && (
                <ul className="absolute z-[100] w-full bg-white border border-gray-100 rounded-lg mt-1 shadow-2xl max-h-60 overflow-auto">
                    {suggestions.length > 0 ? (
                        suggestions.map(plato => {
                            // Verificamos si el plato ya está en la sede actual
                            const isDisabled = excludedIds.includes(plato.id);

                            return (
                                <li 
                                    key={plato.id} 
                                    onClick={() => handleSelect(plato, isDisabled)} 
                                    className={`px-4 py-2.5 text-sm border-b border-gray-50 last:border-none flex justify-between items-center transition-colors
                                        ${isDisabled 
                                            ? 'bg-gray-50 text-gray-400 cursor-not-allowed' 
                                            : 'hover:bg-orange-50 hover:text-orange-700 cursor-pointer text-gray-700'
                                        }
                                    `}
                                >
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className={`font-bold ${isDisabled ? 'text-gray-400' : 'text-gray-800'}`}>
                                                {plato.nombre}
                                            </span>
                                            {isDisabled && (
                                                <span className="flex items-center gap-1 text-[10px] text-orange-400 font-medium italic">
                                                    <ExclamationCircleIcon className="w-3 h-3"/> En menú
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">{plato.categoria_nombre}</span>
                                    </div>

                                    <div className="text-right">
                                        <span className="text-xs font-mono font-bold text-emerald-600">
                                            S/ {parseFloat(plato.precio_venta).toFixed(2)}
                                        </span>
                                    </div>
                                </li>
                            );
                        })
                    ) : (
                        <li className="px-4 py-3 text-gray-400 text-xs italic text-center">No hay platos que coincidan</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default PlatoSearchSelect;