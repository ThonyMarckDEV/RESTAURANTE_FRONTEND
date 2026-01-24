import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showCategoria, updateCategoria } from 'services/categoriaService'; 
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import CategoriaForm from '../components/CategoriaForm';

const EditarCategoria = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nombre: '', estado: 1 });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await showCategoria(id);
        setFormData({
          nombre: response.data.nombre,
          estado: response.data.estado
        });
      } catch (err) {
        setAlert({ type: 'error', message: 'No se pudo cargar la categoría.' });
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
      await updateCategoria(id, formData);
      setAlert({ type: 'success', message: 'Categoría actualizada.' });
      setTimeout(() => navigate('/superadmin/listar-categorias'), 1500);
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.nombre) return <LoadingScreen />;

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <div className="flex justify-between items-center mb-8 border-b-2 border-restaurant-secondary/20 pb-4">
          <h1 className="text-3xl font-serif font-bold text-restaurant-primary">Editar Categoría</h1>
          <button onClick={() => navigate('/superadmin/listar-categorias')} className="text-restaurant-secondary font-bold">← Volver</button>
      </div>
      <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />
      <form onSubmit={handleSubmit}>
          <CategoriaForm formData={formData} onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} />
          <div className="flex justify-center mt-8">
            <button disabled={loading} className="px-10 py-3 text-white bg-restaurant-primary rounded-lg font-bold shadow-lg">
                {loading ? 'Guardando...' : 'GUARDAR CAMBIOS'}
            </button>
          </div>
      </form>
    </div>
  );
};

export default EditarCategoria;