import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showAlmacen, updateAlmacen } from 'services/almacenService'; 
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlmacenForm from '../components/AlmacenForm';

const EditarAlmacen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    nombre: '', descripcion: '', esRefrigerado: false, estado: 1 
  });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await showAlmacen(id);
        const data = response.data;
        // Solo cargamos los datos editables
        setFormData({
          nombre: data.nombre,
          descripcion: data.descripcion,
          esRefrigerado: data.es_refrigerado,
          estado: data.estado
        });
      } catch (err) {
        setAlert({ type: 'error', message: 'No se pudo cargar la información.' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === 'esRefrigerado' ? (value === 'true') : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateAlmacen(id, formData);
      setAlert({ type: 'success', message: 'Almacén actualizado.' });
      setTimeout(() => navigate('/admin/listar-almacenes'), 1500);
    } catch (err) {
        const details = err.details ? Object.values(err.details).flat() : [];
        setAlert({ type: 'error', message: err.message || 'Error al actualizar', details });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <div className="flex justify-between items-center mb-8 border-b-2 border-restaurant-secondary/20 pb-4">
          <h1 className="text-3xl font-serif font-bold text-restaurant-primary">Editar Almacén</h1>
          <button onClick={() => navigate('/admin/listar-almacenes')} className="text-restaurant-secondary font-bold">← Volver</button>
      </div>
      <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
      
      <form onSubmit={handleSubmit}>
          <AlmacenForm formData={formData} onChange={handleChange} />
          <div className="flex justify-center mt-8">
            <button disabled={loading} className="px-10 py-3 text-white bg-restaurant-primary rounded-lg font-bold shadow-lg">
                {loading ? 'Guardando...' : 'GUARDAR CAMBIOS'}
            </button>
          </div>
      </form>
    </div>
  );
};

export default EditarAlmacen;