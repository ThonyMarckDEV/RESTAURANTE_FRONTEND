import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showSede, updateSede } from 'services/sedeService'; 
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { BuildingOffice2Icon, UserCircleIcon } from '@heroicons/react/24/outline';

const initialFormData = {
  sede: {
    nombre: '', 
    direccion: '', 
    codigo_sunat: ''
  },
  admin: {
    nombre: '',
    apellidoPaterno: '',
    dni: '',
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
                dni: datosPersonales.dni || '',
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
        setAlert({ 
            type: 'error', 
            message: message,
            details: details 
        });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.sede.nombre) return <LoadingScreen />;
  if (error) return <div className="text-center p-8 text-restaurant-primary font-bold bg-red-50 rounded-lg mx-6 mt-6">{error}</div>;

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-restaurant-secondary focus:border-restaurant-secondary outline-none text-sm transition-all";

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-50">
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
          
          {/* SECCIÓN 1: DATOS DE LA SEDE */}
          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-restaurant-secondary h-fit">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-3">
                <div className="p-2 bg-restaurant-surface rounded-full">
                    <BuildingOffice2Icon className="w-6 h-6 text-restaurant-primary"/>
                </div>
                <h2 className="text-lg font-bold text-gray-800">1. Datos del Local</h2>
            </div>
            
            <div className="space-y-5">
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Nombre de Sede</label>
                    <input name="nombre" value={formData.sede.nombre} onChange={(e) => handleChange(e, 'sede')} className={inputClass} required />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Dirección</label>
                    <input name="direccion" value={formData.sede.direccion} onChange={(e) => handleChange(e, 'sede')} className={inputClass} />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Código SUNAT</label>
                    <input name="codigo_sunat" value={formData.sede.codigo_sunat} onChange={(e) => handleChange(e, 'sede')} className={inputClass} maxLength={4}/>
                </div>
            </div>
          </div>

          {/* SECCIÓN 2: ADMINISTRADOR ENCARGADO */}
          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-restaurant-primary h-fit">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-3">
                <div className="p-2 bg-restaurant-surface rounded-full">
                    <UserCircleIcon className="w-6 h-6 text-restaurant-secondary"/>
                </div>
                <h2 className="text-lg font-bold text-gray-800">2. Datos del Gerente</h2>
            </div>

            <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">DNI</label>
                        <input name="dni" value={formData.admin.dni} onChange={(e) => handleChange(e, 'admin')} className={inputClass} maxLength={8} required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Nombre</label>
                        <input name="nombre" value={formData.admin.nombre} onChange={(e) => handleChange(e, 'admin')} className={inputClass} required />
                    </div>
                </div>
                
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Apellido Paterno</label>
                    <input name="apellidoPaterno" value={formData.admin.apellidoPaterno} onChange={(e) => handleChange(e, 'admin')} className={inputClass} required />
                </div>

                <div className="pt-4 border-t border-dashed border-gray-200 mt-2">
                    <p className="text-xs text-restaurant-secondary font-bold mb-3 uppercase tracking-widest">Actualizar Credenciales</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Usuario</label>
                            <input name="username" value={formData.admin.username} onChange={(e) => handleChange(e, 'admin')} className={inputClass} required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Nueva Contraseña</label>
                            <input type="password" name="password" value={formData.admin.password} onChange={(e) => handleChange(e, 'admin')} className={inputClass} placeholder="Opcional" />
                        </div>
                    </div>
                </div>
            </div>
          </div>

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