import React from "react";

const ConfirmationModalEmpleado = ({ productName, onConfirm, onCancel }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Confirmación de Acción</h3>
        <p>
          ¿Estás seguro de que deseas realizar la acción sobre el producto: <strong>{productName}</strong>?
        </p>
        <div className="modal-buttons">
          <button className="btn btn-confirm" onClick={onConfirm}>
            Confirmar
          </button>
          <button className="btn btn-cancel" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModalEmpleado;
