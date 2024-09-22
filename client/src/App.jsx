import React, { useState } from "react";
import Navbar from "./components/Navbar";
import CarouselSection from "./components/CarouselSection";
import SideMenu from "./components/SideMenu";
import CardsSection from "./components/CardsSection";
import Cart from "./components/Cart";
import Footer from "./components/Footer";
import "./App.css";

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  return (
    <div className="app">
      <Navbar setMenuOpen={setMenuOpen} setCartOpen={setCartOpen} />
      <CarouselSection />
      <SideMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <CardsSection />
      <Cart cartOpen={cartOpen} setCartOpen={setCartOpen} cartItems={cartItems} />
      <Footer />
    </div>
  );
};

export default App;
