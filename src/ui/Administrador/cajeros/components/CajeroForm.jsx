import React from 'react';
import { UserCircleIcon, IdentificationIcon, KeyIcon } from '@heroicons/react/24/outline';
import { isNumeric, isTextOnly } from 'utilities/Validations/validations';

const CajeroForm = ({ datosData, cuentaData, onChangeDatos, onChangeCuenta, isEditing = false }) => {
  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-restaurant-secondary focus:border-restaurant-secondary outline-none text-sm transition-all";
  const labelClass = "block text-xs font-bold text-gray-600 mb-1";

  const handleNumberChange = (e) => {
    if (isNumeric(e.target.value)) onChangeDatos(e);
  };

  const handleLetterChange = (e) => {
    if (isTextOnly(e.target.value)) onChangeDatos(e);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-restaurant-primary h-fit">
      
      {/* SECCIÓN 1: DATOS PERSONALES */}
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-3">
        <div className="p-2 bg-restaurant-surface rounded-full">
          <UserCircleIcon className="w-6 h-6 text-restaurant-secondary" />
        </div>
        <h2 className="text-lg font-bold text-gray-800">Datos Personales</h2>
      </div>

      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>DNI <span className="text-red-500">*</span></label>
            <div className="relative">
                <IdentificationIcon className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                <input 
                  name="dni" 
                  value={datosData.dni} 
                  onChange={handleNumberChange} 
                  className={`${inputClass} pl-9`} 
                  maxLength={8} 
                  placeholder="Ej. 70654321"
                  required 
                />
            </div>
          </div>
          <div>
            <label className={labelClass}>Fecha Nacimiento <span className="text-red-500">*</span></label>
            <input 
              type="date" 
              name="fechaNacimiento" 
              value={datosData.fechaNacimiento} 
              onChange={onChangeDatos} 
              className={inputClass} 
              required
            />
          </div>
          <div>
            <label className={labelClass}>Sexo <span className="text-red-500">*</span></label>
            <select name="sexo" value={datosData.sexo} onChange={onChangeDatos} className={inputClass} required>
              <option value="">Seleccione</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Nombre <span className="text-red-500">*</span></label>
            <input 
              name="nombre" 
              value={datosData.nombre} 
              onChange={handleLetterChange} 
              className={inputClass} 
              placeholder="Ej. Juan"
              required 
            />
          </div>
          <div>
            <label className={labelClass}>Apellido Paterno <span className="text-red-500">*</span></label>
            <input 
              name="apellidoPaterno" 
              value={datosData.apellidoPaterno} 
              onChange={handleLetterChange} 
              className={inputClass} 
              placeholder="Ej. Pérez"
              required 
            />
          </div>
          <div>
            <label className={labelClass}>Apellido Materno <span className="text-red-500">*</span></label>
            <input 
              name="apellidoMaterno" 
              value={datosData.apellidoMaterno} 
              onChange={handleLetterChange} 
              className={inputClass} 
              placeholder="Ej. Gomez"
              required 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
                <label className={labelClass}>Dirección <span className="text-red-500">*</span></label>
                <input 
                  name="direccion" 
                  value={datosData.direccion} 
                  onChange={onChangeDatos} 
                  className={inputClass} 
                  placeholder="Ej. Av. Principal 123"
                  required
                />
            </div>
            <div>
                <label className={labelClass}>Teléfono <span className="text-red-500">*</span></label>
                <input 
                  name="telefono" 
                  value={datosData.telefono} 
                  onChange={handleNumberChange} 
                  className={inputClass} 
                  maxLength={9}
                  placeholder="Ej. 987654321"
                  required
                />
            </div>
        </div>
        
        <div>
            <label className={labelClass}>Estado Civil <span className="text-red-500">*</span></label>
            <select name="estadoCivil" value={datosData.estadoCivil} onChange={onChangeDatos} className={inputClass} required>
                <option value="">Seleccione</option>
                <option value="Soltero">Soltero(a)</option>
                <option value="Casado">Casado(a)</option>
                <option value="Divorciado">Divorciado(a)</option>
                <option value="Viudo">Viudo(a)</option>
            </select>
        </div>
      </div>

      {/* SECCIÓN 2: DATOS DE CUENTA */}
      <div className="pt-4 border-t-2 border-dashed border-gray-200 mt-2">
          <div className="flex items-center gap-2 mb-4">
            <KeyIcon className="w-5 h-5 text-restaurant-secondary" />
            <p className="text-sm text-restaurant-secondary font-bold uppercase tracking-widest">
                Credenciales de Acceso
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div>
              <label className={labelClass}>Usuario (Login) <span className="text-red-500">*</span></label>
              <input 
                name="username" 
                value={cuentaData.username} 
                onChange={onChangeCuenta} 
                className={`${inputClass} bg-white`} 
                placeholder="Ej. jperez"
                required 
              />
            </div>
            <div>
              <label className={labelClass}>
                Contraseña {isEditing && <span className="text-gray-400 font-normal">(Dejar en blanco para no cambiar)</span>}
                {!isEditing && <span className="text-red-500">*</span>}
              </label>
              <input 
                type="password" 
                name="password" 
                value={cuentaData.password} 
                onChange={onChangeCuenta} 
                className={`${inputClass} bg-white`} 
                placeholder={isEditing ? "Nueva contraseña..." : "Mínimo 6 caracteres"} 
                required={!isEditing}
                minLength={6}
              />
            </div>
          </div>
      </div>

    </div>
  );
};

export default CajeroForm;