import React from 'react';
import { Link } from 'react-router-dom'; // 👈 Importa Link para la navegación

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-bold mb-4">Bienvenido a la Aplicación</h1>
      <p className="text-lg mb-8">Esta es la página principal. Por favor, inicia sesión para continuar.</p>
      <Link 
        to="/login" 
        className="px-6 py-3 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
      >
        Ir a Iniciar Sesión
      </Link>
    </div>
  );
};
