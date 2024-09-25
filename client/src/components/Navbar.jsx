import React, { useEffect, useState } from "react";
import { FaBars, FaShoppingCart } from "react-icons/fa";
import "../css/Navbar.css";

const Navbar = ({ setMenuOpen, setCartOpen }) => {
  const [cartItems, setCartItems] = useState([]);

  const loadCartItems = () => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCartItems);
  };

  useEffect(() => {
    loadCartItems();

    const handleCartUpdate = (event) => {
      setCartItems(event.detail); // Actualiza el estado cuando se reciba el evento
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar">
      <FaBars onClick={() => setMenuOpen(true)} className="icon" />
      <div className="cart-icon-container" onClick={() => setCartOpen(true)}>
        <FaShoppingCart className="icon" />
        {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
      </div>
    </nav>
  );
};

export default Navbar;
