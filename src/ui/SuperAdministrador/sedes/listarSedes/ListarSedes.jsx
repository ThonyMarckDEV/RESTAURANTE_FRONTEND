import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getSedes, toggleSedeEstado } from 'services/sedeService'; 
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import Table from 'components/Shared/Tables/Table';
import { PencilSquareIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';

const ListarSedes = () => {
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [sedeToToggle, setSedeToToggle] = useState(null);
    const [sedes, setSedes] = useState([]);
    
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const [searchTerm, setSearchTerm] = useState('');

    const columns = useMemo(() => [
        {
            header: 'Nombre',
            render: (row) => (
                <div className="flex items-center gap-3">
                    {/* Icono con fondo 'surface' y color 'primary' */}
                    <div className="p-2 text-restaurant-primary rounded-lg shadow-sm border border-restaurant-secondary/30">
                        <BuildingStorefrontIcon className="w-5 h-5"/>
                    </div>
                    <div>
                        <span className="font-bold text-gray-800 block">{row.nombre}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Código SUNAT',
            render: (row) => row.codigo_sunat 
                ? <span className="font-mono text-restaurant-primary bg-red-50 px-2 py-1 rounded border border-red-100">{row.codigo_sunat}</span> 
                : <span className="text-gray-400 italic text-xs">Sin asignar</span>
        },
        {
            header: 'Dirección',
            render: (row) => <span className="text-sm text-gray-600 truncate max-w-xs block" title={row.direccion}>{row.direccion || 'Sin dirección'}</span>
        },
        {
            header: 'Estado',
            render: (row) => (
                <button 
                    onClick={() => setSedeToToggle({ id: row.id, estado: row.estado, esPrincipal: row.id === 1 })}
                    disabled={row.id === 1}
                    className={`px-3 py-1 font-bold text-xs rounded-full transition-all duration-200 shadow-sm border ${
                        row.estado === 1
                            ? 'text-emerald-700 bg-emerald-100 border-emerald-200 hover:bg-red-100 hover:text-red-700 hover:border-red-200'
                            : 'text-red-700 bg-red-50 border-red-100 hover:bg-emerald-100 hover:text-emerald-700 hover:border-emerald-200'
                    } ${row.id === 1 ? 'opacity-60 cursor-not-allowed hover:bg-emerald-100 hover:text-emerald-700' : ''}`}
                    title={row.id === 1 ? "La sede principal no se puede desactivar" : "Clic para cambiar estado"}
                >
                    {row.estado === 1 ? 'OPERATIVA' : 'CERRADA'}
                </button>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <Link 
                    to={`/superadmin/editar-sede/${row.id}`} 
                    className="group flex items-center gap-1 w-fit px-3 py-1.5 rounded-md text-sm font-medium text-restaurant-secondary bg-white border border-restaurant-secondary/30 hover:bg-restaurant-secondary hover:text-white transition-all duration-200"
                >
                    <PencilSquareIcon className="w-4 h-4" /> 
                    <span>Editar</span>
                </Link>
            )
        }
    ], []);

    const fetchSedes = useCallback(async (page, search = '') => {
        setLoading(true);
        try {
            const response = await getSedes(page, search);
            setSedes(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                totalPages: response.last_page,
                totalItems: response.total,
            });
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al cargar las sedes.' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { 
        fetchSedes(1, searchTerm); 
    }, [fetchSedes, searchTerm]);

    const executeToggleEstado = async () => {
        if (!sedeToToggle) return;
        
        if(sedeToToggle.esPrincipal) {
            setAlert({ type: 'warning', message: 'No se puede desactivar la Sede Principal.' });
            setSedeToToggle(null);
            return;
        }

        const nuevoEstado = sedeToToggle.estado === 1 ? 0 : 1;
        setSedeToToggle(null);
        setLoading(true);
        
        try {
            const response = await toggleSedeEstado(sedeToToggle.id, nuevoEstado);
            setAlert(response);
            await fetchSedes(paginationInfo.currentPage, searchTerm);
        } catch (err) {
            setAlert(err);
            setLoading(false);
        }
    };

    if (loading && sedes.length === 0) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-restaurant-primary">
                        Gestión de Sedes
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Administra tus locales y encargados</p>
                </div>
                
                <Link 
                    to="/superadmin/agregar-sede" 
                    className="bg-restaurant-primary text-white px-5 py-2.5 rounded-lg hover:bg-red-900 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-bold transform hover:-translate-y-0.5"
                >
                    <BuildingStorefrontIcon className="w-5 h-5"/>
                    <span>Nueva Sede</span>
                </Link>
            </div>

            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

            {sedeToToggle && (
                <ConfirmModal
                    message={`¿Estás seguro de cambiar el estado a ${sedeToToggle.estado === 1 ? 'CERRADA' : 'OPERATIVA'}? Esto afectará el acceso del personal.`}
                    onConfirm={executeToggleEstado}
                    onCancel={() => setSedeToToggle(null)}
                />
            )}
            
            <div className="overflow-hidden">
                <Table 
                    columns={columns}
                    data={sedes}
                    loading={loading}
                    pagination={{
                        currentPage: paginationInfo.currentPage,
                        totalPages: paginationInfo.totalPages,
                        onPageChange: (page) => fetchSedes(page, searchTerm)
                    }}
                    onSearch={setSearchTerm}
                    searchPlaceholder="Buscar por nombre o dirección..."
                />
            </div>
        </div>
    );
};

export default ListarSedes;