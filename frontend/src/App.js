import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Register from './components/Register';  // Asegúrate de importar Register
import Login from './components/Login';  // Asegúrate de importar Login
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import OrderHistory from './components/OrderHistory';
import './App.css'; // Asegúrate de que esta línea esté presente


const App = () => {
  return (
    <Router>
      <Header />
      <div className="main-content">
        <Routes>
          {/* Página de inicio */}
          <Route exact path="/" element={<Home />} />

          {/* Página de detalle de producto */}
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* Página del carrito */}
          <Route path="/cart" element={<Cart />} />

          {/* Página de registro */}
          <Route path="/register" element={<Register />} />

          {/* Página de login */}
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={<Checkout />} /> 
          <Route path="/confirmation" element={<Confirmation />} /> 
          <Route path="/order-history" element={<OrderHistory />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
