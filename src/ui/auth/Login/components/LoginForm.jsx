import React from 'react';

const LoginForm = ({
  username,
  setUsername,
  password,
  setPassword,
  handleLogin,
  rememberMe,
  setRememberMe,
  setShowForgotPassword
}) => {
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-6 text-center text-restaurant-primary border-b border-orange-200 pb-2">
        Acceso de Personal
      </h2>
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-1">
            Usuario
          </label>
          <div className="relative">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-restaurant-secondary focus:border-restaurant-secondary sm:text-sm transition-all duration-200"
              placeholder="Ej. camarero01"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-restaurant-secondary focus:border-restaurant-secondary sm:text-sm transition-all duration-200"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-restaurant-primary focus:ring-restaurant-secondary border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer select-none">
              Recordarme
            </label>
          </div>
          <div className="text-sm">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="font-medium text-restaurant-secondary hover:text-restaurant-primary transition-colors underline decoration-dotted"
            >
              ¿Olvidaste la clave?
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-md text-sm font-bold text-white bg-restaurant-primary hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-restaurant-primary transition-all duration-300 transform hover:-translate-y-0.5"
        >
          INGRESAR AL SISTEMA
        </button>
      </form>
    </div>
  );
};

export default LoginForm;