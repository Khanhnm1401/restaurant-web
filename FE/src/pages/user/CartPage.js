import React from 'react';
import Cart from '../../components/Cart';

function CartPage({ cart, removeFromCart, onClearCart, decreaseQuantity, increaseQuantity }) {
  return <Cart cart={cart} removeFromCart={removeFromCart} onClearCart={onClearCart} decreaseQuantity={decreaseQuantity} increaseQuantity={increaseQuantity} />;
}

export default CartPage;