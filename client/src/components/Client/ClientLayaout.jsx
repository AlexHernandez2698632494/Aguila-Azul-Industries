// src/views/manager/ManagerLayout.js
import React, { useState } from "react";
import NavbarCliente from "./NavbarClient";
import SideMenu from "./SideMenuCliente";

const ClientLayout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const username = "Gerente123"; // Puedes reemplazar esto con un valor dinámico

  return (
    <div className="manager-dashboard">
      <NavbarCliente username={username} />
      <SideMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default ClientLayout;
