import React, { useState, useEffect, useRef } from 'react';
import { getInsumos } from 'services/insumoService';
import { CubeIcon, ChevronDownIcon, XMarkIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const InsumoSearchSelect = ({ onSelect, initialValue, excludedIds = [] }) => {

    const [inputValue, setInputValue] = useState(initialValue?.nombre || '');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);

    const lastIdRef = useRef(initialValue?.id);
    const wrapperRef = useRef(null);

    // Sincronizar valor inicial
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

    const fetchInsumos = async (searchTerm = '') => {
        setLoading(true);
        try {
            const filters = { search: searchTerm, estado: 1 };
            const response = await getInsumos(1, filters);
            
            const data = response.data.content || response.data || [];
            setSuggestions(data);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Error buscando insumos", error);
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

    const handleSelect = (insumo, isDisabled) => {
        if (isDisabled) return; // Si está deshabilitado, no hace nada

        setInputValue(insumo.nombre);
        lastIdRef.current = insumo.id;
        
        onSelect({ 
            id: insumo.id, 
            nombre: insumo.nombre, 
            unidad: insumo.unidad_medida, 
            precio: insumo.costo_promedio 
        }); 
        
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
                <CubeIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-restaurant-primary transition-colors" />
                
                <input
                    type="text"
                    value={inputValue}
                    placeholder={loading ? "Cargando..." : "Buscar Insumo..."}
                    onFocus={() => fetchInsumos(inputValue)}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        fetchInsumos(e.target.value);
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
                        suggestions.map(ins => {
                            // VERIFICAR SI ESTÁ EXCLUIDO
                            const isDisabled = excludedIds.includes(ins.id);

                            return (
                                <li 
                                    key={ins.id} 
                                    onClick={() => handleSelect(ins, isDisabled)} 
                                    className={`px-4 py-2 text-sm border-b border-gray-50 last:border-none flex justify-between items-center transition-colors
                                        ${isDisabled 
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-70' // Estilo bloqueado
                                            : 'hover:bg-orange-50 hover:text-orange-700 cursor-pointer text-gray-700' // Estilo normal
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-2">
                                        <span>{ins.nombre}</span>
                                        {isDisabled && (
                                            <span className="flex items-center gap-1 text-[10px] text-red-400 italic">
                                                <ExclamationCircleIcon className="w-3 h-3"/> Ya agregado
                                            </span>
                                        )}
                                    </div>

                                    {ins.unidad_medida && (
                                        <span className={`text-[10px] px-2 py-0.5 rounded uppercase ${isDisabled ? 'bg-gray-200' : 'bg-gray-100 text-gray-500'}`}>
                                            {ins.unidad_medida}
                                        </span>
                                    )}
                                </li>
                            );
                        })
                    ) : (
                        <li className="px-4 py-3 text-gray-400 text-xs italic text-center">No se encontraron insumos</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default InsumoSearchSelect;