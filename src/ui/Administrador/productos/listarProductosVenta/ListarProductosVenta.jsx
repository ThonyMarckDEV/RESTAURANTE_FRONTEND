import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getProductosVenta, toggleProductoVentaEstado } from 'services/productoVentaService'; 
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import Table from 'components/Shared/Tables/Table';
import { PencilSquareIcon, ShoppingBagIcon, TagIcon } from '@heroicons/react/24/outline';

const ListarProductosVenta = () => {
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [itemToToggle, setItemToToggle] = useState(null);
    const [productos, setProductos] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
    const [searchTerm, setSearchTerm] = useState('');

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
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full w-fit mt-1 ml-7">
                            {row.marca}
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
        // --- CAMBIO: COLUMNA DE COSTO (Separada) ---
        {
            header: 'Costo',
            render: (row) => (
                <span className="text-gray-600 font-medium font-mono">
                    S/ {parseFloat(row.precio_compra).toFixed(2)}
                </span>
            )
        },
        // --- CAMBIO: COLUMNA DE VENTA (Separada y resaltada) ---
        {
            header: 'P. Venta',
            render: (row) => (
                <span className="text-emerald-700 font-bold font-mono text-base">
                    S/ {parseFloat(row.precio_venta).toFixed(2)}
                </span>
            )
        },
        {
            header: 'Stock Mín.',
            render: (row) => (
                <div className="flex items-center gap-1 text-gray-700">
                     <span className="font-bold">{row.stock_minimo}</span> 
                     <span className="text-xs text-gray-500">unid.</span>
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
                        to={`/admin/editar-producto-venta/${row.id}`} 
                        className="group flex items-center gap-1.5 w-fit px-3 py-1.5 rounded-md text-sm font-medium text-restaurant-secondary bg-white border border-restaurant-secondary/30 hover:bg-restaurant-secondary hover:text-white transition-all duration-200 shadow-sm"
                    >
                        <PencilSquareIcon className="w-4 h-4" /> 
                        <span>Editar</span>
                    </Link>
                </div>
            )
        }
    ], []);

    const fetchProductos = useCallback(async (page, search = '') => {
        setLoading(true);
        try {
            const response = await getProductosVenta(page, search);
            setProductos(response.data.content);
            setPaginationInfo({ currentPage: response.data.currentPage, totalPages: response.data.totalPages });
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al cargar los productos.' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => fetchProductos(1, searchTerm), 500);
        return () => clearTimeout(handler);
    }, [searchTerm, fetchProductos]);

    const handleToggle = async () => {
        const id = itemToToggle.id;
        setItemToToggle(null);
        try {
            await toggleProductoVentaEstado(id);
            fetchProductos(paginationInfo.currentPage, searchTerm);
            setAlert({ type: 'success', message: 'Estado del producto actualizado.' });
        } catch (err) { setAlert({ type: 'error', message: 'Error al cambiar estado.' }); }
    };

    if (loading && productos.length === 0) return <LoadingScreen />;

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
                columns={columns} data={productos} loading={loading}
                pagination={{ currentPage: paginationInfo.currentPage, totalPages: paginationInfo.totalPages, onPageChange: (page) => fetchProductos(page, searchTerm) }}
                onSearch={setSearchTerm} searchPlaceholder="Buscar producto..."
            />
        </div>
    );
};

export default ListarProductosVenta;