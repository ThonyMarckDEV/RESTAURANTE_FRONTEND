import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getInventarioInsumos } from 'services/inventarioInsumoService';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import Table from 'components/Shared/Tables/Table';
import AlmacenSearchSelect from 'components/Shared/Comboboxes/AlmacenSearchSelect';
import { CubeIcon, ArchiveBoxIcon, ScaleIcon } from '@heroicons/react/24/outline';
import { formatDate } from 'utilities/Formatters/formatters';

const ListarInventarioInsumos = () => {
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [inventario, setInventario] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });

    const [selectedAlmacenObj, setSelectedAlmacenObj] = useState(null);

    const [filters, setFilters] = useState({
        search: '',
        almacenId: ''
    });

    // --- CONFIGURACIÓN DE FILTROS ---
    const filtersList = useMemo(() => [
        {
            id: 'search',
            label: 'Buscar Insumo',
            type: 'text',
            value: filters.search,
            placeholder: 'Nombre del insumo...',
            onChange: (val) => setFilters(prev => ({ ...prev, search: val }))
        },
        {
            id: 'almacenId',
            label: 'Filtrar por Almacén',
            component: (
                <AlmacenSearchSelect 
                    tipos={[1, 2, 3]} // Solo Almacenes, Congeladoras y Cocinas (Oculta Barras de venta)
                    initialValue={selectedAlmacenObj}
                    onSelect={(alm) => {
                        setSelectedAlmacenObj(alm);
                        setFilters(prev => ({ ...prev, almacenId: alm ? alm.id : '' }));
                    }}
                />
            )
        }
    ], [filters.search, selectedAlmacenObj]);

    // --- COLUMNAS ---
    const columns = useMemo(() => [
        {
            header: 'Insumo',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-gray-800">{row.insumo_nombre}</span>
                    <span className="text-[10px] text-gray-400 font-mono">COD: {row.insumo_codigo || '-'}</span>
                </div>
            )
        },
        {
            header: 'Categoría',
            render: (row) => (
                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                    {row.categoria_nombre}
                </span>
            )
        },
        {
            header: 'Ubicación / Almacén',
            render: (row) => (
                <div className="flex items-center gap-2 text-gray-700">
                    <ArchiveBoxIcon className="w-4 h-4 text-restaurant-secondary"/>
                    <span className="text-sm font-medium">{row.almacen_nombre}</span>
                </div>
            )
        },
        {
            header: 'Stock Actual',
            render: (row) => {
                const stock = parseFloat(row.stock_actual);
                const colorClass = stock < 5 ? 'text-red-600 bg-red-50' : 'text-emerald-700 bg-emerald-50';
                
                return (
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg w-fit ${colorClass}`}>
                        <CubeIcon className="w-4 h-4"/>
                        <span className="font-black font-mono text-base">{stock.toFixed(2)}</span>
                        <span className="text-[10px] font-bold uppercase opacity-70 mt-0.5">{row.unidad_medida}</span>
                    </div>
                );
            }
        },
        {
            header: 'Último Movimiento',
            render: (row) => (
                <span className="text-xs text-gray-500">
                    {formatDate(row.ultimo_movimiento)}
                </span>
            )
        }
    ], []);

    // --- FETCH DATA ---
    const fetchInventario = useCallback(async (page, currentFilters) => {
        setLoading(true);
        try {
            const response = await getInventarioInsumos(page, currentFilters.search, currentFilters.almacenId);
            setInventario(response.data.content);
            setPaginationInfo({ 
                currentPage: response.data.currentPage, 
                totalPages: response.data.totalPages 
            });
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al cargar el inventario.' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchInventario(1, filters);
        }, 500);
        return () => clearTimeout(handler);
    }, [filters, fetchInventario]);

    const clearFilters = () => {
        setFilters({ search: '', almacenId: '' });
        setSelectedAlmacenObj(null);
    };

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <div className="flex justify-between items-center mb-8 border-b pb-4 border-gray-200">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-restaurant-primary flex items-center gap-3">
                        <ScaleIcon className="w-8 h-8"/>
                        Inventario de Insumos
                    </h1>
                    <p className="text-sm text-gray-500 mt-1 ml-11">Control de stock en tiempo real por almacén</p>
                </div>
                
            </div>

            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

            <Table 
                columns={columns} 
                data={inventario} 
                loading={loading}
                filters={filtersList} 
                onClearFilters={clearFilters}
                pagination={{ 
                    currentPage: paginationInfo.currentPage, 
                    totalPages: paginationInfo.totalPages, 
                    onPageChange: (page) => fetchInventario(page, filters) 
                }}
            />
        </div>
    );
};

export default ListarInventarioInsumos;