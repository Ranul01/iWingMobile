import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContex";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Phones from "./pages/Phones";
import Accessories from "./pages/Accessories";
import Admin from "./pages/Admin";
import PhoneDetails from "./pages/PhoneDetails";
import "./index.css";

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/phones" element={<Phones />} />
              <Route path="/phones/:id" element={<PhoneDetails />} />
              <Route path="/accessories" element={<Accessories />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
