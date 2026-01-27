import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getPlatos, togglePlatoEstado } from 'services/platoService'; 
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import Table from 'components/Shared/Tables/Table';
import CategoriaSearchSelect from 'components/Shared/Comboboxes/CategoriaSearchSelect';
import { PencilSquareIcon, FireIcon, TagIcon } from '@heroicons/react/24/outline';

const ListarPlatos = () => {
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [itemToToggle, setItemToToggle] = useState(null);
    const [platos, setPlatos] = useState([]);
    
    // --- ESTADO PARA CONTROLAR EL OBJETO DEL COMBOBOX ---
    const [selectedCategoryObj, setSelectedCategoryObj] = useState(null);

    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });

    const [filters, setFilters] = useState({
        search: '',
        estado: '',
        categoriaId: '', 
        minPrecio: '',
        maxPrecio: ''
    });

    // --- CONFIGURACIÓN DE FILTROS ---
    const filtersList = useMemo(() => [
        {
            id: 'search',
            label: 'Nombre',
            type: 'text',
            value: filters.search,
            placeholder: 'Buscar plato...',
            onChange: (val) => setFilters(prev => ({ ...prev, search: val }))
        },
        {
            id: 'categoriaId',
            label: 'Categoría',
            component: (
                <CategoriaSearchSelect 
                    categoryTypes={[3]} // 3 = PLATOS / COCINA
                    initialValue={selectedCategoryObj}
                    onSelect={(cat) => {
                        setSelectedCategoryObj(cat);
                        setFilters(prev => ({ ...prev, categoriaId: cat ? cat.id : '' }));
                    }}
                />
            )
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
        },
        {
            id: 'minPrecio',
            label: 'Min Precio',
            type: 'text',
            value: filters.minPrecio,
            placeholder: '0.00',
            onChange: (val) => setFilters(prev => ({ ...prev, minPrecio: val }))
        },
        {
            id: 'maxPrecio',
            label: 'Max Precio',
            type: 'text',
            value: filters.maxPrecio,
            placeholder: '0.00',
            onChange: (val) => setFilters(prev => ({ ...prev, maxPrecio: val }))
        }
    ], [filters, selectedCategoryObj]);

    // --- COLUMNAS ---
    const columns = useMemo(() => [
        {
            header: 'Plato',
            accessor: 'nombre',
            render: (row) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <FireIcon className="w-5 h-5 text-restaurant-primary"/>
                        <span className="font-bold text-gray-800">{row.nombre}</span>
                    </div>
                    {row.descripcion && (
                        <span className="text-xs text-gray-400 mt-1 ml-7 truncate max-w-[200px]">
                            {row.descripcion}
                        </span>
                    )}
                </div>
            )
        },
        {
            header: 'Categoría',
            render: (row) => (
                <div className="flex items-center gap-2 text-gray-600">
                    <TagIcon className="w-4 h-4"/>
                    <span>{row.categoria_nombre}</span>
                </div>
            )
        },
        {
            header: 'Precio Carta',
            render: (row) => (
                <span className="text-emerald-700 font-bold font-mono text-base">
                    S/ {parseFloat(row.precio_venta).toFixed(2)}
                </span>
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
                <Link 
                    to={`/admin/editar-plato/${row.id}`} 
                    className="w-fit flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-restaurant-secondary bg-white border border-restaurant-secondary/30 hover:bg-restaurant-secondary hover:text-white transition-all shadow-sm"
                >
                    <PencilSquareIcon className="w-4 h-4" /> Editar
                </Link>
            )
        }
    ], []);

    // --- FETCH DATA ---
    const fetchPlatos = useCallback(async (page, currentFilters) => {
        setLoading(true);
        try {
            const response = await getPlatos(page, currentFilters);
            setPlatos(response.data.content);
            setPaginationInfo({ currentPage: response.data.currentPage, totalPages: response.data.totalPages });
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al cargar los platos.' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchPlatos(1, filters);
        }, 500);
        return () => clearTimeout(handler);
    }, [filters, fetchPlatos]);

    const clearFilters = () => {
        setFilters({
            search: '',
            estado: '',
            categoriaId: '',
            minPrecio: '',
            maxPrecio: ''
        });
        setSelectedCategoryObj(null); // Limpiar combobox
    };

    const handleToggle = async () => {
        const id = itemToToggle.id;
        setItemToToggle(null);
        try {
            await togglePlatoEstado(id);
            fetchPlatos(paginationInfo.currentPage, filters);
            setAlert({ type: 'success', message: 'Estado del plato actualizado.' });
        } catch (err) { setAlert({ type: 'error', message: 'Error al cambiar estado.' }); }
    };

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-restaurant-primary">Carta / Platos</h1>
                    <p className="text-sm text-gray-500 mt-1">Gestión del menú diario</p>
                </div>
                <Link to="/admin/agregar-plato" className="bg-restaurant-primary text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-md hover:bg-red-900 transition-colors">
                    <FireIcon className="w-5 h-5"/> Nuevo Plato
                </Link>
            </div>
            
            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />
            
            {itemToToggle && (
                <ConfirmModal 
                    message={`¿Estás seguro de cambiar el estado de "${itemToToggle.nombre}"?`} 
                    onConfirm={handleToggle} 
                    onCancel={() => setItemToToggle(null)} 
                />
            )}

            <Table 
                columns={columns} 
                data={platos} 
                loading={loading}
                filters={filtersList} // Filtros avanzados
                onClearFilters={clearFilters}
                pagination={{ 
                    currentPage: paginationInfo.currentPage, 
                    totalPages: paginationInfo.totalPages, 
                    onPageChange: (page) => fetchPlatos(page, filters) 
                }}
            />
        </div>
    );
};

export default ListarPlatos;