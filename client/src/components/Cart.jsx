import React, { useEffect, useState } from "react";
import { FaTimes, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import "../css/Cart.css";

const Cart = ({ cartOpen, setCartOpen }) => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate(); // Inicializa useNavigate

  const loadCartItems = () => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCartItems);
  };

  useEffect(() => {
    loadCartItems();
  }, []);

  const emitCartUpdateEvent = (updatedItems) => {
    const event = new CustomEvent("cartUpdated", { detail: updatedItems });
    window.dispatchEvent(event);
  };

  const handleQuantityChange = (index, newQuantity) => {
    const updatedItems = [...cartItems];
    updatedItems[index].quantity = newQuantity;
    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    emitCartUpdateEvent(updatedItems);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...cartItems];
    updatedItems.splice(index, 1);
    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    emitCartUpdateEvent(updatedItems);
    loadCartItems();
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.Precio) || 0;
    const quantity = item.quantity || 0;
    return acc + price * quantity;
  }, 0);

  const discount = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.Precio) || 0;
    return acc + (price / 10) * item.quantity;
  }, 0);

  const total = subtotal - discount;

  useEffect(() => {
    const handleCartUpdate = (event) => {
      setCartItems(event.detail);
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [cartOpen]);

  if (!cartOpen) return null;

  const handleCheckout = () => {
    setCartOpen(false); // Cierra el carrito
  navigate("/checkout/cart");
  };
  

  return (
    <>
      <div className="cart-overlay" onClick={() => setCartOpen(false)}></div>

      <div className={`cart ${cartOpen ? 'open' : ''}`}>
        <FaTimes onClick={() => setCartOpen(false)} className="icon close-cart" />

        {cartItems.length > 0 ? (
          <>
            <ul className="cart-items-list">
              {cartItems.map((item, index) => (
                <li key={item.ProductoID} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.Imagen} alt={item.Nombre} />
                  </div>
                  <div className="cart-item-details">
                    <h4>{item.Nombre}</h4>
                    <p className="old-price">${(parseFloat(item.Precio) * 1.1).toFixed(2)}</p>
                    <p className="current-price">${parseFloat(item.Precio).toFixed(2)}</p>
                  </div>
                  <div className="cart-item-actions">
                    <select
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                    <FaTrashAlt
                      className="delete-icon"
                      onClick={() => handleRemoveItem(index)}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-summary">
              <p>Subtotal: ${subtotal.toFixed(2)}</p>
              <p>Descuento: ${discount.toFixed(2)}</p>
              <h3>Total: ${total.toFixed(2)}</h3>
            </div>

            <button className="purchase-button" onClick={handleCheckout}>COMPRAR</button>
          </>
        ) : (
          <p>Tu carrito está vacío</p>
        )}
      </div>
    </>
  );
};

export default Cart;
