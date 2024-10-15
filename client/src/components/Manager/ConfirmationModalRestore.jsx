import React from "react";
import styles from "../../css/confirmacionModalRestaurar.module.css";

const ConfirmationModal = ({ productName, onConfirm, onCancel }) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h3>Confirmación de Restauracion</h3>
        <p>
          ¿Estás seguro de que deseas restaurar el producto: <strong>{productName}</strong>?
        </p>
        <div className={styles.modalButtons}>
          <button className={`${styles.btn} ${styles.btnConfirm}`} onClick={onConfirm}>
            Restaurar
          </button>
          <button className={`${styles.btn} ${styles.btnCancel}`} onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
