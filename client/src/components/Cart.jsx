import React, { useEffect, useState } from "react";
import { FaTimes, FaTrashAlt } from "react-icons/fa";
import "../css/Cart.css";

const Cart = ({ cartOpen, setCartOpen }) => {
  const [cartItems, setCartItems] = useState([]);

  const loadCartItems = () => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCartItems);
  };

  useEffect(() => {
    loadCartItems();
  }, []);

  // Emitir evento para actualizar el carrito en otros componentes
  const emitCartUpdateEvent = (updatedItems) => {
    const event = new CustomEvent("cartUpdated", { detail: updatedItems });
    window.dispatchEvent(event);
  };

  // Actualizar la cantidad del producto
  const handleQuantityChange = (index, newQuantity) => {
    const updatedItems = [...cartItems];
    updatedItems[index].quantity = newQuantity;
    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    emitCartUpdateEvent(updatedItems); // Emitir evento para notificar el cambio
  };

  // Eliminar un producto del carrito
  const handleRemoveItem = (index) => {
    const updatedItems = [...cartItems];
    updatedItems.splice(index, 1); // Elimina el artículo del array
    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    emitCartUpdateEvent(updatedItems); // Emitir evento para notificar el cambio
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
    const handleStorageUpdate = () => {
      loadCartItems();
    };

    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

  if (!cartOpen) return null;

  return (
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

          <button className="purchase-button">COMPRAR</button>
        </>
      ) : (
        <p>Tu carrito está vacío</p>
      )}
    </div>
  );
};

export default Cart;
