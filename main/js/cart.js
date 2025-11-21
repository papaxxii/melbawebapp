// public/js/cart.js
export function initCart(cartContainerId = 'cart-container') {
  const cart = JSON.parse(localStorage.getItem('emz_cart') || '[]');
  // render minimal cart UI or expose helper functions
  return cart;
}
