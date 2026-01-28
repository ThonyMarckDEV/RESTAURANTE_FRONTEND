import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { createAlmacen } from 'services/almacenService';
import AlmacenForm from '../components/AlmacenForm';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

const AgregarAlmacen = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
    nombre: '', 
    descripcion: '', 
    tipo_almacen: 1,
    estado: 1 
  });
  
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = (name === 'tipo_almacen' || name === 'estado') ? parseInt(value) : value;
    
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      await createAlmacen(formData);
      setAlert({ type: 'success', message: 'Almacén creado correctamente en tu sede.' });
      setTimeout(() => navigate('/admin/listar-almacenes'), 1500);
    } catch (err) {
      const details = err.details ? Object.values(err.details).flat() : [];
      setAlert({ type: 'error', message: err.message || 'Error al crear', details });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <div className="flex justify-between items-center mb-8 border-b-2 border-restaurant-secondary/20 pb-4">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-restaurant-primary/10 rounded-lg text-restaurant-primary">
                <PlusCircleIcon className="w-8 h-8"/>
             </div>
             <div>
                 <h1 className="text-3xl font-serif font-bold text-restaurant-primary">Nuevo Almacén</h1>
                 <p className="text-sm text-gray-500">Crea un nuevo espacio para controlar tu inventario.</p>
             </div>
          </div>
          <button onClick={() => navigate('/admin/listar-almacenes')} className="text-restaurant-secondary font-bold hover:text-restaurant-primary transition-colors">
            ← Cancelar
          </button>
      </div>

      <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
      
      <form onSubmit={handleSubmit}>
          <AlmacenForm formData={formData} onChange={handleChange} />
          <div className="flex justify-center mt-8 pb-10">
            <button disabled={loading} className="px-10 py-3 text-white bg-restaurant-primary rounded-lg font-bold shadow-lg hover:bg-red-900 transition-all transform hover:-translate-y-0.5">
              {loading ? 'Procesando...' : 'REGISTRAR ALMACÉN'}
            </button>
          </div>
      </form>
    </div>
  );
};

export default AgregarAlmacen;