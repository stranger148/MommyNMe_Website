# MommynMe Website

## File Structure
```
Website/MommyNMe_Website/
├── assets/
│   ├── icons/                # All SVG/PNG icons (logo, cart, etc.)
│   └── images/               # Product, hero, and about images
├── css/
│   ├── index.css             # Main styles for homepage
│   ├── products.css          # Product page styles
│   ├── cart.css              # Cart page styles
│   ├── checkout.css          # Checkout page styles
│   └── responsive.css        # Responsive breakpoints
├── js/
│   ├── index.js              # Homepage JS (categories, reviews, featured updates)
│   ├── products.js           # Product page JS
│   ├── cart.js               # Cart page JS
│   └── checkout.js           # Checkout page JS
├── index.html                # Homepage (dynamic, fetches categories, reviews, featured updates)
├── products.html             # Product catalog page
├── cart.html                 # Cart page
├── checkout.html             # Checkout page
├── README.md                 # This file
```

## How to Run the Website
1. **Start the backend server:**
   - See the backend README for setup and running instructions.
   - The backend must be running at `http://localhost:5000` for all dynamic features.
2. **Open the website:**
   - Open `index.html` in your browser (double-click or use `Open With` > browser).
   - All dynamic features (categories, featured updates, reviews, cart, checkout) require the backend to be running.

## Requirements
- Backend server must be running (see backend README)
- API endpoints are hardcoded to `http://localhost:5000`

## Notes
- For full functionality, do not open HTML files with the `file://` protocol; use a local server or open directly in a modern browser.
- All images and assets are local to the project. 