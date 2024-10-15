import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaCreditCard, FaTruck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "../css/CheckoutPayment.module.css";
import { useAuth } from "../auth/AuthContext";

const CheckoutPayment = () => {
  const navigate = useNavigate();
  const [shippingData, setShippingData] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("01");
  const [expiryYear, setExpiryYear] = useState("24");
  const [cvv, setCvv] = useState("");
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const { login } = useAuth();

  useEffect(() => {
    const data = localStorage.getItem("shippingData");
    if (data) {
      setShippingData(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    const checkoutData = JSON.parse(localStorage.getItem("checkoutData"));
    if (checkoutData) {
      setSubtotal(checkoutData.subtotal || 0);
      setDiscount(checkoutData.discount || 0);
      setShippingCost(checkoutData.shippingCost || 0);
    }
  }, []);

  useEffect(() => {
    const calculatedTotal = subtotal - discount + shippingCost;
    setTotal(calculatedTotal);
  }, [subtotal, discount, shippingCost]);

  if (!shippingData) {
    return <div>Cargando...</div>;
  }

  const handleCartClick = () => {
    navigate("/checkout/cart");
  };

  const handleCredicCartClick = () => {
    navigate("/checkout/email");
  };

  const handlePaymentClick = () => {
    navigate("/checkout/payment");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    login();

    // Validación del número de tarjeta (16 dígitos y comienza con 51–55, 2221–2720 o 4)
    const cardNumberDigits = cardNumber.replace(/\D/g, ""); // Elimina guiones/espacios
    const validCardPrefix = /^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720|4)/;
    if (!validCardPrefix.test(cardNumberDigits) || cardNumberDigits.length !== 16) {
      Swal.fire({
        icon: "error",
        title: "Número de tarjeta inválido",
        text: "El número de tarjeta debe tener 16 dígitos y comenzar con 51-55, 2221-2720 o 4.",
      });
      return;
    }

    // Validación del nombre del titular (no vacío, solo letras y espacios)
    if (!cardHolder.trim() || !/^[a-zA-Z\s]+$/.test(cardHolder)) {
      Swal.fire({
        icon: "error",
        title: "Nombre del titular inválido",
        text: "El nombre del titular debe contener solo letras y no puede estar vacío.",
      });
      return;
    }

    // Validación de la fecha de expiración (no menor a la actual)
    const currentYear = new Date().getFullYear() % 100; // Últimos dos dígitos del año actual
    const currentMonth = new Date().getMonth() + 1; // Mes actual (0-11)
    if (parseInt(expiryYear) < currentYear || (parseInt(expiryYear) === currentYear && parseInt(expiryMonth) < currentMonth)) {
      Swal.fire({
        icon: "error",
        title: "Fecha de expiración inválida",
        text: "La tarjeta no puede estar vencida.",
      });
      return;
    }

    // Validación del CVV (exactamente 3 dígitos)
    if (cvv.length !== 3 || !/^\d{3}$/.test(cvv)) {
      Swal.fire({
        icon: "error",
        title: "CVV inválido",
        text: "El CVV debe tener 3 dígitos.",
      });
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const user =
        JSON.parse(localStorage.getItem("usuario")) ||
        JSON.parse(localStorage.getItem("usuarioFirebase"));
      const cartItems = JSON.parse(localStorage.getItem("cartItems"));
      const firstProduct = cartItems[0];
      const productID = firstProduct.ProductoID;
      const quantity = firstProduct.quantity;
      const username = user?.usuario;

      if (!username) {
        Swal.fire({
          icon: "error",
          title: "Usuario no encontrado",
          text: "No se encontró un usuario en el sistema. Por favor, inicie sesión.",
        });
        return;
      }

      const userResponse = await fetch(`${API_URL}/users/username/${username}`);
      if (!userResponse.ok) {
        throw new Error("Error al obtener el usuario");
      }
      const userData = await userResponse.json();
      const usuarioId = userData.UsuarioID;

      const inventoryResponse = await fetch(
        `${API_URL}/product/${productID}/inventory`
      );
      if (!inventoryResponse.ok) {
        throw new Error("Error al obtener el inventario del producto");
      }
      const inventoryData = await inventoryResponse.json();
      const cantidadDisponible = inventoryData.CantidadDisponible;

      if (quantity > cantidadDisponible) {
        Swal.fire({
          icon: "error",
          title: "Stock insuficiente",
          text: "No hay suficientes productos disponibles en inventario.",
        });
        return;
      }

      const ventaData = {
        usuarioId,
        departamento: shippingData.departamento,
        municipio: shippingData.municipio,
        descuento: discount,
        costoEnvio: shippingCost,
        subtotal,
        total,
        tiempoDiasEntrega: shippingData.diasEntrega,
        quienRecibe: shippingData.nombreRecibe,
        direccionEnvio: shippingData.direccion,
        cartItems: cartItems,
      };

      const ventaResponse = await fetch(`${API_URL}/ventas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ventaData),
      });

      if (!ventaResponse.ok) {
        throw new Error("Error al procesar la venta");
      }

      const ventaResult = await ventaResponse.json();

      Swal.fire({
        icon: "success",
        title: "Pago procesado",
        text: `La venta ha sido registrada exitosamente con el ID: ${ventaResult.ventaId}`,
      });

      // Limpiar el formulario y localStorage
      setCardNumber('');
      setCardHolder('');
      setExpiryMonth('01');
      setExpiryYear('24');
      setCvv('');

      localStorage.removeItem('cartItems');
      localStorage.removeItem('checkoutData');
      localStorage.removeItem('shippingData');

      navigate('/client')
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error en la venta",
        text: error.message,
      });
      navigate('/');
    }
  };

  const years = Array.from({ length: 41 }, (_, i) => (24 + i).toString());

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Elimina todo lo que no sea dígito
    if (value.length > 16) value = value.slice(0, 16); // Limitar a 16 dígitos
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1-");
    setCardNumber(formattedValue);
  };

  const handleCardHolderChange = (e) => {
    setCardHolder(e.target.value);
  };

  const handleExpiryMonthChange = (e) => {
    setExpiryMonth(e.target.value);
  };

  const handleExpiryYearChange = (e) => {
    setExpiryYear(e.target.value);
  };

  const handleCvvChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,3}$/.test(value)) {
      setCvv(value);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <img
            src="https://github.com/AlexHernandez2698632494/pictures/blob/main/Aguila_Azul_Industries%20(2).png?raw=true"
            alt="Logo"
          />
        </div>
        <div className={styles.icons}>
          <div
            className={`${styles.iconWithText} ${styles.darkBlueIcon}`}
            onClick={handleCartClick}
          >
            <FaShoppingCart className={`${styles.icon} ${styles.darkBlue}`} />
            <span className={styles.darkBlue}>Carrito de Compras</span>
          </div>
          <div className={`${styles.iconSeparator}`} />
          <div
            className={`${styles.iconWithText} ${styles.darkBlueIcon}`}
            onClick={handleCredicCartClick}
          >
            <FaCreditCard className={`${styles.icon} ${styles.darkBlue}`} />
            <span className={styles.darkBlue}>Tarjeta</span>
          </div>
          <div className={`${styles.iconSeparator}`} />
          <div
            className={`${styles.iconWithText} ${styles.paymentIcon}`}
            onClick={handlePaymentClick}
          >
            <FaTruck className={`${styles.icon} ${styles.whiteIcon}`} />
            <span className={styles.whiteText}>Entrega</span>
          </div>
        </div>
      </nav>
      <div className={styles.container}>
        <div className={styles.shippingColumn}>
          <h2>Método de entrega</h2>
          <div className={styles.shipping}>
            <div className={styles.header}>
              <FaTruck className={styles.icon} />
              <span className={styles.title}>Envío a domicilio</span>
              <span className={styles.price}>
                ${shippingData.precioEnvio.toFixed(2)}
              </span>
            </div>
            <div className={styles.address}>
              <span>
                {shippingData.direccion}, {shippingData.municipio} -{" "}
                {shippingData.departamento}
              </span>
            </div>
            <div className={styles.receive}>
              <span>Recibe: {shippingData.nombreRecibe}</span>
            </div>
            <div className={styles.time}>
              <span>En hasta: {shippingData.diasEntrega} días</span>
            </div>
          </div>
        </div>

        <div className={styles.paymentColumn}>
          <div className={styles.payment}>
            <h2>Tarjeta de Crédito o Débito</h2>
            <input
              type="text"
              placeholder="Número de tarjeta"
              value={cardNumber}
              onChange={handleCardNumberChange}
              required
            />
            <div>
              <strong>Total: ${total.toFixed(2)}</strong>
            </div>
            <input
              type="text"
              placeholder="Nombre y Apellido como figura en la tarjeta"
              value={cardHolder}
              onChange={handleCardHolderChange}
              required
            />
            <div>
              <select value={expiryMonth} onChange={handleExpiryMonthChange}>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={String(i + 1).padStart(2, "0")}>
                    {String(i + 1).padStart(2, "0")}
                  </option>
                ))}
              </select>
              <select value={expiryYear} onChange={handleExpiryYearChange}>
                {Array.from({ length: 41 }, (_, i) => (
                  <option key={i} value={String(i + 24)}>
                    {String(i + 24)}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              placeholder="Código de seguridad CVV"
              value={cvv}
              onChange={handleCvvChange}
              required
            />
          </div>
        </div>

        <div className={styles.paymentInfoColumn}>
          <div className={styles.paymentInfo}>
            <h3>Información de Pago</h3>
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <p>Descuento: -${discount.toFixed(2)}</p>
            <p>Envío: +${shippingCost.toFixed(2)}</p>
            <p>Total: ${total.toFixed(2)}</p>
            <button onClick={handleSubmit} className={styles.finally}>
              Finalizar compra
            </button>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <p>&copy; 2024 Tu Tienda. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default CheckoutPayment;
