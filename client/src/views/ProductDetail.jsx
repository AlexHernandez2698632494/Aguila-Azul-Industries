import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../css/ProductDetail.module.css"; // Cambiado a CSS Modules

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

  const incrementQuantity = () => {
    if (quantity < product?.Inventario?.CantidadDisponible) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (
      value === "" ||
      (parseInt(value) >= 1 &&
        parseInt(value) <= product?.Inventario?.CantidadDisponible)
    ) {
      setQuantity(value ? parseInt(value, 10) : "");
    }
  };

  const emitCartUpdateEvent = (updatedItems) => {
    const event = new CustomEvent("cartUpdated", { detail: updatedItems });
    window.dispatchEvent(event);
  };

  const handleAddToCartAndLocalStorage = (product, quantity) => {
    handleAddToCart(product, quantity);

    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const productIndex = cartItems.findIndex(
      (item) => item.ProductoID === product.ProductoID
    );

    if (productIndex !== -1) {
      cartItems[productIndex].quantity += quantity;
    } else {
      cartItems.push({ ...product, quantity });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    emitCartUpdateEvent(cartItems);
  };

  if (loading) return <div>Cargando detalles del producto...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.productDetailContainer}>
      {product ? (
        <>
          <h2 className={styles.productProvider}>{product.NombreProveedor}</h2>
          <h1 className={styles.productName}>{product.Nombre}</h1>

          <div className={styles.productDetailGrid}>
            <div className={styles.productImageSection}>
              <img
                src={product.Imagen}
                alt={product.Nombre}
                className={styles.productImage}
              />
            </div>

            <div className={styles.productInfoSection}>
              <div className={styles.productSpecs}>
                <h3>Especificaciones</h3>
                <ul>
                  {product.Especificaciones &&
                  product.Especificaciones.length > 0 ? (
                    product.Especificaciones.map((spec, index) => (
                      <li key={index}>
                        <strong>{spec.NombreEspecificacion}:</strong>{" "}
                        {spec.ValorEspecificacion}
                      </li>
                    ))
                  ) : (
                    <li>No hay especificaciones disponibles.</li>
                  )}
                </ul>
              </div>
              <div className={styles.deliveryMethods}>
                <h3>Métodos de entrega disponibles</h3>
                <ul>
                  <li>Envío a domicilio</li>
                  <li>Retiro en tienda</li>
                </ul>
              </div>
            </div>

            <div className={styles.productPurchaseSection}>
              <p className={styles.productPrice}>${product.Precio}</p>
              <div className={styles.purchaseActions}>
                <div className={styles.quantityControl}>
                  <button
                    className={styles.quantityBtn}
                    onClick={decrementQuantity}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    className={styles.quantityInput}
                    value={quantity}
                    onChange={handleQuantityChange}
                    pattern="\d*"
                    inputMode="numeric"
                    min="1"
                    max={product?.Inventario?.CantidadDisponible}
                  />
                  <button
                    className={styles.quantityBtn}
                    onClick={incrementQuantity}
                  >
                    +
                  </button>
                </div>
                <button
                  className={styles.addToCartButton}
                  onClick={() =>
                    handleAddToCartAndLocalStorage(product, quantity)
                  }
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>

          <div className={styles.productDescriptionSection}>
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
