import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../../css/ProductDetailEmployee.module.css"; // Asegúrate de que este archivo CSS esté disponible

const ProductDetailEmployee = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div>Cargando detalles del producto...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>No se encontró el producto</div>;
  }

  return (
    <div className={styles.productDetailContainerEmployee}>
      <div className={styles.productHeaderEmployee}>
        <button onClick={() => navigate(-1)} className={styles.backButtonEmployee}>
          ←
        </button>
        <h1>Información del producto</h1>
      </div>

      <div className={styles.productContainerEmployee}>
        <div className={styles.productInfoEmployee}>
          <h2>Información general del producto</h2>
          <hr className={styles.separatorLineEmployee} />
          <div className={styles.productDetailsEmployee}>
            <p><strong>Nombre del Producto:</strong> {product.Nombre}</p>
            <p><strong>Descripción:</strong> {product.Descripcion || "No disponible"}</p>
            <p><strong>Categoría:</strong> {product.NombreCategoria}</p>
            <p><strong>Proveedor:</strong> {product.NombreProveedor}</p>
            <p><strong>Precio:</strong> {product.Precio}</p>
            <p><strong>Cantidad Disponible:</strong> {product.CantidadDisponible}</p> {/* Cantidad Disponible */}
            <p><strong>Especificaciones: </strong>
            <ul>
            {product.Especificaciones.map((spec, index) => (
              <li key={index}>
                <strong>{spec.NombreEspecificacion}:</strong> {spec.ValorEspecificacion}
              </li>
            ))}
          </ul> </p>
          </div>
        </div>

        <div className={styles.productImageContainerEmployee}>
          {product.Imagen && (
            <>
              <h2>Imagen del producto</h2>
              <hr className={styles.separatorLineEmployee} />
              <img
                src={product.Imagen}
                alt={product.Nombre}
                className={styles.productImageEmployee}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailEmployee;
