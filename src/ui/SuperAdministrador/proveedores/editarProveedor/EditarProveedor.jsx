import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showProveedor, updateProveedor } from 'services/proveedorService'; 
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import ProveedorForm from '../components/ProveedorForm';

const EditarProveedor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ razon_social: '', ruc: '', telefono: '', estado: 1 });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await showProveedor(id);
        setFormData({
          razon_social: response.data.razon_social,
          ruc: response.data.ruc,
          telefono: response.data.telefono,
          estado: response.data.estado
        });
      } catch (err) {
        setAlert({ type: 'error', message: 'No se pudo cargar el proveedor.' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProveedor(id, formData);
      setAlert({ type: 'success', message: 'Proveedor actualizado correctamente.' });
      setTimeout(() => navigate('/superadmin/listar-proveedores'), 1500);
    } catch (err) {
      const details = err.details ? Object.values(err.details).flat() : [];
      setAlert({ type: 'error', message: err.message, details });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.razon_social) return <LoadingScreen />;

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <div className="flex justify-between items-center mb-8 border-b-2 border-restaurant-secondary/20 pb-4">
          <h1 className="text-3xl font-serif font-bold text-restaurant-primary">Editar Proveedor</h1>
          <button onClick={() => navigate('/superadmin/listar-proveedores')} className="text-restaurant-secondary font-bold">← Volver</button>
      </div>
      <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
      <form onSubmit={handleSubmit}>
          <ProveedorForm formData={formData} onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} />
          <div className="flex justify-center mt-8">
            <button disabled={loading} className="px-10 py-3 text-white bg-restaurant-primary rounded-lg font-bold shadow-lg">
                {loading ? 'Guardando...' : 'GUARDAR CAMBIOS'}
            </button>
          </div>
      </form>
    </div>
  );
};

export default EditarProveedor;