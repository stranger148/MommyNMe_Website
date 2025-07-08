// cart.js

// Helper to get full image URL from backend
function getImageUrl(path) {
  if (!path) return 'assets/images/hero1.jpg';
  if (path.startsWith('/static/')) {
    return 'http://localhost:5000' + path;
  }
  return path;
}

function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}
function setCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCartItem(item, idx) {
  const div = document.createElement('div');
  div.className = 'cart-item';
  div.innerHTML = `
    <img src="${getImageUrl(item.image1)}" alt="${item.product_name}" class="cart-item__img">
    <div class="cart-item__info">
      <div class="cart-item__name">${item.product_name}</div>
      <div class="cart-item__desc">${item.description || ''}</div>
      <div class="cart-item__price">₹${item.price || ''}</div>
      <div class="cart-item__qty">
        <button class="cart-item__qty-btn" data-action="decrease" data-idx="${idx}">−</button>
        <span class="cart-item__qty-value">${item.quantity}</span>
        <button class="cart-item__qty-btn" data-action="increase" data-idx="${idx}">+</button>
        <button class="cart-item__remove-btn" data-action="remove" data-idx="${idx}" title="Remove">&times;</button>
      </div>
    </div>
  `;
  return div;
}

function loadCart() {
  const container = document.getElementById('cartItems');
  container.innerHTML = '';
  const items = getCart();
  if (!items.length) {
    container.innerHTML = '<div class="cart-empty">Your cart is empty.</div>';
    return;
  }
  let total = 0;
  items.forEach((item, idx) => {
    container.appendChild(renderCartItem(item, idx));
    total += (parseFloat(item.price) || 0) * (item.quantity || 1);
  });
  // Add event listeners for quantity and remove buttons
  container.querySelectorAll('.cart-item__qty-btn').forEach(btn => {
    btn.onclick = function() {
      const idx = parseInt(btn.getAttribute('data-idx'));
      const action = btn.getAttribute('data-action');
      let cart = getCart();
      if (action === 'increase') {
        cart[idx].quantity += 1;
      } else if (action === 'decrease') {
        cart[idx].quantity -= 1;
        if (cart[idx].quantity <= 0) cart.splice(idx, 1);
      }
      setCart(cart);
      loadCart();
    };
  });
  container.querySelectorAll('.cart-item__remove-btn').forEach(btn => {
    btn.onclick = function() {
      const idx = parseInt(btn.getAttribute('data-idx'));
      let cart = getCart();
      cart.splice(idx, 1);
      setCart(cart);
      loadCart();
    };
  });
  // Show total
  const totalDiv = document.createElement('div');
  totalDiv.className = 'cart-total';
  totalDiv.innerHTML = `<strong>Total: </strong>₹${total.toFixed(2)}`;
  container.appendChild(totalDiv);
}

function cleanCart() {
  let cart = getCart();
  let changed = false;
  cart = cart.filter(item => item.product_name && item.price);
  if (cart.length !== getCart().length) changed = true;
  if (changed) setCart(cart);
}

document.addEventListener('DOMContentLoaded', () => {
  cleanCart();
  loadCart();
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.onclick = function() {
      window.location.href = 'checkout.html';
    };
  }
}); 