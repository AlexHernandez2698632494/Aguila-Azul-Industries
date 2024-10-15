import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/client.css";
import styles from "../../css/PurchaseHistoryClient.module.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("usuario"));
  const usuario = storedUser ? storedUser.usuario : null;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!usuario) {
        setError("Usuario no encontrado en el localStorage");
        setLoading(false);
        return;
      }

      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const response = await fetch(`${API_URL}/ventas/usuario/${usuario}`);

        if (response.status === 404) {
          // No se encontraron ventas, mostrar mensaje adecuado
          setOrders([]);
        } else if (!response.ok) {
          throw new Error("Error al obtener los pedidos");
        } else {
          const ordersData = await response.json();
          const ordersWithDetails = ordersData.map((order) => ({
            ...order,
            Total: parseFloat(order.Total),
            EstadoEnvio: order.EstadoEnvio || "Desconocido",
            FechaEnvio: order.FechaEnvio,
          }));
          setOrders(ordersWithDetails);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [usuario]);

  if (loading) return <p>Cargando historial de pedidos...</p>;
  if (error) return <p>Error: {error}</p>;

  // Si no hay órdenes, mostrar el mensaje e imagen
  if (orders.length === 0) {
    return (
      <div className={styles.noOrdersContainer}>
        <h2 className={styles.title}>Historial de Pedidos</h2>
        <img
          src="https://img.freepik.com/vector-premium/mujer-compras-linea-comercio-electronico-carro-carrito-agregar-productos-comprar_22052-4518.jpg"
          alt="Sin compras"
          className={styles.noOrdersImage}
        />
        <p>Aún no realizas una compra, ¿Qué esperas para adquirir uno de nuestros productos?</p>
      </div>
    );
  }

  const handleDetailsClick = (ventaId) => {
    navigate(`/detalles-pedido/${ventaId}`);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Historial de Pedidos</h2>
      <div className={styles.ordersGrid}>
        {orders.map((order) => (
          <div key={order.VentaID} className={styles.orderCard}>
            <p className={styles.orderText}>Pedido # {order.VentaID}</p>
            <p className={styles.orderText}>
              Fecha de pedido:{" "}
              {new Date(order.FechaVenta).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
            <p className={styles.orderText}>
              Fecha de envío:{" "}
              {new Date(order.FechaEnvio).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
            <p className={styles.orderText}>
              Total:{" "}
              {typeof order.Total === "number"
                ? `$${order.Total.toFixed(2)}`
                : "N/A"}
            </p>
            <p className={styles.orderText}>Estado del pedido: {order.EstadoEnvio}</p>
            <button
              onClick={() => handleDetailsClick(order.VentaID)}
              className={styles.orderButton}
            >
              Más detalles
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
