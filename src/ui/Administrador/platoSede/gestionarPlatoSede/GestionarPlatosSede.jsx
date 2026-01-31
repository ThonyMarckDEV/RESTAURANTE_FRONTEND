import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getPlatosPorSede, asignarPlatoASede, eliminarPlatoDeSede } from 'services/platoSedeService';
import PlatoSearchSelect from 'components/Shared/Comboboxes/PlatoSearchSelect';
import CategoriaSearchSelect from 'components/Shared/Comboboxes/CategoriaSearchSelect';
import Table from 'components/Shared/Tables/Table';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { TrashIcon, PlusIcon, FireIcon, TagIcon } from '@heroicons/react/24/outline';
import jwtUtils from 'utilities/Token/jwtUtils';

const GestionarPlatosSede = () => {
    const [loading, setLoading] = useState(true);
    const [platosSede, setPlatosSede] = useState([]);
    const [alert, setAlert] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    
    // Estado de Paginación
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });

    // Estado de Filtros
    const [selectedCategoryObj, setSelectedCategoryObj] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        categoriaId: '', 
        minPrecio: '',
        maxPrecio: ''
    });

    const access_token = jwtUtils.getAccessTokenFromCookie();
    const sedeId = jwtUtils.getSedeId(access_token);

    // --- CONFIGURACIÓN DE FILTROS ---
    const filtersList = useMemo(() => [
        {
            id: 'search',
            label: 'Buscar en Menú',
            type: 'text',
            value: filters.search,
            placeholder: 'Nombre del plato...',
            onChange: (val) => setFilters(prev => ({ ...prev, search: val }))
        },
        {
            id: 'categoriaId',
            label: 'Categoría',
            component: (
                <CategoriaSearchSelect 
                    categoryTypes={[3]} // 3 = PLATOS
                    initialValue={selectedCategoryObj}
                    onSelect={(cat) => {
                        setSelectedCategoryObj(cat);
                        setFilters(prev => ({ ...prev, categoriaId: cat ? cat.id : '' }));
                    }}
                />
            )
        },
        {
            id: 'minPrecio',
            label: 'Min Precio',
            type: 'text',
            value: filters.minPrecio,
            placeholder: '0.00',
            onChange: (val) => setFilters(prev => ({ ...prev, minPrecio: val }))
        },
        {
            id: 'maxPrecio',
            label: 'Max Precio',
            type: 'text',
            value: filters.maxPrecio,
            placeholder: '0.00',
            onChange: (val) => setFilters(prev => ({ ...prev, maxPrecio: val }))
        }
    ], [filters, selectedCategoryObj]);

    // Función de carga única y eficiente
    const fetchDatosTabla = useCallback(async (page = 1, currentFilters = filters) => {
        if (!sedeId) return;
        setLoading(true);
        try {
            const res = await getPlatosPorSede(sedeId, page, currentFilters); 
            setPlatosSede(res.data.content || []);
            setPaginationInfo({
                currentPage: res.data.currentPage,
                totalPages: res.data.totalPages
            });
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al cargar el menú de la sede.' });
        } finally {
            setLoading(false);
        }
    }, [sedeId]); // Dependencia mínima

    // Efecto Debounce para evitar peticiones masivas al escribir
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchDatosTabla(1, filters);
        }, 500);
        return () => clearTimeout(handler);
    }, [filters, fetchDatosTabla]);

    const clearFilters = () => {
        setFilters({ search: '', categoriaId: '', minPrecio: '', maxPrecio: '' });
        setSelectedCategoryObj(null);
    };

    const handleAddPlato = async (plato) => {
        if (!plato || !sedeId) return;
        try {
            await asignarPlatoASede(sedeId, plato.id);
            setAlert({ type: 'success', message: 'Plato añadido correctamente.' });
            fetchDatosTabla(paginationInfo.currentPage, filters); 
        } catch (err) {
            setAlert({ type: 'error', message: 'El plato ya existe en esta sede.' });
        }
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        const id = itemToDelete.id;
        setItemToDelete(null);
        try {
            await eliminarPlatoDeSede(id);
            setAlert({ type: 'success', message: 'Plato retirado de la sede.' });
            fetchDatosTabla(paginationInfo.currentPage, filters);
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al intentar retirar el plato.' });
        }
    };

    const columns = useMemo(() => [
        {
            header: 'Plato',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg">
                        <FireIcon className="w-5 h-5 text-restaurant-primary" />
                    </div>
                    <div>
                        <p className="font-bold text-gray-800">{row.platoNombre}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                            <TagIcon className="w-3 h-3" />
                            {row.categoriaNombre}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Precio Sede',
            render: (row) => (
                <span className="text-emerald-700 font-bold font-mono text-base">
                    S/ {parseFloat(row.precioVenta || 0).toFixed(2)}
                </span>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <button 
                    onClick={() => setItemToDelete(row)} 
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all hover:scale-110"
                    title="Quitar plato"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            )
        }
    ], []);

    if (!sedeId) return <AlertMessage type="error" message="No se encontró una sede válida en tu sesión." />;

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-restaurant-primary">Gestión de Menú</h1>
                    <p className="text-sm text-gray-500 mt-1">Configura los platos disponibles para esta sede</p>
                </div>
            </div>

            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

            {itemToDelete && (
                <ConfirmModal 
                    message={`¿Estás seguro de quitar "${itemToDelete.platoNombre}" del menú de esta sede?`} 
                    onConfirm={handleDelete} 
                    onCancel={() => setItemToDelete(null)}
                    confirmText="Sí, quitar"
                />
            )}

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8">
                <div className="flex items-center gap-2 mb-4 text-restaurant-primary font-bold">
                    <PlusIcon className="w-5 h-5" />
                    <span>Agregar plato del catálogo</span>
                </div>
                <div className="max-w-md">
                    <PlatoSearchSelect 
                        onSelect={handleAddPlato}
                        sedeId={sedeId}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <Table 
                    columns={columns} 
                    data={platosSede} 
                    loading={loading}
                    filters={filtersList}
                    onClearFilters={clearFilters}
                    pagination={{ 
                        currentPage: paginationInfo.currentPage, 
                        totalPages: paginationInfo.totalPages, 
                        onPageChange: (page) => fetchDatosTabla(page, filters) 
                    }}
                />
            </div>
        </div>
    );
};

export default GestionarPlatosSede;