import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getCajas, toggleCajaEstado } from 'services/cajaService'; 
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import Table from 'components/Shared/Tables/Table';
import { PencilSquareIcon, ArchiveBoxIcon, PlusCircleIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';

const ListarCajas = () => {
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [cajaToToggle, setCajaToToggle] = useState(null);
    const [cajas, setCajas] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
    
    // --- ESTADOS PARA FILTROS ---
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const columns = useMemo(() => [
        {
            header: 'Caja',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 text-restaurant-primary bg-restaurant-surface rounded-lg">
                        <ArchiveBoxIcon className="w-5 h-5"/>
                    </div>
                    <div>
                        <span className="font-bold text-gray-800 block text-lg">{row.nombre}</span>
                        <span className="text-[10px] text-gray-400 font-mono">ID: #{row.id}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Disponibilidad',
            render: (row) => (
                <div className="flex items-center">
                    {row.estado_ocupado === 1 ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold border border-amber-200">
                            <LockClosedIcon className="w-3.5 h-3.5" />
                            OCUPADA
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                            <LockOpenIcon className="w-3.5 h-3.5" />
                            LIBRE
                        </span>
                    )}
                </div>
            )
        },
        {
            header: 'Estado',
            render: (row) => (
                <button 
                    onClick={() => setCajaToToggle({ id: row.id, estado: row.estado, nombre: row.nombre })}
                    className={`px-3 py-1 font-bold text-xs rounded-full border transition-all duration-200 ${
                        row.estado === 1
                            ? 'text-emerald-700 bg-emerald-100 border-emerald-200 hover:bg-red-100 hover:text-red-700 hover:border-red-200'
                            : 'text-red-700 bg-red-50 border-red-100 hover:bg-emerald-100 hover:text-emerald-700 hover:border-emerald-200'
                    }`}
                    title="Clic para cambiar estado (Activo/Inactivo)"
                >
                    {row.estado === 1 ? 'ACTIVA' : 'INACTIVA'}
                </button>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <Link 
                    to={`/admin/editar-caja/${row.id}`} 
                    className="group flex items-center gap-1.5 w-fit px-3 py-1.5 rounded-md text-sm font-medium text-restaurant-secondary bg-white border border-restaurant-secondary/30 hover:bg-restaurant-secondary hover:text-white transition-all duration-200 shadow-sm"
                >
                    <PencilSquareIcon className="w-4 h-4" /> 
                    <span>Editar</span>
                </Link>
            )
        }
    ], []);

    const fetchCajas = useCallback(async (page, search = '', status = '') => {
        setLoading(true);
        try {
            const response = await getCajas(page, search, status);
            const { content, currentPage, totalPages } = response.data;
            setCajas(content);
            setPaginationInfo({ currentPage, totalPages });
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al cargar las cajas.' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchCajas(1, searchTerm, statusFilter);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm, statusFilter, fetchCajas]);

    const executeToggleEstado = async () => {
        if (!cajaToToggle) return;
        const { id } = cajaToToggle;
        setCajaToToggle(null);
        try {
            await toggleCajaEstado(id);
            setAlert({ type: 'success', message: 'Estado de la caja actualizado correctamente.' });
            fetchCajas(paginationInfo.currentPage, searchTerm, statusFilter);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Error al cambiar estado';
            setAlert({ type: 'error', message: errorMsg });
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
    };

    // --- CONFIGURACIÓN DE FILTROS ---
    const filterConfig = [
        {
            id: 'search',
            label: 'Buscar Caja',
            type: 'text',
            placeholder: 'Nombre...',
            value: searchTerm,
            onChange: setSearchTerm
        },
        {
            id: 'status',
            label: 'Filtrar Estado',
            type: 'select',
            value: statusFilter,
            onChange: setStatusFilter,
            emptyLabel: 'Todas',
            options: [
                { value: '1', label: 'ACTIVAS' },
                { value: '0', label: 'INACTIVAS' },
            ]
        }
    ];

    if (loading && cajas.length === 0) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-restaurant-primary">Gestión de Cajas</h1>
                    <p className="text-sm text-gray-500 mt-1">Configura los puntos de venta físicos de tu sede.</p>
                </div>
                
                <Link 
                    to="/admin/agregar-caja" 
                    className="bg-restaurant-primary text-white px-5 py-2.5 rounded-lg hover:bg-red-900 transition-all shadow-md flex items-center gap-2 font-bold transform hover:-translate-y-0.5"
                >
                    <PlusCircleIcon className="w-5 h-5"/>
                    <span>Nueva Caja</span>
                </Link>
            </div>

            <AlertMessage 
                type={alert?.type} 
                message={alert?.message} 
                onClose={() => setAlert(null)} 
            />

            {cajaToToggle && (
                <ConfirmModal
                    message={`¿Estás seguro de cambiar el estado de la "${cajaToToggle.nombre}"? Si la inactivas, no podrá ser usada para abrir turnos.`}
                    onConfirm={executeToggleEstado}
                    onCancel={() => setCajaToToggle(null)}
                />
            )}
            
            <Table 
                columns={columns}
                data={cajas}
                loading={loading}
                filters={filterConfig}
                onClearFilters={clearFilters}
                pagination={{
                    currentPage: paginationInfo.currentPage,
                    totalPages: paginationInfo.totalPages,
                    onPageChange: (page) => fetchCajas(page, searchTerm, statusFilter)
                }}
            />
        </div>
    );
};

export default ListarCajas;