import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getProveedores, toggleProveedorEstado } from 'services/proveedorService'; 
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import Table from 'components/Shared/Tables/Table';
import { PencilSquareIcon, UserGroupIcon, IdentificationIcon, PhoneIcon } from '@heroicons/react/24/outline';

const ListarProveedores = () => {
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [provToToggle, setProvToToggle] = useState(null);
    const [proveedores, setProveedores] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
    const [searchTerm, setSearchTerm] = useState('');

    const columns = useMemo(() => [
        {
            header: 'Proveedor / Razón Social',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 text-restaurant-primary bg-restaurant-surface rounded-lg">
                        <UserGroupIcon className="w-5 h-5"/>
                    </div>
                    <span className="font-bold text-gray-800">{row.razon_social}</span>
                </div>
            )
        },
        {
            header: 'RUC',
            render: (row) => (
                <div className="flex items-center gap-2 text-gray-600">
                    <IdentificationIcon className="w-4 h-4 text-gray-400" />
                    <span className="font-mono bg-gray-100 px-2 py-0.5 rounded border border-gray-200 text-xs">
                        {row.ruc}
                    </span>
                </div>
            )
        },
        {
            header: 'Contacto',
            render: (row) => (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <PhoneIcon className="w-4 h-4 text-restaurant-secondary" />
                    <span>{row.telefono}</span>
                </div>
            )
        },
        {
            header: 'Estado',
            render: (row) => (
                <button 
                    onClick={() => setProvToToggle(row)}
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
                        to={`/superadmin/editar-proveedor/${row.id}`} 
                        className="group flex items-center gap-1.5 w-fit px-3 py-1.5 rounded-md text-sm font-medium text-restaurant-secondary bg-white border border-restaurant-secondary/30 hover:bg-restaurant-secondary hover:text-white transition-all duration-200 shadow-sm"
                    >
                        <PencilSquareIcon className="w-4 h-4" /> 
                        <span>Editar</span>
                    </Link>
                </div>
            )
        }
    ], []);

    const fetchProveedores = useCallback(async (page, search = '') => {
        setLoading(true);
        try {
            const response = await getProveedores(page, search);
            const { content, currentPage, totalPages } = response.data;
            setProveedores(content);
            setPaginationInfo({ currentPage, totalPages });
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al cargar la lista de proveedores.' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => fetchProveedores(1, searchTerm), 500);
        return () => clearTimeout(handler);
    }, [searchTerm, fetchProveedores]);

    const handleToggleStatus = async () => {
        const id = provToToggle.id;
        setProvToToggle(null);
        setLoading(true);
        try {
            await toggleProveedorEstado(id);
            setAlert({ type: 'success', message: 'Estado del proveedor actualizado.' });
            await fetchProveedores(paginationInfo.currentPage, searchTerm);
        } catch (err) {
            setAlert({ type: 'error', message: 'No se pudo cambiar el estado.' });
            setLoading(false);
        }
    };

    if (loading && proveedores.length === 0) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-restaurant-primary">Directorio de Proveedores</h1>
                    <p className="text-sm text-gray-500 mt-1">Gestiona las empresas que suministran a tu restaurante</p>
                </div>
                <Link 
                    to="/superadmin/agregar-proveedor" 
                    className="bg-restaurant-primary text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-md hover:bg-red-900 transition-all transform hover:-translate-y-0.5"
                >
                    <UserGroupIcon className="w-5 h-5"/> Nuevo Proveedor
                </Link>
            </div>

            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

            {provToToggle && (
                <ConfirmModal 
                    message={`¿Estás seguro de cambiar el estado de "${provToToggle.razon_social}"?`} 
                    onConfirm={handleToggleStatus} 
                    onCancel={() => setProvToToggle(null)} 
                />
            )}

            <div className="overflow-hidden rounded-xl borde">
                <Table 
                    columns={columns} 
                    data={proveedores} 
                    loading={loading}
                    pagination={{ 
                        currentPage: paginationInfo.currentPage, 
                        totalPages: paginationInfo.totalPages, 
                        onPageChange: (page) => fetchProveedores(page, searchTerm) 
                    }}
                    onSearch={setSearchTerm} 
                    searchPlaceholder="Buscar por Razón Social o RUC..."
                />
            </div>
        </div>
    );
};

export default ListarProveedores;