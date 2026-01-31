import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { createPlato } from 'services/platoService';
import { getCategorias } from 'services/categoriaService';
import PlatoForm from '../components/PlatoForm';

const AgregarPlato = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    categoriaId: '', 
    nombre: '', 
    descripcion: '', 
    precioVenta: 0,
    estado: 1 
  });
  
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Cargar categorías al montar
  useEffect(() => {
    const fetchCats = async () => {
        try {
            // TIPO 3 = PLATOS (Jugos, Platos de Fondo, Postres)
            const response = await getCategorias(1, '', 3); 
            setCategorias(response.data.content || response.data);
        } catch (error) {
            setAlert({ type: 'error', message: 'Error al cargar categorías.' });
        }
    };
    fetchCats();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.categoriaId) {
        setAlert({ type: 'error', message: 'Seleccione una categoría.' });
        return;
    }

    setLoading(true);
    setAlert(null);
    try {
      await createPlato(formData);
      setAlert({ type: 'success', message: 'Plato registrado correctamente.' });
      setTimeout(() => navigate('/superadmin/listar-platos'), 1500);
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
          <h1 className="text-3xl font-serif font-bold text-restaurant-primary">Nuevo Plato</h1>
          <button onClick={() => navigate('/superadmin/listar-platos')} className="text-restaurant-secondary font-bold">← Cancelar</button>
      </div>
      <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
      
      <form onSubmit={handleSubmit}>
          <PlatoForm formData={formData} onChange={handleChange} categorias={categorias} />
          <div className="flex justify-center mt-8">
            <button disabled={loading} className="px-10 py-3 text-white bg-restaurant-primary rounded-lg font-bold shadow-lg hover:bg-red-900 transition-all">
              {loading ? 'Procesando...' : 'REGISTRAR PLATO'}
            </button>
          </div>
      </form>
    </div>
  );
};

export default AgregarPlato;