import React, { useEffect, useState } from "react";
import { FaTimes, FaTrashAlt } from "react-icons/fa";
import "../css/Cart.css";

const Cart = ({ cartOpen, setCartOpen }) => {
  const [cartItems, setCartItems] = useState([]);

  // Función para cargar el carrito desde localStorage
  const loadCartItems = () => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCartItems);
  };

  // Cargar los elementos del carrito cuando se monte el componente
  useEffect(() => {
    loadCartItems();
  }, []);

  // Cálculos
  const subtotal = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.Precio) || 0;
    const quantity = item.quantity || 0;
    return acc + price * quantity;
  }, 0);

  const discount = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.Precio) || 0;
    return acc + (price / 10) * item.quantity; // Descuento = precio / 10 * cantidad
  }, 0);

  const total = subtotal - discount;

  // Actualizar la cantidad del producto
  const handleQuantityChange = (index, newQuantity) => {
    const updatedItems = [...cartItems];
    updatedItems[index].quantity = newQuantity;
    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
  };

  // Eliminar un producto del carrito
  const handleRemoveItem = (index) => {
    const updatedItems = [...cartItems];
    updatedItems.splice(index, 1); // Elimina el artículo del array
    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems)); // Actualiza localStorage

    // Forzamos la recarga del carrito
    loadCartItems();
  };

  // Efecto para actualizar el carrito cuando se agrega un nuevo artículo al localStorage
  useEffect(() => {
    const handleStorageUpdate = () => {
      loadCartItems(); // Vuelve a cargar el carrito cuando se detecte un cambio en localStorage
    };

    // Añadir el event listener para el cambio en localStorage
    window.addEventListener("storage", handleStorageUpdate);

    // Limpiar el event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

  // Actualizar el carrito cuando se agrega un nuevo artículo (sin recargar la página)
  useEffect(() => {
    loadCartItems(); // Recargar el carrito cada vez que el componente se actualice
  }, [cartItems.length]);

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
