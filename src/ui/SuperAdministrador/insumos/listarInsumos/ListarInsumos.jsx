import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getInsumos, toggleInsumoEstado } from 'services/insumoService'; 
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import Table from 'components/Shared/Tables/Table';
import { PencilSquareIcon, ArchiveBoxIcon, TagIcon, QrCodeIcon } from '@heroicons/react/24/outline';

const ListarInsumos = () => {
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [itemToToggle, setItemToToggle] = useState(null);
    const [insumos, setInsumos] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
    const [searchTerm, setSearchTerm] = useState('');

    const columns = useMemo(() => [
        {
            header: 'Insumo',
            render: (row) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <ArchiveBoxIcon className="w-5 h-5 text-restaurant-primary"/>
                        <span className="font-bold text-gray-800">{row.nombre}</span>
                    </div>
                    {row.codigo_interno && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 ml-7">
                            <QrCodeIcon className="w-3 h-3"/> {row.codigo_interno}
                        </div>
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
        // --- CAMBIO: COLUMNA 1 (SOLO UNIDAD) ---
        {
            header: 'Unidad',
            render: (row) => (
                <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                    {row.unidad_medida}
                </span>
            )
        },
        // --- CAMBIO: COLUMNA 2 (STOCK MIN CONCATENADO) ---
        {
            header: 'Stock Mín.',
            render: (row) => (
                <span className="font-bold text-gray-700">
                    {/* parseFloat quita los decimales .00 innecesarios */}
                    {parseFloat(row.stock_minimo)} <span className="text-xs font-normal text-gray-500">{row.unidad_medida}</span>
                </span>
            )
        },
        {
            header: 'Costo Prom.',
            render: (row) => (
                <span className="font-mono text-gray-700">
                    S/ {parseFloat(row.precio_compra_promedio).toFixed(2)}
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
                        to={`/superadmin/editar-insumo/${row.id}`} 
                        className="group flex items-center gap-1.5 w-fit px-3 py-1.5 rounded-md text-sm font-medium text-restaurant-secondary bg-white border border-restaurant-secondary/30 hover:bg-restaurant-secondary hover:text-white transition-all duration-200 shadow-sm"
                    >
                        <PencilSquareIcon className="w-4 h-4" /> 
                        <span>Editar</span>
                    </Link>
                </div>
            )
        }
    ], []);

    const fetchInsumos = useCallback(async (page, search = '') => {
        setLoading(true);
        try {
            const response = await getInsumos(page, search);
            setInsumos(response.data.content);
            setPaginationInfo({ currentPage: response.data.currentPage, totalPages: response.data.totalPages });
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al cargar los insumos.' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => fetchInsumos(1, searchTerm), 500);
        return () => clearTimeout(handler);
    }, [searchTerm, fetchInsumos]);

    const handleToggle = async () => {
        const id = itemToToggle.id;
        setItemToToggle(null);
        try {
            await toggleInsumoEstado(id);
            fetchInsumos(paginationInfo.currentPage, searchTerm);
            setAlert({ type: 'success', message: 'Estado del insumo actualizado.' });
        } catch (err) { setAlert({ type: 'error', message: 'Error al cambiar estado.' }); }
    };

    if (loading && insumos.length === 0) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-restaurant-primary">Insumos</h1>
                    <p className="text-sm text-gray-500 mt-1">Gestión de materia prima y costos</p>
                </div>
                <Link to="/superadmin/agregar-insumo" className="bg-restaurant-primary text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-md hover:bg-red-900 transition-colors">
                    <ArchiveBoxIcon className="w-5 h-5"/> Nuevo Insumo
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
                columns={columns} data={insumos} loading={loading}
                pagination={{ currentPage: paginationInfo.currentPage, totalPages: paginationInfo.totalPages, onPageChange: (page) => fetchInsumos(page, searchTerm) }}
                onSearch={setSearchTerm} searchPlaceholder="Buscar insumo..."
            />
        </div>
    );
};

export default ListarInsumos;