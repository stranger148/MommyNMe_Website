// checkout.js

function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}
function setCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}
function renderCheckoutCart() {
  const container = document.getElementById('checkoutCartItems');
  container.innerHTML = '';
  const items = getCart();
  if (!items.length) {
    container.innerHTML = '<div class="cart-empty">Your cart is empty.</div>';
    return;
  }
  let total = 0;
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${getImageUrl(item.image1)}" alt="${item.product_name}" class="cart-item__img">
      <div class="cart-item__info">
        <div class="cart-item__name">${item.product_name}</div>
        <div class="cart-item__desc">${item.description || ''}</div>
        <div class="cart-item__price">₹${item.price || ''}</div>
        <div class="cart-item__qty"><span class="cart-item__qty-value">Qty: ${item.quantity}</span></div>
      </div>
    `;
    container.appendChild(div);
    total += (parseFloat(item.price) || 0) * (item.quantity || 1);
  });
  const totalDiv = document.createElement('div');
  totalDiv.className = 'cart-total';
  totalDiv.innerHTML = `<strong>Total: </strong>₹${total.toFixed(2)}`;
  container.appendChild(totalDiv);
}
function getImageUrl(path) {
  if (!path) return 'assets/images/hero1.jpg';
  if (path.startsWith('/static/')) {
    return 'http://localhost:5000' + path;
  }
  return path;
}
document.addEventListener('DOMContentLoaded', () => {
  renderCheckoutCart();
  const form = document.getElementById('checkoutForm');
  form.onsubmit = async function(e) {
    e.preventDefault();
    const customer_name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const address = document.getElementById('customerAddress').value.trim();
    const payment_mode = document.getElementById('paymentMode').value;
    const products = getCart();
    if (!products.length) {
      alert('Your cart is empty.');
      return;
    }
    const res = await fetch('http://localhost:5000/orders/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name,
        phone,
        email,
        address,
        payment_mode,
        products
      })
    });
    if (res.ok) {
      setCart([]);
      document.getElementById('checkoutForm').style.display = 'none';
      document.getElementById('checkoutCartItems').style.display = 'none';
      document.getElementById('checkoutSuccess').style.display = 'block';
    } else {
      alert('Failed to place order. Please try again.');
    }
  };
}); 