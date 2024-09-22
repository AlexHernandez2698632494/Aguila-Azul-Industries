import React from "react";
import { FaBars, FaShoppingCart } from "react-icons/fa";
import "../css/Navbar.css";

const Navbar = ({ setMenuOpen, setCartOpen }) => {
  return (
    <nav className="navbar">
      <FaBars onClick={() => setMenuOpen(true)} className="icon" />
      <FaShoppingCart onClick={() => setCartOpen(true)} className="icon" />
    </nav>
  );
};

export default Navbar;
