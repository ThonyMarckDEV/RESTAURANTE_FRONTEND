import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAlmacenes, toggleAlmacenEstado } from 'services/almacenService'; 
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import Table from 'components/Shared/Tables/Table';
import { PencilSquareIcon, CubeIcon, MapPinIcon } from '@heroicons/react/24/outline';

const ListarAlmacenes = () => {
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [itemToToggle, setItemToToggle] = useState(null);
    const [almacenes, setAlmacenes] = useState([]);
    
    const [paginationInfo, setPaginationInfo] = useState({ 
        currentPage: 1, 
        totalPages: 1 
    });

    const [filters, setFilters] = useState({
        search: '',
        estado: '',
        tipo: '' 
    });

    // --- HELPER PARA ETIQUETAS DE TIPO ---
    const getTipoLabel = (tipo) => {
        switch(tipo) {
            case 1: return { text: 'SECO', class: 'bg-gray-100 text-gray-600 border-gray-200' };
            case 2: return { text: 'REFRIGERADO', class: 'bg-blue-50 text-blue-600 border-blue-100' };
            case 3: return { text: 'PRODUCCIÓN', class: 'bg-orange-50 text-orange-600 border-orange-100' };
            case 4: return { text: 'VENTA', class: 'bg-purple-50 text-purple-600 border-purple-100' };
            default: return { text: 'OTRO', class: 'bg-gray-50 text-gray-500' };
        }
    };

    // --- 1. CONFIGURACIÓN DE FILTROS ---
    const filtersList = useMemo(() => [
        {
            id: 'search',
            label: 'Buscar',
            type: 'text',
            value: filters.search,
            placeholder: 'Nombre...',
            onChange: (val) => setFilters(prev => ({ ...prev, search: val }))
        },
        {
            id: 'tipo',
            label: 'Tipo',
            type: 'select',
            value: filters.tipo,
            onChange: (val) => setFilters(prev => ({ ...prev, tipo: val })),
            options: [
                { value: '1', label: 'SECO' },
                { value: '2', label: 'REFRIGERADO' },
                { value: '3', label: 'PRODUCCIÓN' },
                { value: '4', label: 'VENTA' }
            ]
        },
        {
            id: 'estado',
            label: 'Estado',
            type: 'select',
            value: filters.estado,
            onChange: (val) => setFilters(prev => ({ ...prev, estado: val })),
            options: [
                { value: '1', label: 'ACTIVOS' },
                { value: '0', label: 'INACTIVOS' }
            ]
        }
    ], [filters]);

    // --- 2. COLUMNAS DE LA TABLA ---
    const columns = useMemo(() => [
        {
            header: 'Almacén',
            accessor: 'nombre',
            render: (row) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <CubeIcon className="w-5 h-5 text-restaurant-primary"/>
                        <span className="font-bold text-gray-800">{row.nombre}</span>
                    </div>
                    {/* Etiqueta de Tipo */}
                    <div className="ml-7 mt-1">
                        {(() => {
                            const badge = getTipoLabel(row.tipo_almacen);
                            return (
                                <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${badge.class}`}>
                                    {badge.text}
                                </span>
                            );
                        })()}
                    </div>
                </div>
            )
        },
        {
            header: 'Sede',
            render: (row) => (
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <MapPinIcon className="w-4 h-4"/>
                    <span>{row.sede_nombre}</span>
                </div>
            )
        },
        {
            header: 'Estado',
            render: (row) => (
                <button 
                    onClick={() => setItemToToggle(row)}
                    className={`px-3 py-1 font-bold text-xs rounded-full border transition-all hover:scale-105 ${
                        row.estado === 1 ? 'text-emerald-700 bg-emerald-100 border-emerald-200' : 'text-red-700 bg-red-50 border-red-100'
                    }`}
                >
                    {row.estado === 1 ? 'ACTIVO' : 'INACTIVO'}
                </button>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex justify-start gap-2">
                    <Link 
                        to={`/admin/editar-almacen/${row.id}`} 
                        className="w-fit flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-restaurant-secondary bg-white border border-restaurant-secondary/30 hover:bg-restaurant-secondary hover:text-white transition-all duration-200 shadow-sm"
                    >
                        <PencilSquareIcon className="w-4 h-4" /> 
                        <span>Editar</span>
                    </Link>
                </div>
            )
        }
    ], []);

    // --- 3. LLAMADA A LA API ---
    const fetchAlmacenes = useCallback(async (page, currentFilters) => {
        setLoading(true);
        try {
            const response = await getAlmacenes(page, currentFilters.search, currentFilters.estado, currentFilters.tipo);
            setAlmacenes(response.data.content);
            setPaginationInfo({ 
                currentPage: response.data.currentPage, 
                totalPages: response.data.totalPages
            });
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al cargar los almacenes.' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchAlmacenes(1, filters);
        }, 500);
        return () => clearTimeout(handler);
    }, [filters, fetchAlmacenes]);

    const handleToggle = async () => {
        const id = itemToToggle.id;
        setItemToToggle(null);
        try {
            await toggleAlmacenEstado(id);
            fetchAlmacenes(paginationInfo.currentPage, filters);
            setAlert({ type: 'success', message: 'Estado actualizado correctamente.' });
        } catch (err) { 
            setAlert({ type: 'error', message: 'Error al cambiar estado.' }); 
        }
    };

    const clearFilters = () => {
        setFilters({ search: '', estado: '', tipo: '' });
    };

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-restaurant-primary">Almacenes</h1>
                    <p className="text-sm text-gray-500 mt-1">Gestión de ubicaciones de inventario</p>
                </div>
                <Link to="/admin/agregar-almacen" className="bg-restaurant-primary text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-md hover:bg-red-900 transition-colors transform hover:-translate-y-0.5">
                    <CubeIcon className="w-5 h-5"/> Nuevo Almacén
                </Link>
            </div>
            
            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />
            
            {itemToToggle && (
                <ConfirmModal 
                    message={`¿Estás seguro de cambiar el estado del almacén "${itemToToggle.nombre}"?`} 
                    onConfirm={handleToggle} 
                    onCancel={() => setItemToToggle(null)} 
                />
            )}

            <Table 
                columns={columns} 
                data={almacenes} 
                loading={loading} 
                filters={filtersList} 
                onClearFilters={clearFilters}
                pagination={{ 
                    currentPage: paginationInfo.currentPage, 
                    totalPages: paginationInfo.totalPages, 
                    onPageChange: (page) => fetchAlmacenes(page, filters) 
                }}
            />
        </div>
    );
};

export default ListarAlmacenes;