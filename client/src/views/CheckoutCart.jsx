import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import styles from "../css/CheckoutCart.module.css";
import {
  FaShoppingCart,
  FaCreditCard,
  FaTruck,
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import Swal from "sweetalert2";

const CheckoutCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [department, setDepartment] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const [deliveryTime, setDeliveryTime] = useState(0); // Estado para el tiempo de entrega

  const navigate = useNavigate(); // Inicializa el hook useNavigate

  // Datos de departamentos y municipios
  const departments = [
    "Ahuachapán",
    "Cabañas",
    "Chalatenango",
    "Cuscatlán",
    "La Libertad",
    "Morazán",
    "La Paz",
    "Santa Ana",
    "San Miguel",
    "San Salvador",
    "San Vicente",
    "Sonsonate",
    "La Unión",
    "Usulután",
  ];

  const municipalities = {
    "Ahuachapán": ["AHUACHAPÁN NORTE", "AHUACHAPÁN CENTRO", "AHUACHAPÁN SUR"],
    "Cabañas": ["CABAÑAS ESTE", "CABAÑAS OESTE"],
    "Chalatenango": ["CHALATENANGO NORTE", "CHALATENANGO CENTRO", "CHALATENANGO SUR"],
    "Cuscatlán": ["CUSCATLÁN NORTE", "CUSCATLÁN SUR"],
    "La Libertad": ["LA LIBERTAD NORTE", "LA LIBERTAD CENTRO", "LA LIBERTAD OESTE", "LA LIBERTAD ESTE", "LA LIBERTAD COSTA", "LA LIBERTAD SUR"],
    "Morazán": ["MORAZÁN NORTE", "MORAZÁN SUR"],
    "La Paz": ["LA PAZ OESTE", "LA PAZ CENTRO", "LA PAZ ESTE"],
    "Santa Ana": ["SANTA ANA NORTE", "SANTA ANA CENTRO", "SANTA ANA ESTE", "SANTA ANA OESTE"],
    "San Miguel": ["SAN MIGUEL NORTE", "SAN MIGUEL CENTRO", "SAN MIGUEL OESTE"],
    "San Salvador": ["SAN SALVADOR NORTE", "SAN SALVADOR OESTE", "SAN SALVADOR ESTE", "SAN SALVADOR CENTRO", "SAN SALVADOR SUR"],
    "San Vicente": ["SAN VICENTE NORTE", "SAN VICENTE SUR"],
    "Sonsonate": ["SONSONATE NORTE", "SONSONATE CENTRO", "SONSONATE ESTE", "SONSONATE OESTE"],
    "La Unión": ["LA UNIÓN NORTE", "LA UNIÓN SUR"],
    "Usulután": ["USULUTÁN NORTE", "USULUTÁN ESTE", "USULUTÁN OESTE"]
  };

  const shippingCosts = {
    Ahuachapán: 5,
    Cabañas: 6.5,
    Chalatenango: 6.5,
    Cuscatlán: 7.5,
    "La Libertad": 6.5,
    Morazán: 6.5,
    "La Paz": 6.5,
    "Santa Ana": 6.5,
    "San Miguel": 7,
    "San Salvador": 3,
    "San Vicente": 6.5,
    Sonsonate: 6.5,
    "La Unión": 6.5,
    Usulután: 6.5,
  };

  const deliveryTimes = {
    Ahuachapán: 4,
    Cabañas: 6,
    Chalatenango: 6,
    Cuscatlán: 7,
    "La Libertad": 6,
    Morazán: 6,
    "La Paz": 6,
    "Santa Ana": 6,
    "San Miguel": 6,
    "San Salvador": 2,
    "San Vicente": 6,
    Sonsonate: 6,
    "La Unión": 6,
    Usulután: 6,
  };

  const loadCartItems = () => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCartItems);
  };

  useEffect(() => {
    loadCartItems();
  }, []);

  useEffect(() => {
    const subtotalValue = cartItems.reduce((acc, item) => {
      const price = parseFloat(item.Precio) || 0;
      const quantity = item.quantity || 0;
      return acc + price * quantity;
    }, 0);

    const discountValue = cartItems.reduce((acc, item) => {
      const price = parseFloat(item.Precio) || 0;
      return acc + (price / 10) * item.quantity;
    }, 0);

    const totalValue = subtotalValue - discountValue + shippingCost;

    setSubtotal(subtotalValue);
    setDiscount(discountValue);
    setTotal(totalValue);
  }, [cartItems, shippingCost]);

  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
    setMunicipality(""); // Reiniciar municipio al cambiar de departamento
    calculateShipping(e.target.value);
    calculateDeliveryTime(e.target.value);
  };

  const handleMunicipalityChange = (e) => {
    setMunicipality(e.target.value);
  };

  const calculateShipping = (dept) => {
    if (dept && shippingCosts[dept]) {
      setShippingCost(shippingCosts[dept]);
    } else {
      setShippingCost(0);
    }
  };

  const calculateDeliveryTime = (dept) => {
    if (dept && deliveryTimes[dept]) {
      setDeliveryTime(deliveryTimes[dept]);
    } else {
      setDeliveryTime(0); // Default si no hay departamento seleccionado
    }
  };

  const handleQuantityChange = (id, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.ProductoID === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const increaseQuantity = (id, currentQuantity, maxQuantity) => {
    if (currentQuantity < maxQuantity) {
      handleQuantityChange(id, currentQuantity + 1);
    }
  };

  const decreaseQuantity = (id, currentQuantity) => {
    if (currentQuantity > 1) {
      handleQuantityChange(id, currentQuantity - 1);
    }
  };

  const handleContinueClick = () => {
    if (department && municipality) {
      const user = JSON.parse(localStorage.getItem("usuario")); // Obtiene datos de usuario desde localStorage
      const userFirebase = JSON.parse(localStorage.getItem("usuarioFirebase"));
      const shippingData = JSON.parse(localStorage.getItem("shippingData")); // Obtiene datos de envío desde localStorage

      const checkoutData = {
        cartItems,
        department,
        municipality,
        subtotal,
        discount,
        shippingCost,
        total,
        deliveryTime, // Agrega el tiempo de entrega
      };

      localStorage.setItem("checkoutData", JSON.stringify(checkoutData));

      if (shippingData && (user || userFirebase)) {
        Swal.fire({
          title: "Redirigiendo",
          text: `Tu información ha sido guardada. Continuando a la página de pago.`,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/checkout/payment");
        });
      } else if (!shippingData && (user || userFirebase)) {
        Swal.fire({
          title: "¡Datos guardados!",
          text: `El tiempo estimado de entrega es de ${deliveryTime} días. Continuando a la página de envío.`,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/checkout/shipping");
        });
      } else {
        Swal.fire({
          title: "¡Datos guardados!",
          text: "No se encontraron datos de usuario. Guardando información y continuando a la página de correo.",
          icon: "info",
          confirmButtonText: "OK",
        }).then(() => {
          localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
          navigate("/checkout/email");
        });
      }
    } else {
      Swal.fire({
        title: "Error",
        text: "Por favor selecciona un departamento y un municipio antes de continuar.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleCartClick = () => {
    navigate("/checkout/cart");
  };

  const handleCredicCartClick = () => {
    navigate("/checkout/email");
  };

  const handlePaymenetClick = () => {
    navigate("/checkout/payment");
  };

  return (
    <div className={styles.pageContainer}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <img
            src="https://github.com/AlexHernandez2698632494/pictures/blob/main/Aguila_Azul_Industries%20(2).png?raw=true"
            alt="Logo"
          />
        </div>
        <div className={styles.icons}>
          <div
            className={`${styles.iconWithText} ${styles.cartIcon}`}
            onClick={handleCartClick}
          >
            <FaShoppingCart className={`${styles.icon} ${styles.whiteIcon}`} />
            <span className={styles.whiteText}>Carrito de Compras</span>
          </div>
          <div className={`${styles.iconSeparator}`} />
          <div
            className={`${styles.iconWithText} ${styles.darkBlueIcon}`}
            onClick={handleCredicCartClick}
          >
            <FaCreditCard className={`${styles.icon} ${styles.darkBlue}`} />
            <span className={styles.darkBlue}>Tarjeta de Credito</span>
          </div>
          <div className={styles.iconSeparator} />
          <div
            className={`${styles.iconWithText} ${styles.darkBlueIcon}`}
            onClick={handlePaymenetClick}
          >
            <FaTruck className={`${styles.icon} ${styles.whiteIcon}`} />
            <span className={styles.whiteText}>Pago</span>
          </div>
        </div>
      </nav>

      <div className={styles.container}>
        <div className={styles.cartColumn}>
          <h2>Productos en el carrito</h2>
          {cartItems.length > 0 ? (
            <ul className={styles.cartItemsList}>
              {cartItems.map((item) => (
                <li key={item.ProductoID} className={styles.cartItem}>
                  <div className={styles.cartItemImage}>
                    <img src={item.Imagen} alt={item.Nombre} />
                  </div>
                  <div className={styles.cartItemDetails}>
                    <h4>{item.Nombre}</h4>
                    <p className={styles.currentPrice}>
                      ${parseFloat(item.Precio).toFixed(2)}
                    </p>
                    <div className={styles.quantityControl}>
                      <button
                        className={styles.quantityButton}
                        onClick={() =>
                          decreaseQuantity(item.ProductoID, item.quantity)
                        }
                      >
                        <FaMinus />
                      </button>
                      <span>{item.quantity || 1}</span>
                      <button
                        className={styles.quantityButton}
                        onClick={() =>
                          increaseQuantity(
                            item.ProductoID,
                            item.quantity,
                            item.CantidadDisponible
                          )
                        }
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Tu carrito está vacío</p>
          )}
        </div>

        <div className={styles.summaryColumn}>
          <h2>Detalles de envío</h2>
          <div className={styles.selectContainer}>
            <select
              onChange={handleDepartmentChange}
              value={department}
              required
            >
              <option value="">Selecciona un departamento</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              onChange={handleMunicipalityChange}
              value={municipality}
              disabled={!department}
              required
            >
              <option value="">Selecciona un municipio</option>
              {department &&
                municipalities[department]?.map((muni) => (
                  <option key={muni} value={muni}>
                    {muni}
                  </option>
                ))}
            </select>
          </div>

          <div className={styles.cartSummary}>
            <h3>Resumen de compra</h3>
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <p>Descuento: ${discount.toFixed(2)}</p>
            <p>Costo de Envío: ${shippingCost.toFixed(2)}</p>
            <p>Total: ${total.toFixed(2)}</p>
            <button
              className={styles.continueButton}
              onClick={handleContinueClick}
            >
              Continuar Compra
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

export default CheckoutCart;
