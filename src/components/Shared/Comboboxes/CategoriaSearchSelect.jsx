import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getCategorias } from 'services/categoriaService';
import { TagIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';

const CategoriaSearchSelect = ({ categoryTypes, onSelect, initialValue }) => {

    const [inputValue, setInputValue] = useState(initialValue?.nombre || '');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);

    const lastIdRef = useRef(initialValue?.id);
    const wrapperRef = useRef(null);

    const allowedTypes = useMemo(() => {
        if (categoryTypes === undefined || categoryTypes === null) return null;
        return Array.isArray(categoryTypes) ? categoryTypes : [categoryTypes];
    }, [categoryTypes]);

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
    // -----------------------------

    const fetchCategorias = async (searchTerm = '') => {
        setLoading(true);
        try {
            const typeForBackend = (allowedTypes && allowedTypes.length === 1) ? allowedTypes[0] : null;
            const response = await getCategorias(1, searchTerm, typeForBackend, 1);
            let data = response.data.content || response.data || [];

            if (allowedTypes && allowedTypes.length > 1) {
                data = data.filter(cat => allowedTypes.includes(cat.tipo_categoria));
            }

            setSuggestions(data);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Error buscando categorías", error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    // Click Outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (cat) => {
        setInputValue(cat.nombre);
        lastIdRef.current = cat.id;
        onSelect({ id: cat.id, nombre: cat.nombre }); 
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
                <TagIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-restaurant-primary transition-colors" />
                <input
                    type="text"
                    value={inputValue}
                    placeholder={loading ? "Cargando..." : "Buscar Categoría..."}
                    onFocus={() => {
                        fetchCategorias(inputValue);
                    }}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        fetchCategorias(e.target.value);
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
                        suggestions.map(cat => (
                            <li 
                                key={cat.id} 
                                onClick={() => handleSelect(cat)} 
                                className="px-4 py-2 hover:bg-orange-50 hover:text-orange-700 cursor-pointer text-sm border-b border-gray-50 last:border-none"
                            >
                                {cat.nombre}
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-3 text-gray-400 text-xs italic text-center">No se encontraron resultados</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default CategoriaSearchSelect;