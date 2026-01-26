import React from 'react';
import { UserCircleIcon } from '@heroicons/react/24/outline';

const AdminForm = ({ formData, onChange }) => {
  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-restaurant-secondary focus:border-restaurant-secondary outline-none text-sm transition-all";
  const labelClass = "block text-xs font-bold text-gray-600 mb-1";

  // Validación para permitir solo números (DNI, Teléfono)
  const handleNumberChange = (e) => {
    const { value } = e.target;
    if (value === '' || /^[0-9]*$/.test(value)) {
      onChange(e);
    }
  };

  // Validación para permitir solo letras, espacios y tildes (Nombres, Apellidos)
  const handleLetterChange = (e) => {
    const { value } = e.target;
    // Permite letras (A-Z, a-z), tildes, ñ y espacios
    if (value === '' || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
      onChange(e);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-restaurant-primary h-fit">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-3">
        <div className="p-2 bg-restaurant-surface rounded-full">
          <UserCircleIcon className="w-6 h-6 text-restaurant-secondary" />
        </div>
        <h2 className="text-lg font-bold text-gray-800">2. Datos del Encargado</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>DNI</label>
            <input 
              name="dni" 
              value={formData.dni} 
              onChange={handleNumberChange} 
              className={inputClass} 
              maxLength={8} 
              placeholder="Ej. 70654321"
              required 
            />
          </div>
          <div>
            <label className={labelClass}>Fecha Nacimiento</label>
            <input 
              type="date" 
              name="fechaNacimiento" 
              value={formData.fechaNacimiento} 
              onChange={onChange} 
              className={inputClass} 
            />
          </div>
          <div>
            <label className={labelClass}>Sexo</label>
            <select name="sexo" value={formData.sexo} onChange={onChange} className={inputClass}>
              <option value="">Seleccione</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Nombre</label>
            <input 
              name="nombre" 
              value={formData.nombre} 
              onChange={handleLetterChange} 
              className={inputClass} 
              placeholder="Ej. Anthony Marck"
              required 
            />
          </div>
          <div>
            <label className={labelClass}>Apellido Paterno</label>
            <input 
              name="apellidoPaterno" 
              value={formData.apellidoPaterno} 
              onChange={handleLetterChange} 
              className={inputClass} 
              placeholder="Ej. Mendoza"
              required 
            />
          </div>
          <div>
            <label className={labelClass}>Apellido Materno</label>
            <input 
              name="apellidoMaterno" 
              value={formData.apellidoMaterno} 
              onChange={handleLetterChange} 
              className={inputClass} 
              placeholder="Ej. Sánchez"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
                <label className={labelClass}>Dirección</label>
                <input 
                  name="direccion" 
                  value={formData.direccion} 
                  onChange={onChange} 
                  className={inputClass} 
                  placeholder="Ej. Av. Grau 123 - Talara"
                />
            </div>
            <div>
                <label className={labelClass}>Teléfono</label>
                <input 
                  name="telefono" 
                  value={formData.telefono} 
                  onChange={handleNumberChange} 
                  className={inputClass} 
                  maxLength={9}
                  placeholder="Ej. 987654321"
                />
            </div>
        </div>
        
        <div>
            <label className={labelClass}>Estado Civil</label>
            <select name="estadoCivil" value={formData.estadoCivil} onChange={onChange} className={inputClass}>
                <option value="">Seleccione</option>
                <option value="Soltero">Soltero(a)</option>
                <option value="Casado">Casado(a)</option>
                <option value="Divorciado">Divorciado(a)</option>
                <option value="Viudo">Viudo(a)</option>
            </select>
        </div>

        <div className="pt-4 border-t border-dashed border-gray-200 mt-2">
          <p className="text-xs text-restaurant-secondary font-bold mb-3 uppercase tracking-widest">
            Credenciales de Acceso
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Usuario</label>
              <input 
                name="username" 
                value={formData.username} 
                onChange={onChange} 
                className={inputClass} 
                placeholder="Ej. amendoza"
                required 
              />
            </div>
            <div>
              <label className={labelClass}>Contraseña</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={onChange} 
                className={inputClass} 
                placeholder="Mínimo 6 caracteres" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminForm;