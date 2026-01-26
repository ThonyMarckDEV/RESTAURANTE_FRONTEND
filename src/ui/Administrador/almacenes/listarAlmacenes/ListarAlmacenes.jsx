import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAlmacenes, toggleAlmacenEstado } from 'services/almacenService'; 
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import Table from 'components/Shared/Tables/Table';
import { PencilSquareIcon, CubeIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { BeakerIcon } from '@heroicons/react/24/solid';

const ListarAlmacenes = () => {
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [itemToToggle, setItemToToggle] = useState(null);
    const [almacenes, setAlmacenes] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
    const [searchTerm, setSearchTerm] = useState('');

    const columns = useMemo(() => [
        {
            header: 'Almacén',
            render: (row) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <CubeIcon className="w-5 h-5 text-restaurant-primary"/>
                        <span className="font-bold text-gray-800">{row.nombre}</span>
                    </div>
                    {/* Indicador visual de Refrigerado */}
                    {row.es_refrigerado && (
                        <span className="ml-7 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full w-fit flex items-center gap-1 mt-1">
                            <BeakerIcon className="w-3 h-3"/> Refrigerado
                        </span>
                    )}
                </div>
            )
        },
        {
            header: 'Sede',
            render: (row) => (
                <div className="flex items-center gap-2 text-gray-600">
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
                        className="group flex items-center gap-1.5 w-fit px-3 py-1.5 rounded-md text-sm font-medium text-restaurant-secondary bg-white border border-restaurant-secondary/30 hover:bg-restaurant-secondary hover:text-white transition-all duration-200 shadow-sm"
                    >
                        <PencilSquareIcon className="w-4 h-4" /> 
                        <span>Editar</span>
                    </Link>
                </div>
            )
        }
    ], []);

    const fetchAlmacenes = useCallback(async (page, search = '') => {
        setLoading(true);
        try {
            const response = await getAlmacenes(page, search);
            setAlmacenes(response.data.content);
            setPaginationInfo({ currentPage: response.data.currentPage, totalPages: response.data.totalPages });
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al cargar los almacenes.' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => fetchAlmacenes(1, searchTerm), 500);
        return () => clearTimeout(handler);
    }, [searchTerm, fetchAlmacenes]);

    const handleToggle = async () => {
        const id = itemToToggle.id;
        setItemToToggle(null);
        try {
            await toggleAlmacenEstado(id);
            fetchAlmacenes(paginationInfo.currentPage, searchTerm);
            setAlert({ type: 'success', message: 'Estado del almacén actualizado.' });
        } catch (err) { setAlert({ type: 'error', message: 'Error al cambiar estado.' }); }
    };

    if (loading && almacenes.length === 0) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-restaurant-primary">Almacenes</h1>
                    <p className="text-sm text-gray-500 mt-1">Gestión de ubicaciones de inventario</p>
                </div>
                <Link to="/admin/agregar-almacen" className="bg-restaurant-primary text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-md hover:bg-red-900 transition-colors">
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
                columns={columns} data={almacenes} loading={loading}
                pagination={{ currentPage: paginationInfo.currentPage, totalPages: paginationInfo.totalPages, onPageChange: (page) => fetchAlmacenes(page, searchTerm) }}
                onSearch={setSearchTerm} searchPlaceholder="Buscar almacén por nombre..."
            />
        </div>
    );
};

export default ListarAlmacenes;