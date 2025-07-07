// MommynMe - checkout.js

// Load products from products.js if available
let PRODUCTS = window._MommynMe ? window._MommynMe.PRODUCTS : [];
if (!PRODUCTS.length) {
  PRODUCTS = [
    { id: 'hero-doll', name: 'Super Hero Doll', price: 499, img: 'assets/products/hero-doll.jpg' },
    { id: 'flower-bouquet', name: 'Flower Bouquet', price: 699, img: 'assets/products/flower-bouquet.jpg' },
    { id: 'mini-claw', name: 'Mini Claw', price: 199, img: 'assets/products/mini-claw.jpg' },
  ];
}

function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}
function setCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function renderSummary() {
  const cart = getCart();
  const table = document.querySelector('.checkout__list');
  const totalDiv = document.querySelector('.checkout__total');
  if (!cart.length) {
    table.innerHTML = '';
    totalDiv.textContent = '';
    document.querySelector('.checkout__empty').style.display = 'block';
    document.querySelector('.checkout__form').style.display = 'none';
    return;
  }
  document.querySelector('.checkout__empty').style.display = 'none';
  document.querySelector('.checkout__form').style.display = 'block';
  let total = 0;
  table.innerHTML = `
    <tr>
      <th>Image</th>
      <th>Name</th>
      <th>Quantity</th>
      <th>Price</th>
    </tr>
  `;
  cart.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return;
    total += product.price * item.qty;
    table.innerHTML += `
      <tr>
        <td><img src="${product.img}" alt="${product.name}" class="checkout__img"></td>
        <td>${product.name}</td>
        <td>${item.qty}</td>
        <td>₹${product.price * item.qty}</td>
      </tr>
    `;
  });
  totalDiv.textContent = `Total: ₹${total}`;
}

function validateForm(form) {
  let valid = true;
  ['name','address','phone','email'].forEach(field => {
    const input = form.querySelector(`[name="${field}"]`);
    input.classList.remove('input--error');
    if (!input.value.trim()) {
      input.classList.add('input--error');
      valid = false;
    }
  });
  const email = form.querySelector('[name="email"]');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
    email.classList.add('input--error');
    valid = false;
  }
  const phone = form.querySelector('[name="phone"]');
  if (!/^\d{10}$/.test(phone.value)) {
    phone.classList.add('input--error');
    valid = false;
  }
  return valid;
}

function setupCheckoutForm() {
  const form = document.querySelector('.checkout__form');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!validateForm(form)) return;
    // Payment method
    const payment = form.querySelector('[name="payment"]:checked');
    if (!payment) {
      alert('Please select a payment method.');
      return;
    }
    // Generate order ID
    const orderId = 'MM' + Math.floor(100000 + Math.random() * 900000);
    showOrderModal(orderId);
    setCart([]);
    renderSummary();
    form.reset();
  });
}

// Show loading spinner while checkout loads
function showCheckoutLoading(show) {
  const spinner = document.querySelector('.checkout-loading');
  if (spinner) spinner.style.display = show ? 'flex' : 'none';
}

// Wrap renderCheckout to show spinner
if (typeof renderCheckout === 'function') {
  const _renderCheckout = renderCheckout;
  renderCheckout = function() {
    showCheckoutLoading(true);
    setTimeout(() => {
      _renderCheckout();
      showCheckoutLoading(false);
    }, 400); // Simulate loading
  };
}

// Modernize order modal content
function showOrderModal(successMsg) {
  const modal = document.querySelector('.order-modal');
  const content = modal.querySelector('.order-modal__content');
  content.innerHTML = `
    <div style="margin-bottom:1.2rem;">
      <img src="assets/icons/check.svg" alt="Success" style="width:48px;height:48px;">
    </div>
    <div style="font-size:1.3rem;font-weight:700;color:var(--accent);margin-bottom:0.7rem;">Order Placed!</div>
    <div style="font-size:1.05rem;color:#64748b;margin-bottom:1.2rem;">${successMsg || 'Thank you for your purchase! We will contact you soon.'}</div>
    <button class="checkout__order-btn" onclick="document.querySelector('.order-modal').classList.remove('order-modal--active')">
      <img src="assets/icons/shop.svg" alt="Shop" style="width:20px;height:20px;vertical-align:middle;"> Continue Shopping
    </button>
  `;
  modal.classList.add('order-modal--active');
}

function hideOrderModal() {
  document.querySelector('.order-modal').classList.remove('order-modal--active');
}

function setActiveNav() {
  const links = document.querySelectorAll('.navbar__link');
  const path = window.location.pathname;
  links.forEach(link => {
    if (link.getAttribute('href') === path) {
      link.classList.add('navbar__link--active');
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  renderSummary();
  setupCheckoutForm();
  // Add icons to order button if not already present
  const orderBtn = document.querySelector('.checkout__order-btn');
  if (orderBtn && !orderBtn.innerHTML.includes('img')) {
    orderBtn.innerHTML = '<img src="assets/icons/checkout.svg" alt="Order" style="width:20px;height:20px;vertical-align:middle;"> Order Now';
  }
}); 