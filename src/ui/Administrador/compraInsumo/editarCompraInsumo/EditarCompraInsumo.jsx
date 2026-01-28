import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { showCompraInsumo, updateCompraInsumo } from 'services/compraInsumoService';
import CompraInsumoForm from '../components/CompraInsumoForm';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

const EditarCompraInsumo = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        proveedorObj: null,
        almacenObj: null,
        detalles: []
    });

    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);

    // 1. CARGAR DATOS
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await showCompraInsumo(id);
                const data = response.data;

                setFormData({
                    proveedorObj: { id: data.proveedor_id || data.proveedorId, nombre: data.proveedor }, 
                    
                    almacenObj: { id: data.almacen_id || data.almacenId, nombre: data.almacen || 'Almacén Actual' }, 
                    
                    detalles: data.detalles.map(d => ({
                        insumo_id: d.insumo_id || d.insumoId,
                        nombre_insumo: d.insumo,
                        unidad_medida: d.unidad,
                        cantidad: d.cantidad,
                        precio: d.precio,
                        subtotal: d.subtotal
                    }))
                });
            } catch (err) {
                setAlert({ type: 'error', message: 'No se pudo cargar la compra.' });
                setTimeout(() => navigate('/admin/listar-compras-insumos'), 2000);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    // 2. GUARDAR CAMBIOS
    const handleSubmit = async () => {
        // Validaciones básicas
        if (!formData.proveedorObj) return setAlert({ type: 'error', message: 'Falta el proveedor' });
        if (formData.detalles.length === 0) return setAlert({ type: 'error', message: 'Debe haber al menos un insumo' });

        setLoading(true);
        setAlert(null);

        // Armar Payload
        const payload = {
            proveedor_id: formData.proveedorObj.id,
            almacen_id: formData.almacenObj.id,
            detalles: formData.detalles.map(d => ({
                insumo_id: d.insumo_id,
                cantidad: d.cantidad,
                precio: d.precio
            }))
        };

        try {
            await updateCompraInsumo(id, payload);
            setAlert({ type: 'success', message: 'Compra corregida y stock actualizado correctamente.' });
            setTimeout(() => navigate('/admin/listar-compras-insumos'), 2000);
        } catch (err) {
            const msg = err.message || 'Error al actualizar.';
            setAlert({ type: 'error', message: msg, details: err.details });
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <div className="flex justify-between items-center mb-8 border-b-2 border-restaurant-secondary/20 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-restaurant-primary/10 rounded-lg text-restaurant-primary">
                        <PencilSquareIcon className="w-8 h-8"/>
                    </div>
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-restaurant-primary">Editar Compra #{String(id).padStart(6,'0')}</h1>
                        <p className="text-sm text-gray-500">Corrige cantidades o precios (Solo mismo día)</p>
                    </div>
                </div>
                <button 
                    onClick={() => navigate('/admin/listar-compras-insumos')} 
                    className="text-restaurant-secondary hover:text-restaurant-primary font-bold transition-colors"
                >
                    ← Cancelar
                </button>
            </div>

            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <div className="max-w-5xl mx-auto">
                <CompraInsumoForm 
                    formData={formData}
                    setFormData={setFormData}
                    isViewOnly={false}
                    isAlmacenLocked={true} // <--- AQUÍ BLOQUEAMOS EL ALMACÉN
                />

                <div className="flex justify-end mt-8 pb-10">
                    <button 
                        onClick={handleSubmit}
                        disabled={loading} 
                        className="px-10 py-3 text-white bg-restaurant-primary rounded-lg font-bold shadow-lg hover:bg-red-900 disabled:opacity-70 transition-all flex items-center gap-2"
                    >
                        {loading ? 'Guardando...' : 'GUARDAR CORRECCIÓN'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditarCompraInsumo;