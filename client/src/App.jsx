import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
// Components
import Navbar from "./components/Navbar";
import CarouselSection from "./components/CarouselSection";
import SideMenu from "./components/SideMenu";
import CardsSection from "./components/CardsSection";
import Cart from "./components/Cart";
import Footer from "./components/Footer";
//componentes de gerentes
import ManagerLayout from "./components/Manager/ManagerLayout";

// componentes de empleados
import EmployeeIndex from "./components/Employees/App";
// componentes de clientes
import ClientIndex from "./components/Client/App";
// vistas
import ProductsByCategory from "./views/ProductsByCategory";
import ProductDetail from "./views/ProductDetail";
import Login from "./views/Login";
import Register from "./views/Register";
import ManagerIndex from "./views/manager/App";
import ManagerProductDetail from "./views/manager/ProductDetailManager";
import RegisterProduct from "./views/manager/registerProduct";
import DeleteProductManager from "./views/manager/DeleteProductManager";
import CategoryDetail from "./views/manager/CategoryDetails";
import RegisterCategory from "./views/manager/registerCategory";
import DeleteCategoryManager from "./views/manager/DeleteCategoryManager";

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

  // Verifica si la ruta actual es para ocultar el navbar y footer
  const hideNavbarRoutes = [
    "/manager/product/:id",
    "/manager",
    "/employee",
    "/client",
    "/productos/registro",
    "/productos/eliminados",
    "/categorias/control",
    "/categorias/registro",
    "/categorias/eliminados"
  ];
  const shouldHideNavbar = hideNavbarRoutes.some((route) =>
    location.pathname.startsWith(route)
  );
  const shouldHideFooter = hideNavbarRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/manager"
          element={
            <ManagerLayout>
              <ManagerIndex />
            </ManagerLayout>
          }
        />
        <Route
          path="/manager/product/:id"
          element={
            <ManagerLayout>
              <ManagerProductDetail />
            </ManagerLayout>
          }
        />
        <Route
          path="/productos/registro"
          element={
            <ManagerLayout>
              <RegisterProduct />
            </ManagerLayout>
          }
        />
        <Route
          path="/productos/eliminados"
          element={
            <ManagerLayout>
              <DeleteProductManager />
            </ManagerLayout>
          }
        />
        <Route
          path="/categorias/control"
          element={
            <ManagerLayout>
              <CategoryDetail />
            </ManagerLayout>
          }
        />
        <Route
          path="/categorias/registro"
          element={
            <ManagerLayout>
              <RegisterCategory />
            </ManagerLayout>
          }
        />
        <Route
          path="/categorias/eliminados"
          element={
            <ManagerLayout>
              <DeleteCategoryManager />
            </ManagerLayout>
          }
        />
        <Route path="/employee" element={<EmployeeIndex />} />
        <Route path="/client" element={<ClientIndex />} />
        <Route path="/category/:id" element={<ProductsByCategory />} />
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
      {!shouldHideFooter && <Footer />}
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
