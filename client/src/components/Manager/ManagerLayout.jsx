// src/views/manager/ManagerLayout.js
import React, { useState } from "react";
import NavbarGerente from "./NavbarGerente";
import SideMenuGerente from "./SideMenuGerente";

const ManagerLayout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const username = "Gerente123"; // Puedes reemplazar esto con un valor dinámico

  return (
    <div className="manager-dashboard">
      <NavbarGerente username={username} />
      <SideMenuGerente menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default ManagerLayout;
