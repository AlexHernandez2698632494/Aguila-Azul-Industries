import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CarouselSection from "./components/CarouselSection";
import SideMenu from "./components/SideMenu";
import CardsSection from "./components/CardsSection";
import ProductsByCategory from "./components/ProductsByCategory";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";
import Footer from "./components/Footer";
import "./App.css";

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Función para agregar productos al carrito
  const handleAddToCart = (product, quantity) => {
    const newItem = {
      name: product.Nombre,
      price: product.Precio,
      quantity
    };
  
    setCartItems((prevItems) => [...prevItems, newItem]);
  };
  

  return (
    <Router>
      <div className="app">
        <Navbar setMenuOpen={setMenuOpen} setCartOpen={setCartOpen} cartItems={cartItems} />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <CarouselSection />
                <SideMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
                <CardsSection />
              </>
            }
          />
          <Route
            path="/category/:id"
            element={
              <>
                <SideMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
                <ProductsByCategory />
              </>
            }
          />
          <Route
            path="/product/:id"
            element={
              <>
                <SideMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
                <ProductDetail handleAddToCart={handleAddToCart} />
              </>
            }
          />
        </Routes>
        <Cart cartOpen={cartOpen} setCartOpen={setCartOpen} cartItems={cartItems} />
        <Footer />
      </div>
    </Router>
  );
};

export default App;
