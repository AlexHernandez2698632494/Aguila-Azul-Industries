import React from "react";

const ConfirmationModal = ({ productName, onConfirm, onCancel }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Confirmación de Eliminación</h3>
        <p>
          ¿Estás seguro de que deseas eliminar el producto: <strong>{productName}</strong>?
        </p>
        <div className="modal-buttons">
          <button className="btn btn-confirm" onClick={onConfirm}>
            Eliminar
          </button>
          <button className="btn btn-cancel" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
