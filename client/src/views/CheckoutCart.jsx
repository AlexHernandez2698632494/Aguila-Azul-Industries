import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import styles from "../css/CheckoutCart.module.css"; 
import { FaShoppingCart, FaCreditCard, FaTruck, FaMinus, FaPlus } from "react-icons/fa";

const CheckoutCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [department, setDepartment] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [shippingCost, setShippingCost] = useState(0);

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

  const municipalities = [
    "AHUACHAPÁN NORTE",
    "AHUACHAPÁN CENTRO",
    "AHUACHAPÁN SUR",
    "SAN SALVADOR NORTE",
    "SAN SALVADOR OESTE",
    "SAN SALVADOR ESTE",
    "SAN SALVADOR CENTRO",
    "SAN SALVADOR SUR",
    "LA LIBERTAD NORTE",
    "LA LIBERTAD CENTRO",
    "LA LIBERTAD OESTE",
    "LA LIBERTAD ESTE",
    "LA LIBERTAD COSTA",
    "LA LIBERTAD SUR",
    "CHALATENANGO NORTE",
    "CHALATENANGO CENTRO",
    "CHALATENANGO SUR",
    "CUSCATLÁN NORTE",
    "CUSCATLÁN SUR",
    "CABAÑAS ESTE",
    "CABAÑAS OESTE",
    "LA PAZ OESTE",
    "LA PAZ CENTRO",
    "LA PAZ ESTE",
    "LA UNIÓN NORTE",
    "LA UNIÓN SUR",
    "USULUTÁN NORTE",
    "USULUTÁN ESTE",
    "USULUTÁN OESTE",
    "SONSONATE NORTE",
    "SONSONATE CENTRO",
    "SONSONATE ESTE",
    "SONSONATE OESTE",
    "SANTA ANA NORTE",
    "SANTA ANA CENTRO",
    "SANTA ANA ESTE",
    "SANTA ANA OESTE",
    "SAN VICENTE NORTE",
    "SAN VICENTE SUR",
    "SAN MIGUEL NORTE",
    "SAN MIGUEL CENTRO",
    "SAN MIGUEL OESTE",
    "MORAZÁN NORTE",
    "MORAZÁN SUR",
  ];

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
    calculateShipping(e.target.value, municipality);
  };

  const handleMunicipalityChange = (e) => {
    setMunicipality(e.target.value);
    calculateShipping(department, e.target.value);
  };

  const calculateShipping = (dept, muni) => {
    if (dept && shippingCosts[dept]) {
      setShippingCost(shippingCosts[dept]);
    } else {
      setShippingCost(0);
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
    navigate("/checkout/shipping"); // Redirige a /checkout/shipping
  };

  const handleCartClick = () => {
    navigate("/checkout/cart"); // Redirige a /checkout/cart
  };

  return (
    <div className={styles.pageContainer}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <img src="https://github.com/AlexHernandez2698632494/pictures/blob/main/Aguila_Azul_Industries%20(2).png?raw=true" alt="Logo" />
        </div>
        <div className={styles.icons}>
          <div className={`${styles.iconWithText} ${styles.cartIcon}`} onClick={handleCartClick}>
            <FaShoppingCart className={`${styles.icon} ${styles.whiteIcon}`} />
            <span className={styles.whiteText}>Carrito de Compras</span>
          </div>
          <div className={`${styles.iconSeparator}`} />
          <div className={`${styles.iconWithText} ${styles.darkBlueIcon}`}>
            <FaCreditCard className={`${styles.icon} ${styles.darkBlue}`} />
            <span className={styles.darkBlue}>Tarjeta</span>
          </div>
          <div className={`${styles.iconSeparator}`} />
          <div className={`${styles.iconWithText} ${styles.darkBlueIcon}`}>
            <FaTruck className={`${styles.icon} ${styles.darkBlue}`} />
            <span className={styles.darkBlue}>Entrega</span>
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
            <select onChange={handleDepartmentChange} value={department}>
              <option value="">Selecciona un departamento</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <select onChange={handleMunicipalityChange} value={municipality}>
              <option value="">Selecciona un municipio</option>
              {municipalities.map((muni) => (
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
            <button className={styles.continueButton} onClick={handleContinueClick}>
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