import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaCreditCard, FaTruck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Importa SweetAlert2
import styles from "../css/CheckoutPayment.module.css";

const CheckoutPayment = () => {
  const navigate = useNavigate();
  const [shippingData, setShippingData] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('01');
  const [expiryYear, setExpiryYear] = useState('24');
  const [cvv, setCvv] = useState('');
 const [cardName, setCardName] = useState("");
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);

  useEffect(() => {
    const data = localStorage.getItem("shippingData");
    if (data) {
      setShippingData(JSON.parse(data)); // Parsear el JSON
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

  // Calcular total basado en los datos
  useEffect(() => {
    const calculatedTotal = subtotal - discount + shippingCost;
    setTotal(calculatedTotal);
  }, [subtotal, discount, shippingCost]);

  if (!shippingData) {
    return <div>Cargando...</div>; // Mostrar mensaje de carga si no hay datos
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

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const currentYear = new Date().getFullYear() % 100; // Obtener los últimos dos dígitos del año actual
    const currentMonth = new Date().getMonth() + 1; // Obtener el mes actual (0 indexado, por eso sumamos 1)
  
    // Validar que el año sea mayor que el actual, o si es igual, que el mes no sea menor que el actual
    if (
      parseInt(expiryYear, 10) < currentYear ||
      (parseInt(expiryYear, 10) === currentYear && parseInt(expiryMonth, 10) < currentMonth)
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Fecha de vencimiento inválida',
        text: 'La tarjeta no puede estar vencida.',
      });
      return;
    }

    // Remover los guiones para la validación
    const sanitizedCardNumber = cardNumber.replace(/-/g, '');
  
    // Expresión regular para validar Visa/MasterCard
    const cardRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9]{2}|7(?:[01][0-9]|20))[0-9]{12})$/;
  
    // Validar longitud y patrón de la tarjeta
    if (!cardRegex.test(sanitizedCardNumber)) {
      Swal.fire({
        icon: 'error',
        title: 'Número de tarjeta inválido',
        text: 'Por favor, ingrese un número de tarjeta válido en el formato correcto.',
      });
      return; // Detener si el número de tarjeta no es válido
    }
  
    if (!cardHolder || !cvv || expiryMonth === 'MM' || expiryYear === 'AA') {
      Swal.fire({
        icon: 'error',
        title: 'Información incompleta',
        text: 'Por favor, complete todos los campos.',
      });
      return; // Detener si falta información
    }
  
    // Datos de pago
    const paymentData = {
      cardNumber: sanitizedCardNumber,
      cardHolder,
      expiryMonth,
      expiryYear,
      cvv,
      total,
    };
  
    // Guardar datos de pago en localStorage
    localStorage.setItem('paymentData', JSON.stringify(paymentData));
  
    Swal.fire({
      icon: 'success',
      title: 'Pago procesado',
      text: 'Los datos de pago han sido guardados exitosamente.',
    });
  
    // Reiniciar campos del formulario después de guardar
    setCardNumber('');
    setCardHolder('');
    setExpiryMonth('01');
    setExpiryYear('24');
    setCvv('');
  };

  

  // Generar opciones de año desde 2024 hasta 2064
  const years = Array.from({ length: 41 }, (_, i) => (24 + i).toString());
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Elimina todo lo que no sea dígito
    if (value.length > 16) value = value.slice(0, 16); // Limitar a 16 dígitos
  
    // Autoformato: insertar un guion cada 4 dígitos
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1-");
    setCardNumber(formattedValue);
  };
  

// Función para manejar el cambio en el nombre del propietario
const handleCardHolderChange = (e) => {
    setCardHolder(e.target.value);
};

// Función para manejar el cambio en el mes de vencimiento
const handleExpiryMonthChange = (e) => {
    setExpiryMonth(e.target.value);
};

// Función para manejar el cambio en el año de vencimiento
const handleExpiryYearChange = (e) => {
    setExpiryYear(e.target.value);
};

// Función para manejar el cambio en el CVV
const handleCvvChange = (e) => {
    setCvv(e.target.value);
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
