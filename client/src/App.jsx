import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import CarouselSection from "./components/CarouselSection";
import SideMenu from "./components/SideMenu";
import CardsSection from "./components/CardsSection";
import ProductsByCategory from "./components/ProductsByCategory";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
// vistas de gerente
import ManagerIndex from "./components/Manager/App";
// vistas de empleados
import EmployeeIndex from "./components/Employees/App";
// vistas de clientes
import ClientIndex from "./components/Client/App";
import "./App.css";

const AppContent = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const location = useLocation(); // Obtén la ubicación actual dentro del Router

  // Función para agregar productos al carrito
  const handleAddToCart = (product, quantity) => {
    const newItem = {
      name: product.Nombre,
      price: product.Precio,
      quantity,
    };

    setCartItems((prevItems) => [...prevItems, newItem]);
  };

  // Verifica si la ruta actual es para Manager, Employee o Client
  const hideNavbarRoutes = ["/manager", "/employee", "/client"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="app">
      {!shouldHideNavbar && (
        <Navbar
          setMenuOpen={setMenuOpen}
          setCartOpen={setCartOpen}
          cartItems={cartItems}
        />
      )}
      <SideMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <CarouselSection />
              <CardsSection />
            </>
          }
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/manager"
          element={<ManagerIndex />}
        />
        <Route
          path="/employee"
          element={<EmployeeIndex />}
        />
        <Route
          path="/client"
          element={<ClientIndex />}
        />
        <Route
          path="/category/:id"
          element={<ProductsByCategory />}
        />
        <Route
          path="/product/:id"
          element={<ProductDetail handleAddToCart={handleAddToCart} />}
        />
      </Routes>
      <Cart
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        cartItems={cartItems}
      />
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
