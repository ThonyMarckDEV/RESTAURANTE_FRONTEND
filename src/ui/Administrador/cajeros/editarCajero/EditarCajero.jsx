import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showCajero, updateCajero } from 'services/cajeroService'; 
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import CajeroForm from '../components/CajeroForm';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

const initialFormData = {
  cuenta: {
    username: '',
    password: ''
  },
  datos: {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '', 
    dni: '',
    direccion: '',
    telefono: '',
    sexo: '',
    estadoCivil: '', 
    fechaNacimiento: ''
  }
};

const EditarCajero = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await showCajero(id);
        const { username, datos_empleado } = response.data; // El backend devuelve "datos_empleado" en snake_case o camelCase según tu DTO

        setFormData({
            cuenta: {
                username: username || '',
                password: '' // Contraseña vacía al editar
            },
            datos: {
                nombre: datos_empleado.nombre || '',
                apellidoPaterno: datos_empleado.apellidoPaterno || '',
                apellidoMaterno: datos_empleado.apellidoMaterno || '',
                dni: datos_empleado.dni || '',
                direccion: datos_empleado.direccion || '',
                estadoCivil: datos_empleado.estadoCivil || '',
                fechaNacimiento: datos_empleado.fechaNacimiento || '',
                sexo: datos_empleado.sexo || '',
                telefono: datos_empleado.telefono || ''
            }
        });

      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la información del cajero.");
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
      const response = await updateCajero(id, formData);
      setAlert({ type: 'success', message: response.message || 'Cajero actualizado correctamente.' });
      setTimeout(() => navigate('/admin/listar-cajeros'), 1500);
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

  if (loading && !formData.datos.nombre) return <LoadingScreen />;
  if (error) return <div className="text-center p-8 text-restaurant-primary font-bold bg-red-50 rounded-lg mx-6 mt-6">{error}</div>;

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <div className="flex justify-between items-center mb-8 border-b-2 border-restaurant-secondary/20 pb-4">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-restaurant-primary/10 rounded-lg text-restaurant-primary">
                <PencilSquareIcon className="w-8 h-8"/>
             </div>
             <div>
                 <h1 className="text-3xl font-serif font-bold text-restaurant-primary">
                   Editar Cajero
                 </h1>
                 <p className="text-sm text-gray-500">Actualizar información del empleado</p>
             </div>
          </div>
          <button 
            onClick={() => navigate('/admin/listar-cajeros')} 
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

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          
          {/* COMPONENTE FORMULARIO REUTILIZABLE */}
          <CajeroForm 
            datosData={formData.datos}
            cuentaData={formData.cuenta}
            onChangeDatos={(e) => handleChange(e, 'datos')}
            onChangeCuenta={(e) => handleChange(e, 'cuenta')}
            isEditing={true}
          />

          {/* BOTONES DE ACCIÓN */}
          <div className="flex justify-end gap-4 mt-6 pb-10">
            <button 
                type="button" 
                onClick={() => navigate('/admin/listar-cajeros')}
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

export default EditarCajero;