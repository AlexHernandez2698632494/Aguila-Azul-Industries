import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import "../../css/registerProduct.css"

const RegisterProduct = () => {
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoriaID, setCategoriaID] = useState('');
  const [proveedorID, setProveedorID] = useState('');
  const [imagen, setImagen] = useState('');
  const [especificaciones, setEspecificaciones] = useState([{ nombre: '', valor: '' }]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const categoriesResponse = await fetch(`${API_URL}/categories`);
        if (!categoriesResponse.ok) {
          throw new Error('Error al obtener las categorías');
        }
        const categoriesData = await categoriesResponse.json();
        setCategorias(categoriesData);

        const suppliersResponse = await fetch(`${API_URL}/suppliers`);
        if (!suppliersResponse.ok) {
          throw new Error('Error al obtener proveedores');
        }
        const suppliersData = await suppliersResponse.json();
        setProveedores(suppliersData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const handleRegisterProduct = async (e) => {
    e.preventDefault();

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${API_URL}/product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Nombre: nombre,
          Descripcion: descripcion,
          Precio: parseFloat(precio),
          CategoriaID: categoriaID,
          ProveedorID: proveedorID,
          Imagen: imagen,
          Especificaciones: especificaciones,
        }),
      });

      if (!response.ok) throw new Error('Error al registrar el producto');

      Swal.fire({
        title: "Producto Registrado",
        text: "El producto ha sido registrado exitosamente",
        icon: "success",
        confirmButtonText: "Aceptar"
      });

      setNombre('');
      setDescripcion('');
      setPrecio('');
      setCategoriaID('');
      setProveedorID('');
      setImagen('');
      setEspecificaciones([{ nombre: '', valor: '' }]);
      
    } catch (error) {
      setError(error.message);
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "Aceptar"
      });
    }
  };

  return (
    <div className="full-height">
      <div className="container flex-grow">
        <h1>Registro de Productos</h1>
        {error && <p className="error-class">{error}</p>}
        <form onSubmit={handleRegisterProduct}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="descripcion">Descripción:</label>
            <textarea
              id="descripcion"
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="precio">Precio:</label>
            <input
              type="number"
              id="precio"
              placeholder="Precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="categoriaID">Categoría:</label>
            <select
              id="categoriaID"
              value={categoriaID}
              onChange={(e) => setCategoriaID(e.target.value)}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.CategoriaID} value={categoria.CategoriaID}>
                  {categoria.Nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="proveedorID">Proveedor:</label>
            <select
              id="proveedorID"
              value={proveedorID}
              onChange={(e) => setProveedorID(e.target.value)}
              required
            >
              <option value="">Selecciona un proveedor</option>
              {proveedores.map((proveedor) => (
                <option key={proveedor.ProveedorID} value={proveedor.ProveedorID}>
                  {proveedor.Nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="imagen">Imagen (URL):</label>
            <input
              type="text"
              id="imagen"
              placeholder="Enlace de la imagen"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
              required
            />
          </div>
          <h3>Especificaciones</h3>
          <button
            type="button"
            className="newSpecification-class"
            onClick={() => setEspecificaciones([...especificaciones, { nombre: '', valor: '' }])}
          >
            Agregar Especificación
          </button>
          {especificaciones.map((spec, index) => (
            <div key={index} className="specification-input form-group">
              <label>Especificación:</label>
              <input
                type="text"
                placeholder="Nombre de Especificación"
                value={spec.nombre}
                onChange={(e) => {
                  const newEspecificaciones = [...especificaciones];
                  newEspecificaciones[index].nombre = e.target.value;
                  setEspecificaciones(newEspecificaciones);
                }}
                required
              />
              <input
                type="text"
                placeholder="Valor de Especificación"
                value={spec.valor}
                onChange={(e) => {
                  const newEspecificaciones = [...especificaciones];
                  newEspecificaciones[index].valor = e.target.value;
                  setEspecificaciones(newEspecificaciones);
                }}
                required
              />
            </div>
          ))}
          <button type="submit" className="newProduct-class">Registrar Producto</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterProduct;
