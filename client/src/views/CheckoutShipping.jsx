import React, { useState } from "react";
import { FaShoppingCart, FaCreditCard, FaTruck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "../css/CheckoutShipping.module.css";
import Swal from 'sweetalert2';

const CheckoutShipping = () => {
  const navigate = useNavigate();
  
  const [departamento, setDepartamento] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [direccion, setDireccion] = useState("");
  const [nombreRecibe, setNombreRecibe] = useState("");
  const [precioEnvio, setPrecioEnvio] = useState(0.00);
  const [diasEntrega, setDiasEntrega] = useState(2); // Supuesto de tiempo de entrega en días

  const departamentosEnvio = {
    "Ahuachapán": 5,
    "Cabañas": 6.5,
    "Chalatenango": 6.5,
    "Cuscatlán": 7.5,
    "La Libertad": 6.5,
    "Morazán": 6.5,
    "La Paz": 6.5,
    "Santa Ana": 6.5,
    "San Miguel": 7,
    "San Salvador": 3,
    "San Vicente": 6.5,
    "Sonsonate": 6.5,
    "La Unión": 6.5,
    "Usulután": 6.5,
  };

  const municipiosPorDepartamento = {
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

  const handleDepartamentoChange = (e) => {
    const selectedDepartamento = e.target.value;
    setDepartamento(selectedDepartamento);
    setMunicipio(""); // Reiniciar el municipio cuando se cambie el departamento

    // Calcula el precio de envío según el departamento seleccionado
    if (departamentosEnvio[selectedDepartamento]) {
      setPrecioEnvio(departamentosEnvio[selectedDepartamento]);
    } else {
      setPrecioEnvio(0.00); // Si no hay un departamento seleccionado, el envío es $0.00
    }
  };

  const handleSaveClick = (e) => {
    e.preventDefault(); // Previene el envío del formulario
  
    // Validar que todos los campos estén completos
    if (!departamento || !municipio || !direccion || !nombreRecibe) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, completa todos los campos requeridos.',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
  
    // Guardar los datos en localStorage
    const shippingData = {
      departamento,
      municipio,
      direccion,
      nombreRecibe,
      precioEnvio,
      diasEntrega
    };
  
    localStorage.setItem('shippingData', JSON.stringify(shippingData));
  
    // Mostrar una alerta de éxito al guardar
    Swal.fire({
      icon: 'success',
      title: 'Datos guardados',
      text: 'La información de envío se ha guardado correctamente.',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Redirigir a la página de pago
        navigate("/checkout/payment");
      }
    });
  };
  
  


  const handleCartClick = () => {
    navigate("/checkout/cart");
  };

  const handleCredicCartClick = () => {
    navigate("/checkout/email");
  };

  const handlePaymentClick = () => {
    navigate("/checkout/payment");
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
        <div className={styles.summaryColumn}>
          <h2>Envío a domicilio</h2>
          <form className={styles.shippingForm}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Departamento</label>
                <select
                  className={styles.formControl}
                  value={departamento}
                  onChange={handleDepartamentoChange}
                >
                  <option value="">Selecciona un departamento</option>
                  {Object.keys(departamentosEnvio).map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Municipio</label>
                <select
                  className={styles.formControl}
                  value={municipio}
                  onChange={(e) => setMunicipio(e.target.value)}
                  disabled={!departamento} // Deshabilitar si no hay un departamento seleccionado
                >
                  <option value="">Selecciona un municipio</option>
                  {municipiosPorDepartamento[departamento]?.map((mun) => (
                    <option key={mun} value={mun}>
                      {mun}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Dirección</label>
                <input
                  type="text"
                  className={styles.formControl}
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Ingresa tu dirección"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Información adicional</label>
                <input
                  type="text"
                  className={styles.formControl}
                  placeholder="Información adicional (opcional)"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Nombre de quien recibe</label>
              <input
                type="text"
                className={styles.formControl}
                value={nombreRecibe}
                onChange={(e) => setNombreRecibe(e.target.value)}
                placeholder="Nombre de quien recibe"
              />
            </div>

            <div className={styles.deliveryInfo}>
              <div className={styles.deliveryOption}>
                <FaTruck className={styles.deliveryIcon} />
                <span>Envío a domicilio</span>
              </div>
              <div className={styles.deliveryCost}>
                <span>${precioEnvio.toFixed(2)}</span>
                <span>{diasEntrega} días hábiles</span>
              </div>
            </div>

            <button className={styles.saveButton} onClick={handleSaveClick}>
              Guardar datos
            </button>
          </form>
        </div>
      </div>
      <footer className={styles.footer}>
        <p>&copy; 2024 Tu Tienda. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default CheckoutShipping;
