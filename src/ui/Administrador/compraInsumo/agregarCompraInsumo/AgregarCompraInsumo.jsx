import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { createCompraInsumo } from 'services/compraInsumoService';
import CompraInsumoForm from '../components/CompraInsumoForm';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

const AgregarCompraInsumo = () => {
  const navigate = useNavigate();
  
  // --- ESTADO INICIAL DEL FORMULARIO ---
  const [formData, setFormData] = useState({
    proveedorObj: null,  
    almacenObj: null,    
    detalles: []        
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async () => {
    // 1. Validaciones previas al envío
    if (!formData.proveedorObj) {
        setAlert({ type: 'error', message: 'Debe seleccionar un proveedor.' });
        return;
    }
    if (!formData.almacenObj) {
        setAlert({ type: 'error', message: 'Debe seleccionar un almacén de destino.' });
        return;
    }
    if (formData.detalles.length === 0) {
        setAlert({ type: 'error', message: 'La compra debe tener al menos un insumo.' });
        return;
    }

    setLoading(true);
    setAlert(null);

    // 2. Preparar Payload para el Backend (DTO)
    const payload = {
        proveedor_id: formData.proveedorObj.id,
        almacen_id: formData.almacenObj.id,
        detalles: formData.detalles.map(item => ({
            insumo_id: item.insumo_id,
            cantidad: item.cantidad,
            precio: item.precio
        }))
    };

    try {
      await createCompraInsumo(payload);
      setAlert({ type: 'success', message: 'Compra registrada y stock actualizado correctamente.' });
      
      // Resetear o redirigir
      setTimeout(() => navigate('/admin/listar-compras-insumos'), 2000);
      
    } catch (err) {
        let message = 'Ocurrió un error al procesar la compra.';
        let details = [];
        if (err.details) {
            message = "Error de validación:";
            details = Object.values(err.details).flat();
        } else if (err.message) {
            message = err.message;
        }
        setAlert({ type: 'error', message: message, details: details });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 border-b-2 border-restaurant-secondary/20 pb-4">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-restaurant-primary/10 rounded-lg text-restaurant-primary">
                <ShoppingBagIcon className="w-8 h-8"/>
             </div>
             <div>
                 <h1 className="text-3xl font-serif font-bold text-restaurant-primary">Nueva Compra</h1>
                 <p className="text-sm text-gray-500">Registra ingreso de stock de insumos</p>
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
          />

          <div className="flex justify-end mt-8 pb-10">
            <button 
                onClick={handleSubmit}
                disabled={loading} 
                className="px-10 py-3 text-white bg-restaurant-primary rounded-lg font-bold shadow-lg hover:bg-red-900 disabled:opacity-70 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
            >
                {loading ? 'Procesando...' : (
                    <>
                        <ShoppingBagIcon className="w-5 h-5" />
                        FINALIZAR COMPRA
                    </>
                )}
            </button>
          </div>
      </div>
    </div>
  );
};
 
export default AgregarCompraInsumo;