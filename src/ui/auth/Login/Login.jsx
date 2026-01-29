import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import jwtUtils from 'utilities/Token/jwtUtils';
import LoadingScreen from 'components/Shared/LoadingScreen';
import LoginForm from './components/LoginForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import authService from 'services/authService';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dni, setDni] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await authService.login(username, password, rememberMe);
      const { access_token} = result;

      const accessTokenExpiration = '; path=/; Secure; SameSite=Strict';
      document.cookie = `access_token=${access_token}${accessTokenExpiration}`;

      const rol = jwtUtils.getUserRole(access_token);

      toast.success(`¡Bienvenido de nuevo!`);

      const rutas = {
          superadmin: '/superadmin',
          admin: '/admin',
          cajero: '/cajero',
          mesero: '/mesero',
      };

      if (rutas[rol]) {
          setTimeout(() => navigate(rutas[rol]), 1500);
      } else {
          toast.error(`Rol no reconocido: ${rol}`);
      }

    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || 'Error al iniciar sesión');
      } else {
        console.error('Error al intentar iniciar sesión:', error);
        toast.error('Error de conexión con el servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.forgotPassword(dni);
      toast.success('Revisa tu correo para restablecer tu acceso.');
      setTimeout(() => setShowForgotPassword(false), 1500);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || 'Error al solicitar recuperación');
      } else {
        toast.error('Error interno del servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Fondo con imagen de restaurante oscurecida
    <div className="min-h-screen w-full flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
      {/* Overlay oscuro para legibilidad */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div className="relative w-full max-w-md mx-4 animate-fade-in-up">
        {/* Tarjeta principal */}
        <div className="bg-restaurant-surface rounded-lg shadow-2xl overflow-hidden border-t-4 border-restaurant-primary">
          
          {/* Cabecera decorativa */}
          <div className="pt-8 pb-6 px-8 flex flex-col items-center text-center bg-white">
            <div className="h-20 w-20 bg-restaurant-primary rounded-full flex items-center justify-center mb-4 shadow-lg ring-4 ring-restaurant-surface">
                {/* Si no tienes lucide-react, puedes usar un texto o svg simple */}
               <span className="text-4xl text-restaurant-accent">🍽️</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-restaurant-dark">
              RESTAURANT
            </h1>
            <p className="text-gray-500 mt-2 text-sm italic font-serif">
              "CRM"
            </p>
          </div>

          <div className="p-8 pt-2 bg-restaurant-surface">
            {loading ? (
               <div className="flex flex-col justify-center items-center h-48 space-y-4">
                <LoadingScreen />
                <p className="text-restaurant-primary font-medium animate-pulse">Preparando cocina...</p>
              </div>
            ) : showForgotPassword ? (
              <ForgotPasswordForm
                dni={dni}
                setDni={setDni}
                handleForgotPassword={handleForgotPassword}
                setShowForgotPassword={setShowForgotPassword}
              />
            ) : (
              <LoginForm
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                handleLogin={handleLogin}
                rememberMe={rememberMe}
                setRememberMe={setRememberMe}
                setShowForgotPassword={setShowForgotPassword}
              />
            )}
          </div>
        </div>
        
        {/* Footer simple */}
        <p className="text-center text-white/60 text-xs mt-6">
          © {new Date().getFullYear()} Sistema de Gestión de Restaurantes
        </p>
      </div>
    </div>
  );
};

export default Login;