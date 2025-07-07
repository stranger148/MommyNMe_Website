// MommynMe - products.js

// Product data (sample, can be extended)
const PRODUCTS = [
  {
    id: 'hero-doll',
    name: 'Super Hero Doll',
    category: 'Super Heroes',
    price: 499,
    shortDesc: 'Handcrafted superhero crochet doll.',
    fullDesc: 'A unique, soft, and safe superhero doll, perfect for kids and collectors. Made with premium yarn.',
    delivery: '3-5 days',
    img: 'assets/images/hero1.jpg',
  },
  {
    id: 'flower-bouquet',
    name: 'Flower Bouquet',
    category: 'Flower Bouquets',
    price: 699,
    shortDesc: 'Elegant crochet flower bouquet.',
    fullDesc: 'A beautiful bouquet of crochet flowers, everlasting and perfect for gifting or decor.',
    delivery: '4-6 days',
    img: 'assets/products/flower-bouquet.jpg',
  },
  {
    id: 'mini-claw',
    name: 'Mini Claw',
    category: 'Mini Claw',
    price: 199,
    shortDesc: 'Cute mini crochet claw.',
    fullDesc: 'Adorable mini claw, perfect for hair or as a keychain. Soft, durable, and stylish.',
    delivery: '2-4 days',
    img: 'assets/products/mini-claw.jpg',
  },
  // Add more products as needed
];

const CATEGORIES = [
  'Super Heroes', 'Posters', 'Mini Claw', 'Medium Claw', 'Keychain',
  'Hair Ties', 'Flower Pots', 'Flower Bouquets', 'Crochet Bows', 'Coasters', 'Big Claws'
];

// Render filter categories
function renderCategories() {
  const container = document.querySelector('.filter__categories');
  container.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter__category';
    btn.textContent = cat;
    btn.setAttribute('data-category', cat);
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter__category').forEach(b => b.classList.remove('filter__category--active'));
      btn.classList.add('filter__category--active');
      renderProducts(cat);
    });
    container.appendChild(btn);
  });
}

// Show loading spinner while products load
function showProductsLoading(show) {
  const spinner = document.querySelector('.products-loading');
  if (spinner) spinner.style.display = show ? 'flex' : 'none';
}

// Wrap renderProducts to show spinner
const _renderProducts = renderProducts;
renderProducts = function(category) {
  showProductsLoading(true);
  setTimeout(() => {
    _renderProducts(category);
    showProductsLoading(false);
  }, 400); // Simulate loading
};

// Render products by category
function renderProducts(category) {
  const grid = document.querySelector('.products');
  grid.innerHTML = '';
  const filtered = category ? PRODUCTS.filter(p => p.category === category) : PRODUCTS;
  if (filtered.length === 0) {
    grid.innerHTML = '<div style="padding:2rem;">No products found in this category.</div>';
    return;
  }
  filtered.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.img}" alt="${product.name}" class="product-card__img">
      <div class="product-card__name">${product.name}</div>
      <div class="product-card__price">₹${product.price}</div>
      <div class="product-card__desc">${product.shortDesc}</div>
      <button class="product-card__button" data-id="${product.id}" data-action="details">
        <img src="assets/icons/view.svg" alt="View" style="width:20px;height:20px;vertical-align:middle;"> View Details
      </button>
      <button class="product-card__button" data-id="${product.id}" data-action="add">
        <img src="assets/icons/cart.svg" alt="Add to Cart" style="width:20px;height:20px;vertical-align:middle;"> Add to Cart
      </button>
    `;
    grid.appendChild(card);
  });
}

// Modal logic
function showProductModal(product) {
  const modal = document.querySelector('.product-modal');
  const content = modal.querySelector('.product-modal__content');
  content.innerHTML = `
    <img src="${product.img}" alt="${product.name}" class="product-modal__img">
    <div class="product-modal__name">${product.name}</div>
    <div class="product-modal__desc">${product.fullDesc}</div>
    <div class="product-modal__delivery">Estimated Delivery: ${product.delivery}</div>
    <div class="product-modal__actions">
      <button class="product-modal__button" data-id="${product.id}" data-action="add">
        <img src="assets/icons/cart.svg" alt="Add to Cart" style="width:20px;height:20px;vertical-align:middle;"> Add to Cart
      </button>
      <button class="product-modal__button" data-action="close">
        <img src="assets/icons/view.svg" alt="Close" style="width:20px;height:20px;vertical-align:middle;"> Close
      </button>
    </div>
  `;
  modal.classList.add('product-modal--active');
  // Close logic
  const closeBtn = modal.querySelector('[data-action="close"]');
  if (closeBtn) closeBtn.onclick = () => modal.classList.remove('product-modal--active');
}
function hideProductModal() {
  document.querySelector('.product-modal').classList.remove('product-modal--active');
}

// Cart logic
function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}
function setCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}
function addToCart(productId) {
  let cart = getCart();
  const idx = cart.findIndex(item => item.id === productId);
  if (idx > -1) {
    cart[idx].qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  setCart(cart);
  alert('Added to cart!');
}

// Event delegation for product actions
function setupProductActions() {
  document.querySelector('.products').addEventListener('click', e => {
    if (e.target.classList.contains('product-card__button')) {
      const id = e.target.getAttribute('data-id');
      const action = e.target.getAttribute('data-action');
      const product = PRODUCTS.find(p => p.id === id);
      if (action === 'details') {
        showProductModal(product);
      } else if (action === 'add') {
        addToCart(id);
      }
    }
  });
}

// Modal background click
function setupModalBackground() {
  const modal = document.querySelector('.product-modal');
  modal.addEventListener('click', e => {
    if (e.target === modal) hideProductModal();
  });
}

// Navbar active link
function setActiveNav() {
  const links = document.querySelectorAll('.navbar__link');
  const path = window.location.pathname;
  links.forEach(link => {
    if (link.getAttribute('href') === path) {
      link.classList.add('navbar__link--active');
    }
  });
}

// Modal close button logic
function setupProductModalClose() {
  const modal = document.querySelector('.product-modal');
  const closeBtn = modal.querySelector('.product-modal__close');
  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.classList.remove('product-modal--active');
    };
  }
}

// On DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  renderCategories();
  renderProducts();
  setupProductActions();
  setupModalBackground();
  setupProductModalClose();
  // Activate first category by default
  const firstCat = document.querySelector('.filter__category');
  if (firstCat) firstCat.classList.add('filter__category--active');
});

// Expose for debugging
window._MommynMe = { PRODUCTS, CATEGORIES, addToCart }; 