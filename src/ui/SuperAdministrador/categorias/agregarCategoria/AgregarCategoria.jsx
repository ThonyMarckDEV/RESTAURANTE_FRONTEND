import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { createCategoria } from 'services/categoriaService';
import CategoriaForm from '../components/CategoriaForm';

const AgregarCategoria = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nombre: '', estado: 1 });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      await createCategoria(formData);
      setAlert({ type: 'success', message: 'Categoría creada correctamente.' });
      setTimeout(() => navigate('/superadmin/listar-categorias'), 1500);
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
          <h1 className="text-3xl font-serif font-bold text-restaurant-primary">Nueva Categoría</h1>
          <button onClick={() => navigate('/superadmin/listar-categorias')} className="text-restaurant-secondary font-bold">← Cancelar</button>
      </div>
      <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
      <form onSubmit={handleSubmit}>
          <CategoriaForm formData={formData} onChange={handleChange} />
          <div className="flex justify-center mt-8">
            <button disabled={loading} className="px-10 py-3 text-white bg-restaurant-primary rounded-lg font-bold shadow-lg hover:bg-red-900 transition-all">
              {loading ? 'Procesando...' : 'REGISTRAR CATEGORÍA'}
            </button>
          </div>
      </form>
    </div>
  );
};

export default AgregarCategoria;