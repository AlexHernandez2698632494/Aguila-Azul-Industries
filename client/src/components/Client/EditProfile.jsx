import React, { useState } from "react";
import styles from "../../css/EditProfile.module.css"; 
import Swal from "sweetalert2";

const EditProfile = ({ userProfile, onCancel, onSaveSuccess }) => {
  const [nombre, setNombre] = useState(userProfile.Nombre);
  const [correoElectronico, setCorreoElectronico] = useState(userProfile.CorreoElectronico);
  const [usuario, setUsuario] = useState(userProfile.usuario);
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [repetirContrasena, setRepetirContrasena] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [isFirebaseUser, setIsFirebaseUser] = useState(userProfile.UsuarioIDGoogle === 1);

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: '¿Estás seguro?',
      text: "Los cambios se guardarán en tu perfil",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const payload = {
            Nombre: nombre,
            CorreoElectronico: correoElectronico,
            usuario: usuario,
          };

          // Si se van a cambiar las contraseñas
          if (showPasswordFields && nuevaContrasena === repetirContrasena) {
            payload.Contraseña = nuevaContrasena;
          }

          const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
          const response = await fetch(`${API_URL}/users/${userProfile.UsuarioID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (response.ok) {
            const updatedUser = { usuario: usuario, NivelUsuario: userProfile.NivelUsuario };
            localStorage.setItem('usuario', JSON.stringify(updatedUser));

            Swal.fire('Actualizado', 'Usuario actualizado correctamente.', 'success').then(() => {
              onSaveSuccess();  // Notificar que los cambios fueron guardados
            });
          } else {
            throw new Error('Error al actualizar el usuario');
          }
        } catch (error) {
          Swal.fire('Error', error.message, 'error');
        }
      }
    });
  };

  const togglePasswordFields = () => {
    setShowPasswordFields(!showPasswordFields);
  };

  return (
    <form onSubmit={handleSaveChanges}>
      <div className={styles["edit-profile-container"]}>
        <div className={styles["columns-container"]}>
          <div className={styles["column"]}>
            {isFirebaseUser ? (
              // Solo puede modificar el nombre si es usuario de Google
              <div>
                <label>Nombre:</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
            ) : !showPasswordFields && (
              <>
                <div>
                  <label>Nombre:</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>
                <div>
                  <label>Correo Electrónico:</label>
                  <input
                    type="email"
                    value={correoElectronico}
                    onChange={(e) => setCorreoElectronico(e.target.value)}
                  />
                </div>
                <div>
                  <label>Usuario:</label>
                  <input
                    type="text"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                  />
                </div>
              </>
            )}

            {showPasswordFields && (
              <>
                <div>
                  <label>Contraseña Actual:</label>
                  <input
                    type="password"
                    value={contrasenaActual}
                    onChange={(e) => setContrasenaActual(e.target.value)}
                  />
                </div>
                <div>
                  <label>Nueva Contraseña:</label>
                  <input
                    type="password"
                    value={nuevaContrasena}
                    onChange={(e) => setNuevaContrasena(e.target.value)}
                  />
                </div>
                <div>
                  <label>Repetir Nueva Contraseña:</label>
                  <input
                    type="password"
                    value={repetirContrasena}
                    onChange={(e) => setRepetirContrasena(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {!isFirebaseUser && !showPasswordFields && (
          <div className={styles["forgot-password"]}>
            <button
              type="button"
              className={styles["change-password-link"]}
              onClick={togglePasswordFields}
            >
              Cambiar Contraseña
            </button>
          </div>
        )}

        <div className={styles["button-container"]}>
          <button
            type="button"
            className={styles["cancel-button"]}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={styles["submit-button"]}
          >
            {showPasswordFields ? "Guardar Contraseña" : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditProfile;