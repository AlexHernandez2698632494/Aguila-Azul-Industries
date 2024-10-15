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
import CheckoutCart from "./views/CheckoutCart";
import CheckoutEmail from "./views/CheckoutEmail";
import CheckoutShipping from "./views/CheckoutShipping";
import CheckoutPayment from "./views/CheckoutPayment";

//componentes de gerentes
import ManagerLayout from "./components/Manager/ManagerLayout";

// componentes de empleados
import EmployeeLayout from "./components/Employees/EmployeeLayout";

// componentes de clientes
import ClientLayout from "./components/Client/ClientLayaout";

//componentes de auth
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

// vistas
import ProductsByCategory from "./views/ProductsByCategory";
import ProductDetail from "./views/ProductDetail";
import Login from "./views/Login";
import Register from "./views/Register";

//vistas del Gerente
import ManagerIndex from "./views/manager/App";
import ManagerProductDetail from "./views/manager/ProductDetailManager";
import RegisterProduct from "./views/manager/registerProduct";
import DeleteProductManager from "./views/manager/DeleteProductManager";
import CategoryDetail from "./views/manager/CategoryDetails";
import RegisterCategory from "./views/manager/registerCategory";
import DeleteCategoryManager from "./views/manager/DeleteCategoryManager";
import Usuarios from "./views/manager/usuarios";
import RegisterUser from "./views/manager/registerUser";
import SalesReport from "./views/manager/informe";

//vistas del cliente
import PerfilClient from "./views/client/PerfilClient";
import ClientIndex from "./views/client/PurchaseHistoryClient";
import OrderDetails from "./views/client/PurchaseHistoryDetailsClient";

//vista del empleado
import EmployeeIndex from "./views/employee/App";
import ProductDetailEmployee from "./views/employee/ProductDetailEmployee";
import RegisterProductEmployee from "./views/employee/registerProduct";
import TableEmployee from "./views/employee/TablaEmpleado";
import VerInformes from "./views/employee/VerInformes";

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
    "/categorias/eliminados",
    "/usuarios/control",
    "/usuarios/registrar",
    "/checkout/cart",
    "/checkout/email",
    "/checkout/shipping",
    "/checkout/payment",
    "/profile",
    "/purchasehistory",
    "/detalles-pedido/:ventaId",
    "/informes/control"
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
            <ProtectedRoute>
              <ManagerLayout>
                <ManagerIndex />
              </ManagerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/product/:id"
          element={
            <ProtectedRoute>
              <ManagerLayout>
                <ManagerProductDetail />
              </ManagerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/productos/registro"
          element={
            <ProtectedRoute>
              <ManagerLayout>
                <RegisterProduct />
              </ManagerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/productos/eliminados"
          element={
            <ProtectedRoute>
              <ManagerLayout>
                <DeleteProductManager />
              </ManagerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categorias/control"
          element={
            <ProtectedRoute>
              <ManagerLayout>
                <CategoryDetail />
              </ManagerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categorias/registro"
          element={
            <ProtectedRoute>
              <ManagerLayout>
                <RegisterCategory />
              </ManagerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categorias/eliminados"
          element={
            <ProtectedRoute>
              <ManagerLayout>
                <DeleteCategoryManager />
              </ManagerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios/control"
          element={
            <ProtectedRoute>
              <ManagerLayout>
                <Usuarios />
              </ManagerLayout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/informes/control"
          element={
            <ProtectedRoute>
              <ManagerLayout>
                <SalesReport />
              </ManagerLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/checkout/cart" element={<CheckoutCart />} />
        <Route path="/checkout/email" element={<CheckoutEmail />} />
        <Route path="/checkout/shipping" element={<CheckoutShipping />} />
        <Route path="/checkout/payment" element={<CheckoutPayment />} />
        <Route
          path="/usuarios/registrar"
          element={<ProtectedRoute>
            <ManagerLayout>
              <RegisterUser></RegisterUser>
            </ManagerLayout></ProtectedRoute>
          }
        />
        <Route
          path="/employee"
          element={<ProtectedRoute>
            <EmployeeLayout>
              <EmployeeIndex />
            </EmployeeLayout></ProtectedRoute>
          }
        />
        <Route
          path="/employee/product/:id"
          element={<ProtectedRoute>
            <EmployeeLayout>
              <ProductDetailEmployee />
            </EmployeeLayout></ProtectedRoute>
          }
        />
        <Route
          path="/employee/registerProduct"
          element={<ProtectedRoute>
            <EmployeeLayout>
              <RegisterProductEmployee />
            </EmployeeLayout></ProtectedRoute>
          }
        />
        <Route
          path="/employee/control"
          element={<ProtectedRoute>
            <EmployeeLayout>
              <TableEmployee />
            </EmployeeLayout></ProtectedRoute>
          }
        />
        <Route
          path="/employee/informes"
          element={<ProtectedRoute>
            <EmployeeLayout>
              <VerInformes /> {/* Nueva ruta para VerInformes */}
            </EmployeeLayout></ProtectedRoute>
          }
        />
        <Route
          path="/client"
          element={<ProtectedRoute>
            <ClientLayout>
              <ClientIndex />
            </ClientLayout></ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={<ProtectedRoute>
            <ClientLayout>
              <PerfilClient />
            </ClientLayout></ProtectedRoute>
          }
        />
        <Route
          path="/purchasehistory"
          element={<ProtectedRoute>
            <ClientLayout>
              <ClientIndex />
            </ClientLayout></ProtectedRoute>
          }
        />
        <Route
          path="/detalles-pedido/:ventaId"
          element={<ProtectedRoute>
            <ClientLayout>
              <OrderDetails />
            </ClientLayout></ProtectedRoute>
          }
        />
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
    <AuthProvider>
      {" "}
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
