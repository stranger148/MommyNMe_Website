// MommynMe - index.js

// Navbar: Highlight active link
function setActiveNav() {
  const links = document.querySelectorAll('.navbar__link');
  const path = window.location.pathname;
  links.forEach(link => {
    if (link.getAttribute('href') === path) {
      link.classList.add('navbar__link--active');
    }
  });
}

// Hero Buttons: Scroll to sections
function setupHeroButtons() {
  document.querySelectorAll('.hero__button').forEach(btn => {
    btn.addEventListener('click', e => {
      const target = btn.getAttribute('data-target');
      if (target && document.getElementById(target)) {
        document.getElementById(target).scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// Contact Form Validation
function setupContactForm() {
  const form = document.querySelector('.contact__form');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]');
    const message = form.querySelector('[name="message"]');
    let valid = true;
    [name, email, message].forEach(input => {
      input.classList.remove('input--error');
      if (!input.value.trim()) {
        input.classList.add('input--error');
        valid = false;
      }
    });
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
      email.classList.add('input--error');
      valid = false;
    }
    if (!valid) return;
    // Simulate form submission
    form.reset();
    alert('Thank you for contacting us! We will get back to you soon.');
  });
}

// Google Map Embed (static iframe, no JS needed)

// Hero background image slider
const heroImages = [
  'assets/images/hero1.jpg',
  'assets/images/hero2.jpg',
  'assets/images/hero3.jpg',
  'assets/images/hero4.jpg',
];
let heroIndex = 0;
function setHeroBg(idx) {
  const bg = document.querySelector('.hero__bg');
  if (bg) {
    bg.style.backgroundImage = `url('${heroImages[idx]}')`;
  }
}
function startHeroSlider() {
  setHeroBg(heroIndex);
  setInterval(() => {
    heroIndex = (heroIndex + 1) % heroImages.length;
    setHeroBg(heroIndex);
  }, 3000);
}

// About Us image slider
function startAboutSlider() {
  const imgs = document.querySelectorAll('.about__slider .about__img');
  let idx = 0;
  if (imgs.length < 2) return;
  imgs.forEach((img, i) => {
    img.style.opacity = i === 0 ? '1' : '0';
    img.style.zIndex = i === 0 ? '2' : '1';
  });
  setInterval(() => {
    imgs[idx].style.opacity = '0';
    imgs[idx].style.zIndex = '1';
    idx = (idx + 1) % imgs.length;
    imgs[idx].style.opacity = '1';
    imgs[idx].style.zIndex = '2';
  }, 3000);
}

// Optional: Show swipe hint for featured cards
function showFeaturedSwipeHint() {
  const container = document.querySelector('.featured-cards');
  if (!container) return;
  if (window.innerWidth < 900) {
    if (!document.querySelector('.featured-swipe-hint')) {
      const hint = document.createElement('div');
      hint.className = 'featured-swipe-hint';
      hint.textContent = 'Swipe to see more →';
      hint.style.position = 'absolute';
      hint.style.right = '2rem';
      hint.style.bottom = '1.2rem';
      hint.style.background = 'rgba(30,41,59,0.7)';
      hint.style.color = '#fff';
      hint.style.padding = '0.4rem 1rem';
      hint.style.borderRadius = '1rem';
      hint.style.fontSize = '1rem';
      hint.style.zIndex = '10';
      container.parentElement.style.position = 'relative';
      container.parentElement.appendChild(hint);
      setTimeout(() => hint.remove(), 3500);
    }
  }
}

// Featured cards data
const FEATURED_CARDS = [
  {
    title: 'Local Newspaper',
    desc: "Spotlighted for our unique handmade creations in the city\'s leading daily.",
    bg: "url('assets/images/cart.png')",
    link: 'https://www.localnewspaper.com',
  },
  {
    title: 'Instagram Collab',
    desc: 'Partnered with top creators to showcase our crochet art to thousands.',
    bg: "url('assets/images/about1.jpeg')",
    link: 'https://www.instagram.com',
  },
  {
    title: 'Influencer Collab',
    desc: 'Loved and shared by lifestyle and craft influencers across India.',
    bg: "url('assets/images/about1.jpeg')",
    link: 'https://www.influencer.com',
  },
  {
    title: 'Local Event',
    desc: 'Showcased at popular community fairs and art markets.',
    bg: "url('assets/images/event.jpeg')",
    link: 'https://www.event.com',
  },
  {
    title: 'Online Magazine',
    desc: 'Featured in leading online craft and lifestyle magazines.',
    bg: "url('assets/images/magazine.jpeg')",
    link: 'https://www.magazine.com',
  },
];

function renderFeaturedCards() {
  const cardsContainer = document.querySelector('.featured-cards');
  const dotsContainer = document.querySelector('.featured-pagination');
  if (!cardsContainer || !dotsContainer) return;
  cardsContainer.innerHTML = '';
  dotsContainer.innerHTML = '';
  FEATURED_CARDS.forEach((card, i) => {
    const a = document.createElement('a');
    a.className = 'featured-card';
    a.href = card.link;
    a.target = '_blank';
    a.style.backgroundImage = card.bg;
    a.innerHTML = `
      <div class="featured-card__overlay">
        <div class="featured-card__title">${card.title}</div>
        <div class="featured-card__desc">${card.desc}</div>
      </div>
    `;
    cardsContainer.appendChild(a);
    const dot = document.createElement('span');
    dot.className = 'featured-dot';
    dotsContainer.appendChild(dot);
  });
}

// Featured cards navigation with pagination dots and animation
function setupFeaturedCardsNav() {
  renderFeaturedCards();
  const cards = document.querySelectorAll('.featured-card');
  const left = document.querySelector('.featured-arrow--left');
  const right = document.querySelector('.featured-arrow--right');
  const dots = document.querySelectorAll('.featured-dot');
  let idx = 0;
  function showCard(i) {
    cards.forEach((card, j) => {
      card.classList.toggle('active', j === i);
    });
    dots.forEach((dot, j) => {
      dot.classList.toggle('active', j === i);
    });
  }
  showCard(idx);
  left.addEventListener('click', () => {
    idx = (idx - 1 + cards.length) % cards.length;
    showCard(idx);
  });
  right.addEventListener('click', () => {
    idx = (idx + 1) % cards.length;
    showCard(idx);
  });
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      idx = i;
      showCard(idx);
    });
  });
}

// On DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  setupHeroButtons();
  setupContactForm();
  startHeroSlider();
  startAboutSlider();
  setupFeaturedCardsNav();
  showFeaturedSwipeHint();
}); 