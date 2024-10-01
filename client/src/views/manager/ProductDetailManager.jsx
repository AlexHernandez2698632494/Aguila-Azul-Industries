import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useNavigate para la flecha de regresar
import "../../css/ProductDetailManager.css"; // Usa tu archivo de estilos

const ProductDetailManager = () => {
  const { id } = useParams(); // Obtenemos el ID del producto desde la URL
  const [product, setProduct] = useState(null); // Estado para almacenar el producto
  const [loading, setLoading] = useState(true); // Estado para manejar el estado de carga
  const [error, setError] = useState(null); // Estado para manejar los errores
  const navigate = useNavigate(); // Hook para regresar a la vista anterior

  // Función para obtener los detalles del producto desde la API
  const fetchProduct = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"; // URL base de la API
      const response = await fetch(`${API_URL}/product/${id}`);
      if (!response.ok) {
        throw new Error("Error al obtener los detalles del producto");
      }
      const data = await response.json();
      setProduct(data); // Asignamos los detalles del producto al estado
    } catch (error) {
      setError(error.message); // Manejamos los errores
    } finally {
      setLoading(false); // Indicamos que ya no estamos cargando
    }
  };

  // Usamos useEffect para ejecutar la solicitud cuando el componente se monta
  useEffect(() => {
    fetchProduct();
  }, [id]); // El efecto se ejecuta cuando cambia el id del producto

  // Si está cargando, mostramos un mensaje de carga
  if (loading) {
    return <div>Cargando detalles del producto...</div>;
  }

  // Si hubo un error, lo mostramos
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Si no hay producto, mostramos un mensaje de que no se encontró
  if (!product) {
    return <div>No se encontró el producto</div>;
  }

  return (
    <div className="product-detail-container">
      {/* Flecha para regresar y título de la página */}
      <div className="product-header">
        <button onClick={() => navigate(-1)} className="back-button">
          ←
        </button>
        <h1>Información del producto</h1>
      </div>

      <div className="product-container">
        {/* Columna izquierda: Información general del producto */}
        <div className="product-info">
          <h2>Información general del producto</h2>
          <hr className="separator-line" />
          <div className="product-details">
            <p><strong>Nombre del Producto:</strong></p>
            <p>{product.Nombre}</p>

            <p><strong>Descripción:</strong></p>
            <p>{product.Descripcion || "No disponible"}</p>

            <p><strong>Categoría:</strong></p>
            <p>{product.NombreCategoria}</p>

            <p><strong>Proveedor:</strong></p>
            <p>{product.NombreProveedor}</p>

            {/* Especificaciones del producto debajo de la descripción */}
            {product.Especificaciones && product.Especificaciones.length > 0 && (
              <div>
                <h3>Especificaciones</h3>
                <hr className="separator-line" />
                <ul>
                  {product.Especificaciones.map((spec, index) => (
                    <li key={index}>
                      <strong>{spec.NombreEspecificacion}:</strong> {spec.ValorEspecificacion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Columna derecha: Solo la imagen del producto */}
        <div className="product-image-container">
          {product.Imagen && (
            <div className="product-image">
              <h2>Imagen del producto</h2>
              <hr className="separator-line" />
              <img
                src={product.Imagen}
                alt={product.Nombre}
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailManager;
