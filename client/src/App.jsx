import React, { useState } from "react";
import { FaBars, FaShoppingCart, FaTimes, FaUser } from "react-icons/fa";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./App.css";

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <FaBars onClick={() => setMenuOpen(true)} className="icon" />
        <h1>Mi Tienda</h1>
        <FaShoppingCart onClick={() => setCartOpen(true)} className="icon" />
      </nav>

      {/* Menu Lateral */}
      {menuOpen && (
        <div className="side-menu">
          <div className="menu-header">
            <FaTimes
              onClick={() => setMenuOpen(false)}
              className="icon close-menu"
            />
            <FaUser className="icon user-icon" />
          </div>
          <ul>
            <li>
              <a href="/">Inicio</a>
            </li>
            <li>
              <span
                className="categories-title"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
              >
                Categorías
              </span>
              {categoriesOpen && (
                <ul className="submenu">
                  <li>
                    <a href="#">Alimentos</a>
                  </li>
                  <li>
                    <a href="#">Ropa</a>
                  </li>
                  <li>
                    <a href="#">Tecnología</a>
                  </li>
                  <li>
                    <a href="#">Químicos</a>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      )}

      {/* Carrito */}
      {cartOpen && (
        <div className="cart">
          <FaTimes
            onClick={() => setCartOpen(false)}
            className="icon close-cart"
          />
          <h2>Carrito de Compras</h2>
          {cartItems.length > 0 ? (
            <ul>
              {cartItems.map((item, index) => (
                <li key={index}>{item.name}</li>
              ))}
            </ul>
          ) : (
            <p>Tu carrito está vacío</p>
          )}
        </div>
      )}

      {/* Carrusel */}
      <Carousel
        className="carousel-container"
        showThumbs={false}
        autoPlay
        infiniteLoop
      >
        <div>
          <img
            src="https://www.sony.com.co/image/72fa15aa8f92f6e2e16b29d8724313c8?fmt=png-alpha&wid=800"
            alt="Imagen 1"
          />
        </div>
        <div>
          <img
            src="https://static.wixstatic.com/media/f595eb_fd095a9835a64311a627db1af564d04d.jpg/v1/fit/w_2500,h_1330,al_c/f595eb_fd095a9835a64311a627db1af564d04d.jpg"
            alt="Imagen 2"
          />
        </div>
        <div>
          <img src="/img3.jpg" alt="Imagen 3" />
        </div>
        <div>
          <img src="/img4.jpg" alt="Imagen 4" />
        </div>
        <div>
          <img src="/img5.jpg" alt="Imagen 5" />
        </div>
      </Carousel>

      {/* Tres columnas de tarjetas */}
      <div className="cards">
        <div className="card">Producto 1</div>
        <div className="card">Producto 2</div>
        <div className="card">Producto 3</div>
        <div className="card">Producto 4</div>
        <div className="card">Producto 5</div>
        <div className="card">Producto 6</div>
        <div className="card">Producto 7</div>
        <div className="card">Producto 8</div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 Mi Tienda</p>
      </footer>
    </div>
  );
};

export default App;
