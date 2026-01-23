import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { createSede } from 'services/sedeService';
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

const AgregarSede = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

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
      const response = await createSede(formData);
      setAlert(response);
      setFormData(initialFormData);
      setTimeout(() => navigate('/admin/listar-sedes'), 3000);
    } catch (error) {
      setAlert(error);
    } finally {
      setLoading(false);
    }
  };

  // Input estilizado con los colores del tema (borde al enfocar color secundario/naranja)
  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-restaurant-secondary focus:border-restaurant-secondary outline-none text-sm transition-colors duration-200";

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <div className="flex justify-between items-center mb-8 border-b-2 border-restaurant-secondary/20 pb-4">
          <h1 className="text-3xl font-serif font-bold text-restaurant-primary">
            Apertura de Nueva Sede
          </h1>
          <button 
            onClick={() => navigate('/admin/listar-sedes')} 
            className="text-restaurant-secondary hover:text-restaurant-primary font-bold flex items-center gap-1 transition-colors"
          >
              ← Cancelar Operación
          </button>
      </div>

      <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
      
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* SECCIÓN 1: DATOS DE LA SEDE */}
          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-restaurant-secondary">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-3">
                <div className="p-2 bg-restaurant-surface rounded-full">
                    <BuildingOffice2Icon className="w-6 h-6 text-restaurant-primary"/>
                </div>
                <h2 className="text-lg font-bold text-gray-800">1. Datos del Local</h2>
            </div>
            
            <div className="space-y-5">
                <div>
                    <label className="block text-xs font-bold text-restaurant-primary mb-1 uppercase tracking-wide">Nombre de Sede</label>
                    <input name="nombre" value={formData.sede.nombre} onChange={(e) => handleChange(e, 'sede')} className={inputClass} placeholder="Ej. Restaurante Central" required />
                </div>
                <div>
                    <label className="block text-xs font-bold text-restaurant-primary mb-1 uppercase tracking-wide">Dirección</label>
                    <input name="direccion" value={formData.sede.direccion} onChange={(e) => handleChange(e, 'sede')} className={inputClass} placeholder="Ej. Av. Gastronómica 123" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-restaurant-primary mb-1 uppercase tracking-wide">Código SUNAT (Opcional)</label>
                    <input name="codigo_sunat" value={formData.sede.codigo_sunat} onChange={(e) => handleChange(e, 'sede')} className={inputClass} placeholder="0001" maxLength={4}/>
                </div>
            </div>
          </div>

          {/* SECCIÓN 2: ADMINISTRADOR ENCARGADO */}
          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-restaurant-primary">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-3">
                <div className="p-2 bg-restaurant-surface rounded-full">
                    <UserCircleIcon className="w-6 h-6 text-restaurant-secondary"/>
                </div>
                <h2 className="text-lg font-bold text-gray-800">2. Asignar Gerente/Admin</h2>
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
                    <p className="text-xs text-restaurant-secondary font-bold mb-3 uppercase tracking-widest">Credenciales de Acceso</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Usuario</label>
                            <input name="username" value={formData.admin.username} onChange={(e) => handleChange(e, 'admin')} className={inputClass} required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Contraseña</label>
                            <input type="password" name="password" value={formData.admin.password} onChange={(e) => handleChange(e, 'admin')} className={inputClass} required />
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* BOTÓN DE GUARDAR */}
          <div className="md:col-span-2 flex justify-end mt-4">
            <button
              type="submit" 
              disabled={loading}
              className="px-8 py-3 text-white bg-restaurant-primary rounded-lg hover:bg-red-900 disabled:opacity-70 transition-all font-bold shadow-lg hover:shadow-xl w-full md:w-auto transform hover:-translate-y-0.5 focus:ring-2 focus:ring-offset-2 focus:ring-restaurant-secondary"
            >
              {loading ? 'Procesando...' : 'REGISTRAR NUEVA SEDE'}
            </button>
          </div>

      </form>
    </div>
  );
};
 
export default AgregarSede;