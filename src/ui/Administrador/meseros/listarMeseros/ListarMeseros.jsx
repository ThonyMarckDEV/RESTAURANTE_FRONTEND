import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getMeseros, toggleMeseroEstado } from 'services/meseroService'; 
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import Table from 'components/Shared/Tables/Table';
import { PencilSquareIcon, UserGroupIcon, UserPlusIcon, IdentificationIcon } from '@heroicons/react/24/outline';

const ListarMeseros = () => {
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [meseroToToggle, setMeseroToToggle] = useState(null);
    const [meseros, setMeseros] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const columns = useMemo(() => [
        {
            header: 'Mesero / Usuario',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 text-restaurant-primary bg-restaurant-surface rounded-lg">
                        <UserGroupIcon className="w-5 h-5"/>
                    </div>
                    <div>
                        <span className="font-bold text-gray-800 block">
                            {row.datos_empleado?.nombre} {row.datos_empleado?.apellidoPaterno}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">@{row.username}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'DNI',
            render: (row) => (
                <div className="flex items-center gap-1.5">
                    <IdentificationIcon className="w-4 h-4 text-gray-400" />
                    <span className="font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 text-xs font-bold">
                        {row.datos_empleado?.dni}
                    </span>
                </div>
            )
        },
        {
            header: 'Teléfono',
            render: (row) => <span className="text-sm text-gray-600">{row.datos_empleado?.telefono || '-'}</span>
        },
        {
            header: 'Estado',
            render: (row) => (
                <button 
                    onClick={() => setMeseroToToggle({ id: row.id, estado: row.estado, nombre: row.datos_empleado?.nombre })}
                    className={`px-3 py-1 font-bold text-xs rounded-full border transition-all duration-200 ${
                        row.estado === 1
                            ? 'text-emerald-700 bg-emerald-100 border-emerald-200 hover:bg-red-100 hover:text-red-700 hover:border-red-200'
                            : 'text-red-700 bg-red-50 border-red-100 hover:bg-emerald-100 hover:text-emerald-700 hover:border-emerald-200'
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
                    to={`/admin/editar-mesero/${row.id}`} 
                    className="group flex items-center gap-1.5 w-fit px-3 py-1.5 rounded-md text-sm font-medium text-restaurant-secondary bg-white border border-restaurant-secondary/30 hover:bg-restaurant-secondary hover:text-white transition-all duration-200 shadow-sm"
                >
                    <PencilSquareIcon className="w-4 h-4" /> 
                    <span>Editar</span>
                </Link>
            )
        }
    ], []);

    const fetchMeseros = useCallback(async (page, search = '', status = '') => {
        setLoading(true);
        try {
            const response = await getMeseros(page, search, status);
            const { content, currentPage, totalPages } = response.data;
            setMeseros(content);
            setPaginationInfo({ currentPage, totalPages });
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al cargar los meseros.' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchMeseros(1, searchTerm, statusFilter);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm, statusFilter, fetchMeseros]);

    const executeToggleEstado = async () => {
        if (!meseroToToggle) return;
        const { id } = meseroToToggle;
        setMeseroToToggle(null);
        try {
            await toggleMeseroEstado(id);
            setAlert({ type: 'success', message: 'Estado del mesero actualizado.' });
            fetchMeseros(paginationInfo.currentPage, searchTerm, statusFilter);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Error al cambiar estado';
            setAlert({ type: 'error', message: errorMsg });
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
    };

    const filterConfig = [
        {
            id: 'search',
            label: 'Buscar Mesero',
            type: 'text',
            placeholder: 'Nombre, DNI o Usuario...',
            value: searchTerm,
            onChange: setSearchTerm
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

    if (loading && meseros.length === 0) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-restaurant-primary">Gestión de Meseros</h1>
                    <p className="text-sm text-gray-500 mt-1">Administra el personal encargado de las mesas.</p>
                </div>
                
                <Link 
                    to="/admin/agregar-mesero" 
                    className="bg-restaurant-primary text-white px-5 py-2.5 rounded-lg hover:bg-red-900 transition-all shadow-md flex items-center gap-2 font-bold transform hover:-translate-y-0.5"
                >
                    <UserPlusIcon className="w-5 h-5"/>
                    <span>Nuevo Mesero</span>
                </Link>
            </div>

            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

            {meseroToToggle && (
                <ConfirmModal
                    message={`¿Estás seguro de cambiar el estado de ${meseroToToggle.nombre}?`}
                    onConfirm={executeToggleEstado}
                    onCancel={() => setMeseroToToggle(null)}
                />
            )}
            
            <Table 
                columns={columns}
                data={meseros}
                loading={loading}
                filters={filterConfig}
                onClearFilters={clearFilters}
                pagination={{
                    currentPage: paginationInfo.currentPage,
                    totalPages: paginationInfo.totalPages,
                    onPageChange: (page) => fetchMeseros(page, searchTerm, statusFilter)
                }}
            />
        </div>
    );
};
 
export default ListarMeseros;