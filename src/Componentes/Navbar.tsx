import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-lg">
      <h1 className="text-xl font-bold">Mi Red Social</h1>
      <ul className="flex gap-6">
        <li className="hover:underline cursor-pointer">Inicio</li>
        <li className="hover:underline cursor-pointer">Explorar</li>
        <li className="hover:underline cursor-pointer">Perfil</li>
      </ul>
    </nav>
  );
};

export default Navbar;
