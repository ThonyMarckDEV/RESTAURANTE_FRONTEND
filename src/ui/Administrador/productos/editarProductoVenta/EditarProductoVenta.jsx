import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showProductoVenta, updateProductoVenta } from 'services/productoVentaService'; 
import { getCategorias } from 'services/categoriaService';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import ProductoVentaForm from '../components/ProductoVentaForm';

const EditarProductoVenta = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ 
    categoriaId: '', 
    categoriaNombre: '',
    nombre: '', 
    marca: '', 
    precioCompra: 0, 
    precioVenta: 0, 
    stockMinimo: 10, 
    estado: 1 
  });
  
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catsRes] = await Promise.all([
            showProductoVenta(id),
            getCategorias(1, '', 2) // 2 = PRODUCTOS
        ]);

        const listaCategorias = catsRes.data.content || catsRes.data;
        setCategorias(listaCategorias);

        const data = prodRes.data;

        const catEncontrada = listaCategorias.find(c => c.id === data.categoria_id);
        const nombreCategoria = catEncontrada ? catEncontrada.nombre : '';

        setFormData({
          categoriaId: data.categoria_id,
          categoriaNombre: nombreCategoria,
          nombre: data.nombre,
          marca: data.marca,
          precioCompra: data.precio_compra,
          precioVenta: data.precio_venta,
          stockMinimo: data.stock_minimo,
          estado: data.estado
        });

      } catch (err) {
        console.error(err);
        setAlert({ type: 'error', message: 'No se pudo cargar la información.' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProductoVenta(id, formData);
      setAlert({ type: 'success', message: 'Producto actualizado.' });
      setTimeout(() => navigate('/admin/listar-productos-venta'), 1500);
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
          <h1 className="text-3xl font-serif font-bold text-restaurant-primary">Editar Producto</h1>
          <button onClick={() => navigate('/admin/listar-productos-venta')} className="text-restaurant-secondary font-bold">← Volver</button>
      </div>
      <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
      
      <form onSubmit={handleSubmit}>
          {/* Al pasar formData con categoriaNombre, el hook interno del Form funcionará */}
          <ProductoVentaForm formData={formData} onChange={handleChange} categorias={categorias} />
          
          <div className="flex justify-center mt-8">
            <button disabled={loading} className="px-10 py-3 text-white bg-restaurant-primary rounded-lg font-bold shadow-lg">
                {loading ? 'Guardando...' : 'GUARDAR CAMBIOS'}
            </button>
          </div>
      </form>
    </div>
  );
};

export default EditarProductoVenta;