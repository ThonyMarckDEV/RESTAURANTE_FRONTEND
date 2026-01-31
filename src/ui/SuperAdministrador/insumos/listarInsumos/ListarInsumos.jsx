import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getInsumos, toggleInsumoEstado } from 'services/insumoService'; 
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import Table from 'components/Shared/Tables/Table'; 
import CategoriaSearchSelect from 'components/Shared/Comboboxes/CategoriaSearchSelect';
import { PencilSquareIcon, ArchiveBoxIcon, TagIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import jwtUtils from 'utilities/Token/jwtUtils';

const ListarInsumos = () => {
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [itemToToggle, setItemToToggle] = useState(null);
    const [insumos, setInsumos] = useState([]);
    
    const access_token = jwtUtils.getAccessTokenFromCookie();
    const userRole = jwtUtils.getUserRole(access_token) || null; 
    
    const isRestricted = userRole === 'admin'; 

    const [selectedCategoryObj, setSelectedCategoryObj] = useState(null);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });

    const [filters, setFilters] = useState({
        search: '',
        unidad: '',
        estado: '',
        categoriaId: '', 
        minPrecio: '',
        maxPrecio: ''
    });

    // --- CONFIGURACIÓN DE FILTROS ---
    const filtersList = useMemo(() => [
        {
            id: 'search',
            label: 'Nombre / Código',
            type: 'text',
            value: filters.search,
            placeholder: 'Buscar insumo...',
            onChange: (val) => setFilters(prev => ({ ...prev, search: val }))
        },
        {
            id: 'categoriaId',
            label: 'Categoría',
            component: (
                <CategoriaSearchSelect 
                    categoryTypes={[1]} 
                    initialValue={selectedCategoryObj}
                    onSelect={(cat) => {
                        setSelectedCategoryObj(cat);
                        setFilters(prev => ({ ...prev, categoriaId: cat ? cat.id : '' }));
                    }}
                />
            )
        },
        {
            id: 'unidad',
            label: 'Unidad',
            type: 'select',
            value: filters.unidad,
            onChange: (val) => setFilters(prev => ({ ...prev, unidad: val })),
            options: [
                { value: 'KG', label: 'KILOGRAMOS (KG)' },
                { value: 'LT', label: 'LITROS (LT)' },
                { value: 'UNIDAD', label: 'UNIDADES (UNIDAD)' },
                { value: 'PAQUETE', label: 'PAQUETE' },
                { value: 'LATA', label: 'LATA' }
            ]
        },
        {
            id: 'estado',
            label: 'Estado',
            type: 'select',
            value: filters.estado,
            onChange: (val) => setFilters(prev => ({ ...prev, estado: val })),
            options: [
                { value: '1', label: 'ACTIVOS' },
                { value: '0', label: 'INACTIVOS' }
            ]
        },
        {
            id: 'minPrecio',
            label: 'Min Costo',
            type: 'text',
            value: filters.minPrecio,
            placeholder: '0.00',
            onChange: (val) => setFilters(prev => ({ ...prev, minPrecio: val }))
        },
        {
            id: 'maxPrecio',
            label: 'Max Costo',
            type: 'text',
            value: filters.maxPrecio,
            placeholder: '0.00',
            onChange: (val) => setFilters(prev => ({ ...prev, maxPrecio: val }))
        }
    ], [filters, selectedCategoryObj]);

    // --- COLUMNAS (DINÁMICAS SEGÚN ROL) ---
    const columns = useMemo(() => {
        const baseColumns = [
            {
                header: 'Insumo',
                accessor: 'nombre',
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
            {
                header: 'Stock Min.',
                render: (row) => (
                    <span className="font-bold text-gray-700">
                        {row.stock_minimo} {row.unidad_medida}
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
                        onClick={isRestricted ? undefined : () => setItemToToggle(row)}
                        disabled={isRestricted}
                        className={`px-3 py-1 font-bold text-xs rounded-full border transition-all ${
                            row.estado === 1 ? 'text-emerald-700 bg-emerald-100 border-emerald-200' : 'text-red-700 bg-red-50 border-red-100'
                        } ${isRestricted ? 'cursor-default opacity-80' : 'hover:scale-105'}`}
                    >
                        {row.estado === 1 ? 'ACTIVO' : 'INACTIVO'}
                    </button>
                )
            }
        ];

        // SOLO AGREGAMOS LA COLUMNA ACCIONES SI NO ES ADMIN (RESTRINGIDO)
        if (!isRestricted) {
            baseColumns.push({
                header: 'Acciones',
                render: (row) => (
                    <Link 
                        to={`/superadmin/editar-insumo/${row.id}`} 
                        className="w-fit flex items-center gap-1 px-3 py-1 text-sm font-medium text-restaurant-secondary border border-restaurant-secondary/30 rounded hover:bg-restaurant-secondary hover:text-white transition-colors"
                    >
                        <PencilSquareIcon className="w-4 h-4" /> Editar
                    </Link>
                )
            });
        }

        return baseColumns;
    }, [isRestricted]); // Dependencia importante: isRestricted

    // --- FETCH DATA ---
    const fetchInsumos = useCallback(async (page, currentFilters) => {
        setLoading(true);
        try {
            const response = await getInsumos(page, currentFilters);
            setInsumos(response.data.content);
            setPaginationInfo({ currentPage: response.data.currentPage, totalPages: response.data.totalPages });
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al cargar los insumos.' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchInsumos(1, filters);
        }, 500);
        return () => clearTimeout(handler);
    }, [filters, fetchInsumos]);

    const clearFilters = () => {
        setFilters({ search: '', unidad: '', estado: '', categoriaId: '', minPrecio: '', maxPrecio: '' });
        setSelectedCategoryObj(null);
    };

    const handleToggle = async () => {
        const id = itemToToggle.id;
        setItemToToggle(null);
        try {
            await toggleInsumoEstado(id);
            fetchInsumos(paginationInfo.currentPage, filters);
            setAlert({ type: 'success', message: 'Estado actualizado.' });
        } catch (err) { setAlert({ type: 'error', message: 'Error al cambiar estado.' }); }
    };

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-restaurant-primary">Insumos</h1>
                    <p className="text-sm text-gray-500 mt-1">Gestión de materia prima</p>
                </div>
                
                {/* SOLO MOSTRAMOS EL BOTÓN SI NO ES RESTRINGIDO */}
                {!isRestricted && (
                    <Link to="/superadmin/agregar-insumo" className="bg-restaurant-primary text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-md hover:bg-red-900 transition-colors">
                        <ArchiveBoxIcon className="w-5 h-5"/> Nuevo Insumo
                    </Link>
                )}
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
                columns={columns} 
                data={insumos} 
                loading={loading}
                filters={filtersList} 
                onClearFilters={clearFilters}
                pagination={{ 
                    currentPage: paginationInfo.currentPage, 
                    totalPages: paginationInfo.totalPages, 
                    onPageChange: (page) => fetchInsumos(page, filters) 
                }}
            />
        </div>
    );
};

export default ListarInsumos;