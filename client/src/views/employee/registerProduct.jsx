import React, { useState, useEffect } from "react";
import styles from "../../css/registerProduct.module.css"; // Asegúrate de que la ruta sea correcta
import jsPDF from "jspdf";

const RegisterProduct = () => {
  const [productos, setProductos] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [listaCompras, setListaCompras] = useState([]);
  const [precioTotalCompra, setPrecioTotalCompra] = useState(0);
  const [nombreCliente, setNombreCliente] = useState("");
  const [direccionEntrega, setDireccionEntrega] = useState("");
  const [retiroEnLocal, setRetiroEnLocal] = useState(false);

  // Actualiza este useEffect para obtener los productos desde la API real
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"; // Aquí está la URL correcta
        const response = await fetch(`${API_URL}/products`); // URL para obtener los productos
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProductos();
  }, []);

  const agregarProducto = () => {
    if (!selectedProduct || cantidad < 1) return;
    const producto = productos.find((p) => p.Nombre === selectedProduct);
    const nuevoItem = {
      nombre: selectedProduct,
      cantidad,
      precioTotal: producto.Precio * cantidad,
    };
    setListaCompras([...listaCompras, nuevoItem]);
    setPrecioTotalCompra(precioTotalCompra + nuevoItem.precioTotal);
    setSelectedProduct("");
    setCantidad(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const venta = {
      productos: listaCompras,
      cliente: {
        nombre: nombreCliente,
        direccion: retiroEnLocal ? "Retiro en local" : direccionEntrega,
      },
      total: precioTotalCompra,
      fecha: new Date().toLocaleDateString(), // Agregar fecha de la venta
    };

    // Guardar el recibo en localStorage
    guardarReciboEnLocalStorage(venta);
  };

  const guardarReciboEnLocalStorage = (venta) => {
    const recibosPrevios = JSON.parse(localStorage.getItem("recibos")) || [];
    recibosPrevios.push(venta);
    localStorage.setItem("recibos", JSON.stringify(recibosPrevios));
    alert("Venta registrada y recibo guardado en la lista de informes.");
  };  
  
  return (
    <div>
      <h1>Registro de Venta</h1>
      <form onSubmit={handleSubmit} className={styles.registroVentaForm}>
    <div className={`${styles.formGroup} ${styles.gridItem1}`}>
        <label>Nombre del Producto:</label>
        <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
        >
            <option value="">Seleccione un producto</option>
            {productos.map((producto) => (
                <option key={producto.ProductoID} value={producto.Nombre}>
                    {producto.Nombre}
                </option>
            ))}
        </select>
    </div>

    <div className={`${styles.formGroup}`}>
        <label>Cantidad:</label>
        <input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            min="1"
        />
    </div>

    <div className={`${styles.gridItem2}`}>
        <button type="button" className={styles.button} onClick={agregarProducto}>
            Agregar producto a la lista
        </button>
    </div>
    <div className="lista-compras">
          <h4>Lista de Compras</h4>
          <ul>
            {listaCompras.map((item, index) => (
              <li key={index}>
                {item.cantidad} x {item.nombre}: ${item.precioTotal}
              </li>
            ))}
          </ul>
          <h4>Total: ${precioTotalCompra}</h4>
        </div>
    <div className={`${styles.formGroup} ${styles.gridItemFull}`}>
        <label>Nombre del Cliente:</label>
        <input
            type="text"
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
            placeholder="Nombre del cliente"
        />
    </div>

    {!retiroEnLocal && (
        <div className={`${styles.formGroup} ${styles.gridItemFull}`}>
            <label>Dirección de Entrega:</label>
            <input
                type="text"
                value={direccionEntrega}
                onChange={(e) => setDireccionEntrega(e.target.value)}
                placeholder="Dirección de entrega"
            />
        </div>
    )}

    <div className={`${styles.gridItemCheckbox}`}>
        <label>
            <input
                type="checkbox"
                className={styles.checkbox}
                checked={retiroEnLocal}
                onChange={(e) => setRetiroEnLocal(e.target.checked)}
            />
            Retiro en local
        </label>
    </div>

    <div className={`${styles.gridItemButton}`}>
        <button type="submit" className={styles.button}>Registrar Venta</button>
    </div>
</form>

    </div>
  );
};

export default RegisterProduct;
