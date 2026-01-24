import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getCategorias, toggleCategoriaEstado } from 'services/categoriaService'; 
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import Table from 'components/Shared/Tables/Table';
import { PencilSquareIcon, TagIcon } from '@heroicons/react/24/outline';

const ListarCategorias = () => {
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [catToToggle, setCatToToggle] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
    const [searchTerm, setSearchTerm] = useState('');

    const columns = useMemo(() => [
        {
            header: 'Categoría',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 text-restaurant-primary bg-restaurant-surface rounded-lg">
                        <TagIcon className="w-5 h-5"/>
                    </div>
                    <span className="font-bold text-gray-800">{row.nombre}</span>
                </div>
            )
        },
        {
            header: 'Estado',
            render: (row) => (
                <button 
                    onClick={() => setCatToToggle(row)}
                    className={`px-3 py-1 font-bold text-xs rounded-full border ${
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
                <div className="flex justify-start">
                    <Link 
                        to={`/superadmin/editar-categoria/${row.id}`} 
                        className="group flex items-center gap-1.5 w-fit px-3 py-1.5 rounded-md text-sm font-medium text-restaurant-secondary bg-white border border-restaurant-secondary/30 hover:bg-restaurant-secondary hover:text-white transition-all duration-200 shadow-sm"
                    >
                        <PencilSquareIcon className="w-4 h-4" /> 
                        <span>Editar</span>
                    </Link>
                </div>
            )
        }
    ], []);

    const fetchCategorias = useCallback(async (page, search = '') => {
        setLoading(true);
        try {
            const response = await getCategorias(page, search);
            setCategorias(response.data.content);
            setPaginationInfo({ currentPage: response.data.currentPage, totalPages: response.data.totalPages });
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al cargar datos.' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => fetchCategorias(1, searchTerm), 500);
        return () => clearTimeout(handler);
    }, [searchTerm, fetchCategorias]);

    const handleToggle = async () => {
        const id = catToToggle.id;
        setCatToToggle(null);
        try {
            await toggleCategoriaEstado(id);
            fetchCategorias(paginationInfo.currentPage, searchTerm);
            setAlert({ type: 'success', message: 'Estado actualizado.' });
        } catch (err) { setAlert({ type: 'error', message: 'Error al cambiar estado.' }); }
    };

    if (loading && categorias.length === 0) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif font-bold text-restaurant-primary">Categorías de Productos</h1>
                <Link to="/superadmin/agregar-categoria" className="bg-restaurant-primary text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2">
                    <TagIcon className="w-5 h-5"/> Nueva Categoría
                </Link>
            </div>
            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />
            {catToToggle && <ConfirmModal message={`¿Cambiar estado de ${catToToggle.nombre}?`} onConfirm={handleToggle} onCancel={() => setCatToToggle(null)} />}
            <Table 
                columns={columns} data={categorias} loading={loading}
                pagination={{ currentPage: paginationInfo.currentPage, totalPages: paginationInfo.totalPages, onPageChange: (page) => fetchCategorias(page, searchTerm) }}
                onSearch={setSearchTerm} searchPlaceholder="Buscar categoría..."
            />
        </div>
    );
};

export default ListarCategorias;