import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import styles from "../../css/VerInformes.module.css";

const VerInformes = () => {
  const [recibos, setRecibos] = useState([]);

  useEffect(() => {
    // Carga los recibos guardados en localStorage
    const recibosGuardados = JSON.parse(localStorage.getItem("recibos")) || [];
    setRecibos(recibosGuardados);
  }, []);

  const descargarRecibo = (recibo) => {
    const doc = new jsPDF();
    doc.text(`Cliente: ${recibo.cliente.nombre}`, 10, 10);
    doc.text(`Dirección: ${recibo.cliente.direccion}`, 10, 20);
    doc.text(`Fecha: ${recibo.fecha}`, 10, 30);

    let yPos = 40;
    recibo.productos.forEach((producto, index) => {
      doc.text(
        `${index + 1}. ${producto.cantidad} x ${producto.nombre} - Total: $${producto.precioTotal}`,
        10,
        yPos
      );
      yPos += 10;
    });

    doc.text(`Total de la Compra: $${recibo.total}`, 10, yPos + 10);
    doc.save(`recibo-${recibo.fecha}.pdf`);
  };

  return (
    <div className={styles.informesContainer}>
      <h1 className={styles.heading}>Informes</h1>
      <ul className={styles.reciboList}>
        {recibos.map((recibo, index) => (
          <li key={index} className={styles.reciboItem}>
            <p className={styles.reciboText}>
              Recibo {index + 1} - Cliente: {recibo.cliente.nombre} - Total: $
              {recibo.total}
            </p>
            <button
              className={styles.downloadButton}
              onClick={() => descargarRecibo(recibo)}
            >
              Descargar Recibo
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VerInformes;
