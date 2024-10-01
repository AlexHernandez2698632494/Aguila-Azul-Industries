import React from 'react';

const Notificacion = ({ tipo, mensaje, onClose }) => {
  return (
    <div className="notificacion">
      <div className={`notificacion-contenido ${tipo}`}>
        <span className={`icono ${tipo}`}></span>
        <p>{mensaje}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default Notificacion;
