import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getCategorias, toggleCategoriaEstado } from 'services/categoriaService'; 
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import Table from 'components/Shared/Tables/Table';
import { PencilSquareIcon, TagIcon } from '@heroicons/react/24/outline';

const ListarCategorias = () => {
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [catToToggle, setCatToToggle] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
    
    // --- ESTADOS PARA FILTROS ---
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState(''); 
    const [statusFilter, setStatusFilter] = useState('');

    // Formateador de etiquetas de tipo
    const getTipoLabel = (tipo) => {
        switch(tipo) {
            case 1: return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">INSUMO</span>;
            case 2: return <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-bold">PRODUCTO</span>;
            case 3: return <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-bold">PLATO</span>;
            case 4: return <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold">MIXTO</span>;
            default: return <span className="text-gray-500 text-xs">Desconocido</span>;
        }
    };

    // Definición de columnas
    const columns = useMemo(() => [
        {
            header: 'Categoría',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 text-restaurant-primary bg-restaurant-surface rounded-lg">
                        <TagIcon className="w-5 h-5"/>
                    </div>
                    <span className="font-bold text-gray-800">{row.nombre}</span>
                </div>
            )
        },
        { header: 'Tipo', render: (row) => getTipoLabel(row.tipo_categoria) },
        {
            header: 'Estado',
            render: (row) => (
                <button 
                    onClick={() => setCatToToggle(row)}
                    className={`px-3 py-1 font-bold text-xs rounded-full border transition-colors ${
                        row.estado === 1 
                        ? 'text-emerald-700 bg-emerald-100 border-emerald-200 hover:bg-emerald-200' 
                        : 'text-red-700 bg-red-50 border-red-100 hover:bg-red-100'
                    }`}
                >
                    {row.estado === 1 ? 'ACTIVO' : 'INACTIVO'}
                </button>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex justify-start">
                    <Link 
                        to={`/superadmin/editar-categoria/${row.id}`} 
                        className="group flex items-center gap-1.5 w-fit px-3 py-1.5 rounded-md text-sm font-medium text-restaurant-secondary bg-white border border-restaurant-secondary/30 hover:bg-restaurant-secondary hover:text-white transition-all duration-200 shadow-sm"
                    >
                        <PencilSquareIcon className="w-4 h-4" /> 
                        <span>Editar</span>
                    </Link>
                </div>
            )
        }
    ], []);

    // Función de carga de datos
    const fetchCategorias = useCallback(async (page, search = '', type = '', status = '') => {
        setLoading(true);
        try {
            const response = await getCategorias(page, search, type, status);
            setCategorias(response.data.content);
            setPaginationInfo({ 
                currentPage: response.data.currentPage, 
                totalPages: response.data.totalPages 
            });
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al cargar las categorías.' });
        } finally {
            setLoading(false);
        }
    }, []);

    // Efecto para búsqueda y filtros con Debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchCategorias(1, searchTerm, typeFilter, statusFilter);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm, typeFilter, statusFilter, fetchCategorias]);

    // Manejo de cambio de estado
    const handleToggle = async () => {
        if (!catToToggle) return;
        const id = catToToggle.id;
        setCatToToggle(null);
        try {
            await toggleCategoriaEstado(id);
            fetchCategorias(paginationInfo.currentPage, searchTerm, typeFilter, statusFilter);
            setAlert({ type: 'success', message: 'Estado actualizado correctamente.' });
        } catch (err) { 
            setAlert({ type: 'error', message: 'Error al cambiar el estado.' }); 
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setTypeFilter('');
        setStatusFilter('');
    };

    // --- CONFIGURACIÓN DE FILTROS PARA LA TABLA GENÉRICA ---
    const filterConfig = [
        {
            id: 'search',
            label: 'Buscar por nombre',
            type: 'text',
            placeholder: 'Ej: Bebidas, Carnes...',
            value: searchTerm,
            onChange: setSearchTerm
        },
        {
            id: 'type',
            label: 'Filtrar Tipo',
            type: 'select',
            value: typeFilter,
            onChange: setTypeFilter,
            emptyLabel: 'Todos los tipos',
            options: [
                { value: '1', label: 'INSUMO' },
                { value: '2', label: 'PRODUCTO' },
                { value: '3', label: 'PLATO' },
                { value: '4', label: 'MIXTO' },
            ]
        },
        {
            id: 'status',
            label: 'Filtrar Estado',
            type: 'select',
            value: statusFilter,
            onChange: setStatusFilter,
            emptyLabel: 'Todos los estados',
            options: [
                { value: '1', label: 'ACTIVOS' },
                { value: '0', label: 'INACTIVOS' },
            ]
        }
    ];

    if (loading && categorias.length === 0) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-restaurant-primary">Categorías</h1>
                    <p className="text-gray-500 text-sm mt-1">Gestiona los tipos y estados de tus categorías de productos.</p>
                </div>
                <Link to="/superadmin/agregar-categoria" className="bg-restaurant-primary text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-md hover:bg-opacity-90 transition transform hover:-translate-y-0.5 active:translate-y-0">
                    <TagIcon className="w-5 h-5"/> Nueva Categoría
                </Link>
            </div>

            <AlertMessage 
                type={alert?.type} 
                message={alert?.message} 
                onClose={() => setAlert(null)} 
            />
            
            {catToToggle && (
                <ConfirmModal 
                    message={`¿Estás seguro de cambiar el estado de "${catToToggle.nombre}"?`} 
                    onConfirm={handleToggle} 
                    onCancel={() => setCatToToggle(null)} 
                />
            )}

            <Table 
                columns={columns} 
                data={categorias} 
                loading={loading}
                filters={filterConfig}
                onClearFilters={clearFilters}
                pagination={{ 
                    currentPage: paginationInfo.currentPage, 
                    totalPages: paginationInfo.totalPages, 
                    onPageChange: (page) => fetchCategorias(page, searchTerm, typeFilter, statusFilter) 
                }}
            />
        </div>
    );
};

export default ListarCategorias;