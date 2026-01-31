import React, { useState, useEffect, useRef } from 'react';
import { getPlatos } from 'services/platoService';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { UtensilsCrossedIcon } from 'lucide-react';

const PlatoSearchSelect = ({ onSelect, initialValue, sedeId = null }) => {

    const [inputValue, setInputValue] = useState(initialValue?.nombre || '');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);

    const wrapperRef = useRef(null);

    useEffect(() => {
        if (initialValue && initialValue.nombre) {
            setInputValue(initialValue.nombre);
        }
    }, [initialValue]);

    const fetchPlatos = async (searchTerm = '') => {
        setLoading(true);
        try {
            const filters = { 
                search: searchTerm, 
                estado: 1, 
                notInSedeId: sedeId
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

    const handleSelect = (plato) => {
        onSelect({ 
            id: plato.id, 
            nombre: plato.nombre, 
            precio_venta: plato.precio_venta,
            categoria_nombre: plato.categoria_nombre 
        }); 
        
        setInputValue('');
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setInputValue('');
        setSuggestions([]);
        if (onSelect) onSelect(null);
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="relative group">
                <UtensilsCrossedIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-restaurant-secondary transition-colors" />
                
                <input
                    type="text"
                    value={inputValue}
                    placeholder={loading ? "Buscando..." : "Buscar plato para agregar..."}
                    onFocus={() => {
                        fetchPlatos(inputValue);
                    }}
                    onChange={(e) => {
                        const val = e.target.value;
                        setInputValue(val);
                        fetchPlatos(val);
                    }}
                    className="w-full pl-9 pr-10 py-2 bg-white border border-gray-300 rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-restaurant-secondary/20 focus:border-restaurant-secondary placeholder:text-gray-400"
                />
                
                <div className="absolute right-3 top-2.5 cursor-pointer flex items-center">
                    {inputValue ? (
                        <XMarkIcon className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" onClick={handleClear} />
                    ) : (
                        !loading && <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                    )}
                    {loading && <div className="w-4 h-4 border-2 border-gray-300 border-t-restaurant-secondary rounded-full animate-spin ml-1" />}
                </div>
            </div>

            {showSuggestions && (
                <ul className="absolute z-[100] w-full bg-white border border-gray-100 rounded-lg mt-1 shadow-2xl max-h-60 overflow-auto animate-fadeIn">
                    {suggestions.length > 0 ? (
                        suggestions.map(plato => (
                            <li 
                                key={plato.id} 
                                onClick={() => handleSelect(plato)} 
                                className="px-4 py-2.5 text-sm border-b border-gray-50 last:border-none flex justify-between items-center cursor-pointer hover:bg-orange-50 hover:text-orange-800 text-gray-700 transition-colors"
                            >
                                <div className="flex flex-col">
                                    <span className="font-bold">{plato.nombre}</span>
                                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                                        {plato.categoria_nombre}
                                    </span>
                                </div>

                                <div className="text-right">
                                    <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                                        S/ {parseFloat(plato.precio_venta || 0).toFixed(2)}
                                    </span>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-3 text-gray-400 text-xs italic text-center">
                            {inputValue ? "No se encontraron platos disponibles" : "Escribe para buscar..."}
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default PlatoSearchSelect;