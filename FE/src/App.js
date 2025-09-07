import React, { useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/user/Home';
import Menu from './pages/user/Menu';
import CartPage from './pages/user/CartPage';
import Login from './pages/user/Login';
import Signup from './pages/user/Signup';
import Logout from './pages/user/Logout';
import About from './pages/user/About';
import Booking from './pages/user/Booking';
import Delivery from './pages/user/Delivery';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import MenuManager from './pages/admin/MenuManager';
import Customers from './pages/admin/Customers';
import Statistics from './pages/admin/Statistics';
import Bills from './pages/admin/Bills';
import Bookings from './pages/admin/Bookings';
import Reviews from './pages/admin/Reviews';
import OrderHistory from './pages/user/OrderHistory';
import './App.css';
import { UserProvider } from './context/UserContext';

function App() {
  const [cart, setCart] = useState([]);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const decreaseQuantity = (id) => {
    setCart(cart => cart.map(item =>
      item.id === id ? { ...item, quantity: item.quantity - 1 } : item
    ).filter(item => item.quantity > 0));
  };

  const increaseQuantity = (id) => {
    setCart(cart => cart.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  return (
    <UserProvider>
      <div className="App">
        <Navbar cartCount={cart.length} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu addToCart={addToCart} />} />
          <Route
            path="/cart"
            element={
              <CartPage 
                cart={cart} 
                removeFromCart={removeFromCart} 
                onClearCart={() => setCart([])} 
                decreaseQuantity={decreaseQuantity} 
                increaseQuantity={increaseQuantity} 
              />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/about" element={<About />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/order-history" element={<OrderHistory />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route
            path="/admin/*"
            element={
              <AdminLayout />
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="menu" element={<MenuManager />} />
            <Route path="customers" element={<Customers />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="bills" element={<Bills />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="reviews" element={<Reviews />} />
          </Route>
        </Routes>
        {!isAdminPage && <Footer />}
      </div>
    </UserProvider>
  );
}

export default App;