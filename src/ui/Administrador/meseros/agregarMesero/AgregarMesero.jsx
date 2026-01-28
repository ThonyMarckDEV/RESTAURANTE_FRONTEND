import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { createMesero } from 'services/meseroService';
import MeseroForm from 'components/Shared/Formularios/EmpleadoForm';
import { UserPlusIcon } from '@heroicons/react/24/outline';

const initialFormData = {
  cuenta: { username: '', password: '' },
  datos: {
    nombre: '', apellidoPaterno: '', apellidoMaterno: '', dni: '',
    direccion: '', telefono: '', sexo: '', estadoCivil: '', fechaNacimiento: ''
  }
};

const AgregarMesero = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e, section) => {
      const { name, value } = e.target;
      setFormData(prev => ({
          ...prev,
          [section]: { ...prev[section], [name]: value }
      }));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      const response = await createMesero(formData);
      setAlert({ type: 'success', message: response.message || 'Mesero registrado exitosamente.' });
      setFormData(initialFormData);
      setTimeout(() => navigate('/admin/listar-meseros'), 1500);
    } catch (err) {
        let message = 'Ocurrió un error al crear el mesero.';
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

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <div className="flex justify-between items-center mb-8 border-b-2 border-restaurant-secondary/20 pb-4">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-restaurant-primary/10 rounded-lg text-restaurant-primary">
                <UserPlusIcon className="w-8 h-8"/>
             </div>
             <div>
                 <h1 className="text-3xl font-serif font-bold text-restaurant-primary">Nuevo Mesero</h1>
                 <p className="text-sm text-gray-500">Registra un nuevo empleado para la atención de mesas</p>
             </div>
          </div>
          <button onClick={() => navigate('/admin/listar-meseros')} className="text-restaurant-secondary hover:text-restaurant-primary font-bold transition-colors">
              ← Cancelar Operación
          </button>
      </div>

      <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
      
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <MeseroForm 
            roleName="mesero"
            datosData={formData.datos}
            cuentaData={formData.cuenta}
            onChangeDatos={(e) => handleChange(e, 'datos')}
            onChangeCuenta={(e) => handleChange(e, 'cuenta')}
            isEditing={false}
          />
          <div className="flex justify-end mt-6 pb-10">
            <button type="submit" disabled={loading} className="px-8 py-3 text-white bg-restaurant-primary rounded-lg hover:bg-red-900 disabled:opacity-70 transition-all font-bold shadow-lg hover:shadow-xl w-full md:w-auto transform hover:-translate-y-0.5 flex items-center gap-2 justify-center">
              {loading ? 'Procesando...' : (
                  <>
                    <UserPlusIcon className="w-5 h-5" /> REGISTRAR MESERO
                  </>
              )}
            </button>
          </div>
      </form>
    </div>
  );
};
 
export default AgregarMesero;