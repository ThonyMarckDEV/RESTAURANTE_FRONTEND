import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { createSede } from 'services/sedeService';

import SedeForm from '../components/SedeForm';
import AdminForm from '../components/AdminForm';

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
    dni: '',
    direccion: '',
    telefono: '',
    sexo: '',
    estadoCivil: '',
    fechaNacimiento: '',
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
      setAlert({ type: 'success', message: response.message || 'Sede creada exitosamente.' });
      setFormData(initialFormData);
      setTimeout(() => navigate('/superadmin/listar-sedes'), 2000);
    } catch (err) {
        let message = 'Ocurrió un error al crear la sede.';
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
          <h1 className="text-3xl font-serif font-bold text-restaurant-primary">
            Apertura de Nueva Sede
          </h1>
          <button 
            onClick={() => navigate('/superadmin/listar-sedes')} 
            className="text-restaurant-secondary hover:text-restaurant-primary font-bold flex items-center gap-1 transition-colors"
          >
              ← Cancelar Operación
          </button>
      </div>

      <AlertMessage 
        type={alert?.type} 
        message={alert?.message} 
        details={alert?.details} 
        onClose={() => setAlert(null)} 
      />
      
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
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

          {/* BOTÓN DE GUARDAR */}
          <div className="md:col-span-2 flex justify-end mt-4 pb-10">
            <button
              type="submit" 
              disabled={loading}
              className="px-8 py-3 text-white bg-restaurant-primary rounded-lg hover:bg-red-900 disabled:opacity-70 transition-all font-bold shadow-lg hover:shadow-xl w-full md:w-auto transform hover:-translate-y-0.5"
            >
              {loading ? 'Procesando...' : 'REGISTRAR NUEVA SEDE'}
            </button>
          </div>

      </form>
    </div>
  );
};
 
export default AgregarSede;