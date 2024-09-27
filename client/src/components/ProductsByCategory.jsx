import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Importa useNavigate
import "../css/ProductsByCategory.css"; // Asegúrate de importar el CSS

const ProductsByCategory = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState(""); // Estado para el nombre de la categoría
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Inicializa useNavigate

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const response = await fetch(`${API_URL}/product/category/${id}`);
        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }
        const data = await response.json();
        setProducts(data.products); // Asigna los productos
        setCategoryName(data.categoryName); // Asigna el nombre de la categoría
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

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="products-container">
      <h2 className="category-title">{categoryName}</h2>
      <div className="products-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.ProductoID}
              className="product-item"
              onClick={() => handleProductClick(product.ProductoID)}
              style={{ cursor: "pointer" }}
            >
              {product.Imagen && <img src={product.Imagen} alt={product.NombreProducto} />}
              <p className="product-provider">{product.NombreProveedor}</p>
              <h3 className="product-name">{product.NombreProducto}</h3>
              <p className="product-price">${product.Precio}</p>
              <button
                className="add-button"
                onClick={(e) => {
                  e.stopPropagation(); // Evita la redirección al hacer click en el botón
                  handleAddToCartAndLocalStorage(product, 1); // Agregar 1 unidad al carrito
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
