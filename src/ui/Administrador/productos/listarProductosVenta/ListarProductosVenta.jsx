import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getProductosVenta, toggleProductoVentaEstado } from 'services/productoVentaService'; 
import CategoriaSearchSelect from 'components/Shared/Comboboxes/CategoriaSearchSelect';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import Table from 'components/Shared/Tables/Table';
import { PencilSquareIcon, ShoppingBagIcon, TagIcon } from '@heroicons/react/24/outline';

const ListarProductosVenta = () => {
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [itemToToggle, setItemToToggle] = useState(null);
    const [productos, setProductos] = useState([]);
    
    const [selectedCategoryObj, setSelectedCategoryObj] = useState(null);

    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });

    const [filters, setFilters] = useState({
        search: '',
        categoriaId: '',
        estado: ''
    });

    // --- FILTROS ---
    const filtersList = useMemo(() => [
        {
            id: 'search',
            label: 'Buscar',
            type: 'text',
            value: filters.search,
            placeholder: 'Nombre del producto...',
            onChange: (val) => setFilters(prev => ({ ...prev, search: val }))
        },
        {
            id: 'categoriaId',
            label: 'Categoría',
            component: (
                <CategoriaSearchSelect 
                    categoryTypes={2}
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
        }
    ], [filters, selectedCategoryObj]);

    // --- COLUMNAS ---
    const columns = useMemo(() => [
        {
            header: 'Producto',
            render: (row) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <ShoppingBagIcon className="w-5 h-5 text-restaurant-primary"/>
                        <span className="font-bold text-gray-800">{row.nombre}</span>
                    </div>
                    {row.marca && (
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full w-fit mt-1 ml-7">{row.marca}</span>
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
            header: 'P. Venta',
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
                    to={`/admin/editar-producto-venta/${row.id}`} 
                    className="w-fit flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-restaurant-secondary bg-white border border-restaurant-secondary/30 hover:bg-restaurant-secondary hover:text-white transition-all duration-200 shadow-sm"
                >
                    <PencilSquareIcon className="w-4 h-4" /> 
                    <span>Editar</span>
                </Link>
            )
        }
    ], []);

    // --- FETCH DATA ---
    const fetchProductos = useCallback(async (page, currentFilters) => {
        setLoading(true);
        try {
            const response = await getProductosVenta(
                page, 
                currentFilters.search, 
                currentFilters.categoriaId, 
                currentFilters.estado
            );
            setProductos(response.data.content);
            setPaginationInfo({ 
                currentPage: response.data.currentPage, 
                totalPages: response.data.totalPages 
            });
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al cargar los productos.' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchProductos(1, filters);
        }, 500);
        return () => clearTimeout(handler);
    }, [filters, fetchProductos]);

    const handleToggle = async () => {
        const id = itemToToggle.id;
        setItemToToggle(null);
        try {
            await toggleProductoVentaEstado(id);
            fetchProductos(paginationInfo.currentPage, filters);
            setAlert({ type: 'success', message: 'Estado del producto actualizado.' });
        } catch (err) { setAlert({ type: 'error', message: 'Error al cambiar estado.' }); }
    };

    const clearFilters = () => {
        setFilters({ search: '', categoriaId: '', estado: '' });
        setSelectedCategoryObj(null);
    };

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-restaurant-primary">Productos Venta</h1>
                    <p className="text-sm text-gray-500 mt-1">Gaseosas, Cervezas, Galletas, etc.</p>
                </div>
                <Link to="/admin/agregar-producto-venta" className="bg-restaurant-primary text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-md hover:bg-red-900 transition-colors">
                    <ShoppingBagIcon className="w-5 h-5"/> Nuevo Producto
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
                data={productos} 
                loading={loading}
                filters={filtersList} 
                onClearFilters={clearFilters}
                pagination={{ 
                    currentPage: paginationInfo.currentPage, 
                    totalPages: paginationInfo.totalPages, 
                    onPageChange: (page) => fetchProductos(page, filters) 
                }}
            />
        </div>
    );
};

export default ListarProductosVenta;