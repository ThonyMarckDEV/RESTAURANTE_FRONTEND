import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { createInsumo } from 'services/insumoService';
import { getCategorias } from 'services/categoriaService';
import InsumoForm from '../components/InsumoForm';

const AgregarInsumo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    categoriaId: '', 
    nombre: '', 
    codigoInterno: '', 
    unidadMedida: 'KG', 
    precioCompraPromedio: 0, 
    stockMinimo: 5, 
    estado: 1 
  });
  
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Cargar categorías al montar
 useEffect(() => {
    const fetchCats = async () => {
        try {
            // Enviamos '1' como tercer argumento para filtrar solo categorías de tipo INSUMO
            const response = await getCategorias(1, '', 1); 
            
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
      await createInsumo(formData);
      setAlert({ type: 'success', message: 'Insumo registrado correctamente.' });
      setTimeout(() => navigate('/superadmin/listar-insumos'), 1500);
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
          <h1 className="text-3xl font-serif font-bold text-restaurant-primary">Nuevo Insumo</h1>
          <button onClick={() => navigate('/superadmin/listar-insumos')} className="text-restaurant-secondary font-bold">← Cancelar</button>
      </div>
      <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
      
      <form onSubmit={handleSubmit}>
          <InsumoForm formData={formData} onChange={handleChange} categorias={categorias} />
          <div className="flex justify-center mt-8">
            <button disabled={loading} className="px-10 py-3 text-white bg-restaurant-primary rounded-lg font-bold shadow-lg hover:bg-red-900 transition-all">
              {loading ? 'Procesando...' : 'REGISTRAR INSUMO'}
            </button>
          </div>
      </form>
    </div>
  );
};

export default AgregarInsumo;