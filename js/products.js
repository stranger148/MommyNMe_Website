// MommynMe - products.js

let CATEGORIES = [];
let PRODUCTS = [];

// Fetch categories from backend
async function fetchCategories() {
  const res = await fetch('http://localhost:5000/category/categories');
  if (!res.ok) return [];
  return await res.json();
}

// Fetch products by category from backend
async function fetchProducts(categoryId = null) {
  let url = 'http://localhost:5000/product/products';
  if (categoryId) url += `?category_id=${categoryId}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  return await res.json();
}

// Render filter categories
async function renderCategories() {
  const container = document.querySelector('.filter__categories');
  container.innerHTML = '';
  CATEGORIES = await fetchCategories();
  // Add 'All' button
  const allBtn = document.createElement('button');
  allBtn.className = 'filter__category filter__category--active';
  allBtn.textContent = 'All';
  allBtn.setAttribute('data-category', 'all');
  allBtn.addEventListener('click', async () => {
    document.querySelectorAll('.filter__category').forEach(b => b.classList.remove('filter__category--active'));
    allBtn.classList.add('filter__category--active');
    await renderProducts();
  });
  container.appendChild(allBtn);
  // Add category buttons
  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter__category';
    btn.textContent = cat.name;
    btn.setAttribute('data-category', cat.id);
    btn.addEventListener('click', async () => {
      document.querySelectorAll('.filter__category').forEach(b => b.classList.remove('filter__category--active'));
      btn.classList.add('filter__category--active');
      await renderProducts(cat.id);
    });
    container.appendChild(btn);
  });
}

// Show loading spinner while products load
function showProductsLoading(show) {
  const spinner = document.querySelector('.products-loading');
  if (spinner) spinner.style.display = show ? 'flex' : 'none';
}

// Helper to get full image URL from backend
function getImageUrl(path) {
  if (!path) return 'assets/images/hero1.jpg'; // fallback
  if (path.startsWith('/static/')) {
    return 'http://localhost:5000' + path;
  }
  return path;
}

// Render products by category
async function renderProducts(categoryId = null) {
  showProductsLoading(true);
  PRODUCTS = await fetchProducts(categoryId && categoryId !== 'all' ? categoryId : null);
  const grid = document.querySelector('.products');
  grid.innerHTML = '';
  if (!PRODUCTS.length) {
    grid.innerHTML = '<div style="padding:2rem;">No products found in this category.</div>';
    showProductsLoading(false);
    return;
  }
  PRODUCTS.forEach(product => {
    // Use the first available image
    let img = getImageUrl(product.image1) || getImageUrl(product.image2) || getImageUrl(product.image3) || getImageUrl(product.image4) || 'assets/images/hero1.jpg';
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${img}" alt="${product.name}" class="product-card__img">
      <div class="product-card__name">${product.name}</div>
      <div class="product-card__price">₹${product.price}</div>
      <div class="product-card__desc">${product.description || ''}</div>
      <button class="product-card__button" data-id="${product.id}" data-action="details">
        <img src="assets/icons/view.svg" alt="View" style="width:20px;height:20px;vertical-align:middle;"> View Details
      </button>
      <button class="product-card__button" data-id="${product.id}" data-action="add">
        <img src="assets/icons/cart.svg" alt="Add to Cart" style="width:20px;height:20px;vertical-align:middle;"> Add to Cart
      </button>
    `;
    grid.appendChild(card);
  });
  showProductsLoading(false);
}

// Modal logic with image carousel
function showProductModal(product) {
  const modal = document.querySelector('.product-modal');
  const content = modal.querySelector('.product-modal__content');
  // Collect all available images
  const images = [product.image1, product.image2, product.image3, product.image4].filter(Boolean).map(getImageUrl);
  let currentIndex = 0;

  function renderCarousel() {
    content.innerHTML = `
      <div class="product-modal__carousel">
        <button class="carousel__arrow carousel__arrow--left" ${currentIndex === 0 ? 'disabled' : ''}>&lt;</button>
        <img src="${images[currentIndex]}" alt="${product.name}" class="product-modal__img">
        <button class="carousel__arrow carousel__arrow--right" ${currentIndex === images.length - 1 ? 'disabled' : ''}>&gt;</button>
      </div>
      <div class="product-modal__name">${product.name}</div>
      <div class="product-modal__desc">${product.description || ''}</div>
      <div class="product-modal__price">₹${product.price}</div>
      <div class="product-modal__actions">
        <button class="product-modal__button" data-id="${product.id}" data-action="add">
          <img src="assets/icons/cart.svg" alt="Add to Cart" style="width:20px;height:20px;vertical-align:middle;"> Add to Cart
        </button>
        <button class="product-modal__button" data-action="close">
          <img src="assets/icons/view.svg" alt="Close" style="width:20px;height:20px;vertical-align:middle;"> Close
        </button>
      </div>
    `;
    // Arrow event listeners
    const left = content.querySelector('.carousel__arrow--left');
    const right = content.querySelector('.carousel__arrow--right');
    if (left) left.onclick = () => { if (currentIndex > 0) { currentIndex--; renderCarousel(); } };
    if (right) right.onclick = () => { if (currentIndex < images.length - 1) { currentIndex++; renderCarousel(); } };
    // Close logic
    const closeBtn = content.querySelector('[data-action="close"]');
    if (closeBtn) closeBtn.onclick = () => modal.classList.remove('product-modal--active');
    // Add to cart logic
    const addBtn = content.querySelector('[data-action="add"]');
    if (addBtn) addBtn.onclick = () => { addToCart(product.id); };
  }

  renderCarousel();
  modal.classList.add('product-modal--active');
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
    const btn = e.target.closest('.product-card__button');
    if (btn) {
      const id = btn.getAttribute('data-id');
      const action = btn.getAttribute('data-action');
      const product = PRODUCTS.find(p => p.id == id);
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
window.addEventListener('DOMContentLoaded', async () => {
  setActiveNav();
  await renderCategories();
  await renderProducts();
  setupProductActions();
  setupModalBackground();
  setupProductModalClose();
});

// Expose for debugging
window._MommynMe = { PRODUCTS, CATEGORIES, addToCart }; 