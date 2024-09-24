import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/ProductDetail.css";

const ProductDetail = ({ handleAddToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const response = await fetch(`${API_URL}/product/${id}`);
        if (!response.ok) {
          throw new Error("Error al obtener los detalles del producto");
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  // Función para agregar al carrito y a localStorage
  const handleAddToCartAndLocalStorage = (product, quantity) => {
    handleAddToCart(product, quantity);

    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const productIndex = cartItems.findIndex((item) => item.ProductoID === product.ProductoID);

    if (productIndex !== -1) {
      // Si el producto ya existe en el carrito, actualiza la cantidad
      cartItems[productIndex].quantity += quantity;
    } else {
      // Si no existe, lo agrega como nuevo artículo
      cartItems.push({ ...product, quantity });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    alert("Producto agregado al carrito y guardado en localStorage.");
  };

  if (loading) return <div>Cargando detalles del producto...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-detail-container">
      {product ? (
        <>
          <h2 className="product-provider">{product.NombreProveedor}</h2>
          <h1 className="product-name">{product.Nombre}</h1>

          <div className="product-detail-grid">
            <div className="product-image-section">
              <img src={product.Imagen} alt={product.Nombre} className="product-image" />
            </div>
            
            <div className="product-info-section">
              <div className="product-specs">
                <h3>Especificaciones</h3>
                <ul>
                  {product.Especificaciones ? (
                    product.Especificaciones.map((spec, index) => (
                      <li key={index}>{spec}</li>
                    ))
                  ) : (
                    <li>No hay especificaciones disponibles.</li>
                  )}
                </ul>
              </div>
              <div className="delivery-methods">
                <h3>Métodos de entrega disponibles</h3>
                <ul>
                  <li>Envío a domicilio</li>
                  <li>Retiro en tienda</li>
                </ul>
              </div>
            </div>

            <div className="product-purchase-section">
              <p className="product-price">${product.Precio}</p>
              <div className="purchase-actions">
                <div className="quantity-control">
                  <button className="quantity-btn" onClick={decrementQuantity}>-</button>
                  <span>{quantity}</span>
                  <button className="quantity-btn" onClick={incrementQuantity}>+</button>
                </div>
                <button
                  className="add-to-cart-button"
                  onClick={() => handleAddToCartAndLocalStorage(product, quantity)}
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>

          <div className="product-description-section">
            <h3>Descripción</h3>
            <p>{product.Descripcion}</p>
          </div>
        </>
      ) : (
        <div>Producto no encontrado</div>
      )}
    </div>
  );
};

export default ProductDetail;
