import React, { useState } from "react";
import NavbarEmpleado from "./NavbarEmpleado"; // Navbar específico para empleados
import SideMenuEmpleado from "./SideMenuEmpleado"; // Menú lateral específico para empleados

const EmployeeLayout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const username = "Empleado123"; // Esto puede cambiar dinámicamente según el empleado

  return (
    <div className="employee-dashboard">
      <NavbarEmpleado username={username} />
      <SideMenuEmpleado menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main className="content">{children}</main>
    </div>
  );
};

export default EmployeeLayout;
