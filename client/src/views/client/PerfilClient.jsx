import React, { useState, useEffect } from "react";
import EditProfile from "../../components/Client/EditProfile";
import styles from "../../css/EditProfile.module.css";

const PerfilClient = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("usuario"));
      if (!storedUser) {
        throw new Error("No se encontró el usuario en localStorage");
      }

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${API_URL}/users/username/${storedUser.usuario}`);

      if (!response.ok) {
        throw new Error("Error al obtener el perfil");
      }

      const data = await response.json();
      setUserProfile(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveSuccess = () => {
    // Actualizar el perfil y volver a la vista normal
    fetchUserProfile();
    setIsEditing(false);
  };

  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p>Error al cargar el perfil: {error}</p>;

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.profileHeader}>Perfil de Usuario</h2>
      {userProfile ? (
        <div className={styles.profileDetails}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/6073/6073873.png"
            alt="Imagen de perfil"
            className={styles.profileImage}
          />

          {!isEditing ? (
            <div className={styles.profileInfo}>
              <p><strong>Nombre:</strong> {userProfile.Nombre}</p>
              <p><strong>Correo Electrónico:</strong> {userProfile.CorreoElectronico}</p>
              <p><strong>Usuario:</strong> {userProfile.usuario}</p>
              <button onClick={handleEditProfile} className={styles.editButton}>Editar Perfil</button>
            </div>
          ) : (
            <EditProfile
              userProfile={userProfile}
              onCancel={handleCancelEdit}
              onSaveSuccess={handleSaveSuccess}  // Pasamos la función de éxito
            />
          )}
        </div>
      ) : (
        <p>No se encontró el perfil.</p>
      )}
    </div>
  );
};

export default PerfilClient;