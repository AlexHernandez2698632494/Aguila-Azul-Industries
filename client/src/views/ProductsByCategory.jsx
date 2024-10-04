import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../css/ProductsByCategory.module.css"; // Importa el CSS como módulo

const ProductsByCategory = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const response = await fetch(`${API_URL}/product/category/${id}`);
        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }
        const data = await response.json();
        setProducts(data.products);
        setCategoryName(data.categoryName);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCartAndLocalStorage = (product, quantity) => {
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

    const event = new CustomEvent("cartUpdated", { detail: cartItems });
    window.dispatchEvent(event);
  };

  if (loading) return <div className={styles.loader}>Cargando productos...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.productsContainer}>
      <h2 className={styles.categoryTitle}>{categoryName}</h2>
      <div className={styles.productsGrid}>
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.ProductoID}
              className={styles.productItem}
              onClick={() => handleProductClick(product.ProductoID)}
              style={{ cursor: "pointer" }}
            >
              {product.Imagen && <img src={product.Imagen} alt={`Imagen de ${product.NombreProducto}`} />}
              <p className={styles.productProvider}>{product.NombreProveedor}</p>
              <h3 className={styles.productName}>{product.NombreProducto}</h3>
              <p className={styles.productPrice}>${product.Precio}</p>
              <button
                className={styles.addButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCartAndLocalStorage(product, 1);
                }}
              >
                Agregar al carrito
              </button>
            </div>
          ))
        ) : (
          <div>No hay productos disponibles en esta categoría.</div>
        )}
      </div>
    </div>
  );
};

export default ProductsByCategory;
