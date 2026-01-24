import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showSede, updateSede } from 'services/sedeService'; 
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';

// IMPORTAMOS LOS DOS FORMULARIOS
import AdminForm from '../components/AdminForm';
import SedeForm from '../components/SedeForm';

const initialFormData = {
  sede: {
    nombre: '', 
    direccion: '', 
    codigo_sunat: ''
  },
  admin: {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '', 
    direccion: '',
    dni: '',
    estadoCivil: '', 
    fechaNacimiento: '', 
    sexo: '', 
    telefono: '',
    username: '',
    password: ''
  }
};

const EditarSede = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await showSede(id);
        const { sede, admin } = response.data;
        const datosPersonales = admin?.datos_empleado || {};

        setFormData({
            sede: {
                nombre: sede.nombre || '',
                direccion: sede.direccion || '',
                codigo_sunat: sede.codigo_sunat || ''
            },
            admin: {
                nombre: datosPersonales.nombre || '',
                apellidoPaterno: datosPersonales.apellidoPaterno || '',
                apellidoMaterno: datosPersonales.apellidoMaterno || '',
                dni: datosPersonales.dni || '',
                direccion: datosPersonales.direccion || '',
                estadoCivil: datosPersonales.estadoCivil || '',
                fechaNacimiento: datosPersonales.fechaNacimiento || '',
                sexo: datosPersonales.sexo || '',
                telefono: datosPersonales.telefono || '',
                username: admin?.username || '',
                password: '' 
            }
        });

      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la información de la sede.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [section]: {
            ...prev[section],
            [name]: value
        }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      const response = await updateSede(id, formData);
      setAlert({ type: 'success', message: response.message || 'Sede y Admin actualizados correctamente.' });
      setTimeout(() => navigate('/superadmin/listar-sedes'), 1500);
    } catch (err) {
        let message = 'Ocurrió un error al actualizar';
        let details = [];
        if (err.details) {
            message = "Por favor corrige los siguientes errores:";
            details = Object.values(err.details).flat();
        } else if (err.message) {
            message = err.message;
        }
        setAlert({ type: 'error', message: message, details: details });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.sede.nombre) return <LoadingScreen />;
  if (error) return <div className="text-center p-8 text-restaurant-primary font-bold bg-red-50 rounded-lg mx-6 mt-6">{error}</div>;

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <div className="flex justify-between items-center mb-8 border-b-2 border-restaurant-secondary/20 pb-4">
          <h1 className="text-3xl font-serif font-bold text-restaurant-primary">
            Editar Sede y Encargado
          </h1>
          <button 
            onClick={() => navigate('/superadmin/listar-sedes')} 
            className="text-restaurant-secondary hover:text-restaurant-primary font-bold transition-colors"
          >
              ← Volver al listado
          </button>
      </div>

      <AlertMessage 
        type={alert?.type} 
        message={alert?.message} 
        details={alert?.details}
        onClose={() => setAlert(null)} 
      />

      <div className="max-w-5xl mx-auto">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* 1. COMPONENTE FORMULARIO SEDE */}
          <SedeForm 
            formData={formData.sede} 
            onChange={(e) => handleChange(e, 'sede')} 
          />

          {/* 2. COMPONENTE FORMULARIO ADMIN */}
          <AdminForm 
            formData={formData.admin} 
            onChange={(e) => handleChange(e, 'admin')} 
          />

          {/* BOTONES DE ACCIÓN */}
          <div className="md:col-span-2 flex justify-end gap-4 mt-6 pb-10">
            <button 
                type="button" 
                onClick={() => navigate('/superadmin/listar-sedes')}
                className="px-6 py-3 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
                Cancelar
            </button>
            <button
                type="submit" 
                disabled={loading}
                className="px-8 py-3 text-white bg-restaurant-primary rounded-lg hover:bg-red-900 disabled:opacity-70 transition-all font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
                {loading ? 'Guardando...' : 'GUARDAR CAMBIOS'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarSede;