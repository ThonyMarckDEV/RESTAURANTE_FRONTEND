import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getPlatos, togglePlatoEstado } from 'services/platoService'; 
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import Table from 'components/Shared/Tables/Table';
import { PencilSquareIcon, FireIcon, TagIcon } from '@heroicons/react/24/outline';

const ListarPlatos = () => {
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [itemToToggle, setItemToToggle] = useState(null);
    const [platos, setPlatos] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
    const [searchTerm, setSearchTerm] = useState('');

    const columns = useMemo(() => [
        {
            header: 'Plato',
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
                <div className="flex justify-start gap-2">
                    <Link 
                        to={`/admin/editar-plato/${row.id}`} 
                        className="group flex items-center gap-1.5 w-fit px-3 py-1.5 rounded-md text-sm font-medium text-restaurant-secondary bg-white border border-restaurant-secondary/30 hover:bg-restaurant-secondary hover:text-white transition-all duration-200 shadow-sm"
                    >
                        <PencilSquareIcon className="w-4 h-4" /> 
                        <span>Editar</span>
                    </Link>
                </div>
            )
        }
    ], []);

    const fetchPlatos = useCallback(async (page, search = '') => {
        setLoading(true);
        try {
            const response = await getPlatos(page, search);
            setPlatos(response.data.content);
            setPaginationInfo({ currentPage: response.data.currentPage, totalPages: response.data.totalPages });
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al cargar los platos.' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => fetchPlatos(1, searchTerm), 500);
        return () => clearTimeout(handler);
    }, [searchTerm, fetchPlatos]);

    const handleToggle = async () => {
        const id = itemToToggle.id;
        setItemToToggle(null);
        try {
            await togglePlatoEstado(id);
            fetchPlatos(paginationInfo.currentPage, searchTerm);
            setAlert({ type: 'success', message: 'Estado del plato actualizado.' });
        } catch (err) { setAlert({ type: 'error', message: 'Error al cambiar estado.' }); }
    };

    if (loading && platos.length === 0) return <LoadingScreen />;

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
                columns={columns} data={platos} loading={loading}
                pagination={{ currentPage: paginationInfo.currentPage, totalPages: paginationInfo.totalPages, onPageChange: (page) => fetchPlatos(page, searchTerm) }}
                onSearch={setSearchTerm} searchPlaceholder="Buscar plato..."
            />
        </div>
    );
};

export default ListarPlatos;