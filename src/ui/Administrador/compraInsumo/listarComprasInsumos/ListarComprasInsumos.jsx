import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getComprasInsumos, showCompraInsumo } from 'services/compraInsumoService'; 
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import Table from 'components/Shared/Tables/Table';
import ViewModal from 'components/Shared/Modals/ViewModal';
import { EyeIcon, ShoppingBagIcon, CalendarIcon, UserIcon, CalculatorIcon } from '@heroicons/react/24/outline';
import { formatDate, formatMoney } from 'utilities/Formatters/formatters';

const ListarComprasInsumos = () => {
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [compras, setCompras] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
    
    // --- ESTADOS PARA MODAL DE DETALLE ---
    const [selectedCompra, setSelectedCompra] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);

    // --- FILTROS ---
    const [filters, setFilters] = useState({
        search: '',
        fechaInicio: '',
        fechaFin: ''
    });

    const filtersList = useMemo(() => [
        {
            id: 'search',
            label: 'Buscar Proveedor',
            type: 'text',
            value: filters.search,
            placeholder: 'Razón Social...',
            onChange: (val) => setFilters(prev => ({ ...prev, search: val }))
        },
        {
            id: 'fechaInicio',
            label: 'Desde',
            type: 'date',
            value: filters.fechaInicio,
            onChange: (val) => setFilters(prev => ({ ...prev, fechaInicio: val }))
        },
        {
            id: 'fechaFin',
            label: 'Hasta',
            type: 'date',
            value: filters.fechaFin,
            onChange: (val) => setFilters(prev => ({ ...prev, fechaFin: val }))
        }
    ], [filters]);

    // --- COLUMNAS ---
    const columns = useMemo(() => [
        {
            header: 'Código',
            render: (row) => <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">#{String(row.id).padStart(6, '0')}</span>
        },
        {
            header: 'Proveedor',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-gray-400"/>
                    <span className="font-bold text-gray-700 text-sm">{row.proveedor}</span>
                </div>
            )
        },
        {
            header: 'Fecha Compra',
            render: (row) => (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarIcon className="w-4 h-4 text-restaurant-secondary"/>
                    <span>{formatDate(row.fecha_compra)}</span> 
                </div>
            )
        },
        {
            header: 'Total',
            render: (row) => (
                <span className="text-emerald-700 font-black font-mono text-sm">
                    {formatMoney(row.total)}
                </span>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <button 
                    onClick={() => handleViewDetails(row.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                    <EyeIcon className="w-4 h-4" /> 
                    Ver Detalle
                </button>
            )
        }
    ], []);

    // --- LOGICA DE DATOS ---
    const fetchCompras = useCallback(async (page, currentFilters) => {
        setLoading(true);
        try {
            const response = await getComprasInsumos(
                page, 
                currentFilters.search, 
                currentFilters.fechaInicio,
                currentFilters.fechaFin
            );
            const { content, currentPage, totalPages } = response.data;
            setCompras(content);
            setPaginationInfo({ currentPage, totalPages });
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al cargar el historial de compras.' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchCompras(1, filters);
        }, 500);
        return () => clearTimeout(handler);
    }, [filters, fetchCompras]);

    // --- LOGICA MODAL ---
    const handleViewDetails = async (id) => {
        setShowModal(true);
        setLoadingModal(true);
        try {
            const response = await showCompraInsumo(id);
            setSelectedCompra(response.data);
        } catch (error) {
            setAlert({ type: 'error', message: 'No se pudo cargar el detalle de la compra.' });
            setShowModal(false);
        } finally {
            setLoadingModal(false);
        }
    };

    const clearFilters = () => {
        setFilters({ search: '', fechaInicio: '', fechaFin: '' });
    };

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-restaurant-primary">Historial de Compras</h1>
                    <p className="text-sm text-gray-500 mt-1">Consulta los ingresos de insumos al almacén.</p>
                </div>
                
                <Link 
                    to="/admin/agregar-compra-insumo" 
                    className="bg-restaurant-primary text-white px-5 py-2.5 rounded-lg hover:bg-red-900 transition-all shadow-md flex items-center gap-2 font-bold transform hover:-translate-y-0.5"
                >
                    <ShoppingBagIcon className="w-5 h-5"/>
                    <span>Registrar Compra</span>
                </Link>
            </div>

            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

            <Table 
                columns={columns}
                data={compras}
                loading={loading}
                filters={filtersList}
                onClearFilters={clearFilters}
                pagination={{
                    currentPage: paginationInfo.currentPage,
                    totalPages: paginationInfo.totalPages,
                    onPageChange: (page) => fetchCompras(page, filters)
                }}
            />

            {/* --- MODAL DE DETALLE (USANDO TU COMPONENTE REUTILIZABLE) --- */}
            <ViewModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Detalle de Compra de Insumos"
                isLoading={loadingModal}
            >
                {selectedCompra && (
                    <div className="space-y-6">
                        {/* 1. Cabecera del Resumen */}
                        <div className="grid grid-cols-2 gap-4 text-sm bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <div>
                                <p className="text-blue-400 text-xs uppercase font-bold tracking-wider">Proveedor</p>
                                <p className="font-bold text-gray-800 text-base">{selectedCompra.proveedor}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-blue-400 text-xs uppercase font-bold tracking-wider">Fecha de Emisión</p>
                                <p className="font-medium text-gray-700">{formatDate(selectedCompra.fecha_compra)}</p>
                            </div>
                            <div>
                                <p className="text-blue-400 text-xs uppercase font-bold tracking-wider">ID Interno</p>
                                <p className="font-mono text-gray-600">#{String(selectedCompra.id).padStart(6, '0')}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-blue-400 text-xs uppercase font-bold tracking-wider">Monto Total</p>
                                <p className="font-black text-emerald-600 text-xl">{formatMoney(selectedCompra.total)}</p>
                            </div>
                        </div>

                        {/* 2. Tabla de Items */}
                        <div>
                            <h4 className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 border-b pb-2">
                                <CalculatorIcon className="w-4 h-4"/>
                                Items Adquiridos
                            </h4>
                            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider font-semibold">
                                        <tr>
                                            <th className="px-4 py-3 text-left">Descripción</th>
                                            <th className="px-4 py-3 text-center">Cant.</th>
                                            <th className="px-4 py-3 text-right">P. Unit</th>
                                            <th className="px-4 py-3 text-right">Importe</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {selectedCompra.detalles.map((det, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 font-medium text-gray-800">{det.insumo}</td>
                                                <td className="px-4 py-3 text-center text-gray-600 font-mono">{det.cantidad}</td>
                                                <td className="px-4 py-3 text-right text-gray-500">{formatMoney(det.precio)}</td>
                                                <td className="px-4 py-3 text-right font-bold text-gray-800">{formatMoney(det.subtotal)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </ViewModal>
        </div>
    );
};

export default ListarComprasInsumos;