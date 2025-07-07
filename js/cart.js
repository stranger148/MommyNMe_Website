// MommynMe - cart.js

// Load products from products.js if available
let PRODUCTS = window._MommynMe ? window._MommynMe.PRODUCTS : [];
if (!PRODUCTS.length) {
  // Fallback: minimal product info for cart rendering
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

function renderCart() {
  const cart = getCart();
  const table = document.querySelector('.cart__list');
  const totalDiv = document.querySelector('.cart__total');
  if (!cart.length) {
    table.innerHTML = '';
    totalDiv.textContent = '';
    document.querySelector('.cart__empty').style.display = 'block';
    document.querySelector('.cart__actions').style.display = 'none';
    return;
  }
  document.querySelector('.cart__empty').style.display = 'none';
  document.querySelector('.cart__actions').style.display = 'flex';
  let total = 0;
  table.innerHTML = `
    <tr>
      <th>Image</th>
      <th>Name</th>
      <th>Quantity</th>
      <th>Price</th>
      <th>Remove</th>
    </tr>
  `;
  cart.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return;
    total += product.price * item.qty;
    table.innerHTML += `
      <tr>
        <td><img src="${product.img}" alt="${product.name}" class="cart__img"></td>
        <td class="cart__name">${product.name}</td>
        <td>
          <div class="cart__qty-controls">
            <button class="cart__qty-btn" data-id="${item.id}" data-action="dec">-</button>
            <span>${item.qty}</span>
            <button class="cart__qty-btn" data-id="${item.id}" data-action="inc">+</button>
          </div>
        </td>
        <td>₹${product.price * item.qty}</td>
        <td><button class="cart__remove-btn" data-id="${item.id}" title="Remove">&times;</button></td>
      </tr>
    `;
  });
  totalDiv.textContent = `Total: ₹${total}`;
}

function setupCartActions() {
  document.querySelector('.cart__list').addEventListener('click', e => {
    if (e.target.classList.contains('cart__qty-btn')) {
      const id = e.target.getAttribute('data-id');
      const action = e.target.getAttribute('data-action');
      let cart = getCart();
      const idx = cart.findIndex(item => item.id === id);
      if (idx > -1) {
        if (action === 'inc') cart[idx].qty += 1;
        if (action === 'dec' && cart[idx].qty > 1) cart[idx].qty -= 1;
        setCart(cart);
        renderCart();
      }
    } else if (e.target.classList.contains('cart__remove-btn')) {
      const id = e.target.getAttribute('data-id');
      let cart = getCart().filter(item => item.id !== id);
      setCart(cart);
      renderCart();
    }
  });
}

function setupCartNav() {
  document.querySelector('.cart__checkout-btn').onclick = () => {
    window.location.href = 'checkout.html';
  };
  document.querySelector('.cart__browse-btn').onclick = () => {
    window.location.href = 'products.html';
  };
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

// Show loading spinner while cart loads
function showCartLoading(show) {
  const spinner = document.querySelector('.cart-loading');
  if (spinner) spinner.style.display = show ? 'flex' : 'none';
}

// Wrap renderCart to show spinner
const _renderCart = renderCart;
renderCart = function() {
  showCartLoading(true);
  setTimeout(() => {
    _renderCart();
    showCartLoading(false);
  }, 300); // Simulate loading
};

// Add icons to action buttons
function setupCartActionButtons() {
  const checkoutBtn = document.querySelector('.cart__checkout-btn');
  const browseBtn = document.querySelector('.cart__browse-btn');
  
  if (checkoutBtn) {
    checkoutBtn.innerHTML = '<img src="assets/icons/checkout.svg" alt="Checkout" style="width:20px;height:20px;vertical-align:middle;"> Proceed to Checkout';
  }
  
  if (browseBtn) {
    browseBtn.innerHTML = '<img src="assets/icons/shop.svg" alt="Shop" style="width:20px;height:20px;vertical-align:middle;"> Browse More Products';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  renderCart();
  setupCartActions();
  setupCartNav();
  setupCartActionButtons();
}); 