import React from "react";
import { FaBars, FaShoppingCart } from "react-icons/fa";
import "../css/Navbar.css";

const Navbar = ({ setMenuOpen, setCartOpen, cartItems }) => {
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar">
      <FaBars onClick={() => setMenuOpen(true)} className="icon" />
      <div className="cart-icon-container" onClick={() => setCartOpen(true)}>
        <FaShoppingCart className="icon" />
        {totalItems > 0 && <span className="cart-count">{totalItems}</span>} {/* Mostrar el número de artículos */}
      </div>
    </nav>
  );
};

export default Navbar;
