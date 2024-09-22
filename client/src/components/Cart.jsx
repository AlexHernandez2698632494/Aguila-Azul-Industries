import React from "react";
import { FaTimes } from "react-icons/fa";
import "../css/Cart.css";

const Cart = ({ cartOpen, setCartOpen, cartItems }) => {
  if (!cartOpen) return null;

  return (
    <div className="cart">
      <FaTimes onClick={() => setCartOpen(false)} className="icon close-cart" />
      <h2>Carrito de Compras</h2>
      {cartItems.length > 0 ? (
        <ul>
          {cartItems.map((item, index) => (
            <li key={index}>{item.name}</li>
          ))}
        </ul>
      ) : (
        <p>Tu carrito está vacío</p>
      )}
    </div>
  );
};

export default Cart;
