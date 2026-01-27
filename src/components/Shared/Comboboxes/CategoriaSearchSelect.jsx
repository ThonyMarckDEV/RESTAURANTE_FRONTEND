import React, { useState, useEffect, useRef } from 'react';
import { getCategorias } from 'services/categoriaService';
import { TagIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const CategoriaSearchSelect = ({ onSelect, clearTrigger, currentValue }) => {
    const [inputValue, setInputValue] = useState(currentValue || '');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);

    const fetchCategorias = async (searchTerm = '') => {
        setLoading(true);
        try {
            // Buscamos categorías tipo INSUMO (1) y activas
            const response = await getCategorias(1, searchTerm, 1); 
            setSuggestions(response.data.content || []);
            setShowSuggestions(true);
        } catch (error) {
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    // Cerrar al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Resetear cuando se limpian los filtros
    useEffect(() => {
        if (!currentValue) setInputValue('');
    }, [clearTrigger, currentValue]);

    const handleSelect = (cat) => {
        setInputValue(cat.nombre);
        onSelect({ id: cat.id, nombre: cat.nombre });
        setShowSuggestions(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <div className="relative group">
                <TagIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-restaurant-primary transition-colors" />
                <input
                    type="text"
                    value={inputValue}
                    readOnly={loading} // Bloquear mientras carga
                    placeholder={loading ? "Cargando..." : "Categoría..."}
                    onFocus={() => fetchCategorias(inputValue)}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        fetchCategorias(e.target.value);
                    }}
                    className={`w-full pl-9 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-restaurant-primary/20 ${loading ? 'opacity-50 cursor-wait' : ''}`}
                />
                <div className="absolute right-3 top-2.5">
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-restaurant-primary rounded-full animate-spin" />
                    ) : (
                        <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                    )}
                </div>
            </div>

            {showSuggestions && (
                <ul className="absolute z-[100] w-full bg-white border border-gray-100 rounded-xl mt-1 shadow-xl max-h-60 overflow-auto animate-in fade-in slide-in-from-top-2 duration-200">
                    {suggestions.length > 0 ? (
                        suggestions.map(cat => (
                            <li 
                                key={cat.id} 
                                onClick={() => handleSelect(cat)} 
                                className="px-4 py-2.5 hover:bg-restaurant-surface hover:text-restaurant-primary cursor-pointer text-sm transition-colors border-b border-gray-50 last:border-none"
                            >
                                {cat.nombre}
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-3 text-gray-400 text-xs italic text-center">No hay resultados</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default CategoriaSearchSelect;