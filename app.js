/* Zivelle Online Shop
   Product search, category filter, cart and WhatsApp ordering.
*/

"use strict";

const STORE = {
  name: "Zivelle",
  tagline: "Little joys, Every day.",
  whatsapp: "", // এখানে তোমার WhatsApp নম্বর দেবে, যেমন: 8801XXXXXXXXX
  currency: "৳"
};

const starterProducts = [
  {
    id: 1,
    name: "Elegant Everyday Bag",
    category: "Accessories",
    price: 1250,
    oldPrice: 1500,
    image: "assets/product-1.jpg",
    description: "A stylish bag for everyday use.",
    badge: "Popular"
  },
  {
    id: 2,
    name: "Minimalist Watch",
    category: "Accessories",
    price: 1650,
    oldPrice: 1950,
    image: "assets/product-2.jpg",
    description: "A timeless accessory for your look.",
    badge: "Trending"
  },
  {
    id: 3,
    name: "Premium Gift Box",
    category: "Gifts",
    price: 850,
    oldPrice: 1000,
    image: "assets/product-3.jpg",
    description: "A lovely gift for someone special.",
    badge: "Gift Pick"
  },
  {
    id: 4,
    name: "Daily Essentials Set",
    category: "Lifestyle",
    price: 950,
    oldPrice: 1150,
    image: "assets/product-4.jpg",
    description: "Little essentials for your daily routine.",
    badge: "New"
  },
  {
    id: 5,
    name: "Chic Mini Purse",
    category: "Accessories",
    price: 750,
    oldPrice: 900,
    image: "assets/product-5.jpg",
    description: "A compact purse with a chic design.",
    badge: ""
  },
  {
    id: 6,
    name: "Cute Desk Decor",
    category: "Lifestyle",
    price: 550,
    oldPrice: 650,
    image: "assets/product-6.jpg",
    description: "Make your workspace feel special.",
    badge: ""
  },
  {
    id: 7,
    name: "Special Gift Hamper",
    category: "Gifts",
    price: 1450,
    oldPrice: 1700,
    image: "assets/product-7.jpg",
    description: "A thoughtful hamper for special occasions.",
    badge: "Special"
  },
  {
    id: 8,
    name: "Everyday Tote Bag",
    category: "Bags",
    price: 690,
    oldPrice: 850,
    image: "assets/product-8.jpg",
    description: "A practical tote for everyday errands.",
    badge: ""
  }
];

const PRODUCT_STORAGE_KEY = "zivelle_products_v1";
const CART_STORAGE_KEY = "zivelle_cart_v1";

let products = loadProducts();
let cart = loadCart();
let activeCategory = "All";
let searchTerm = "";

function loadProducts() {
  try {
    const saved = localStorage.getItem(PRODUCT_STORAGE_KEY);
    return saved ? JSON.parse(saved) : starterProducts;
  } catch (error) {
    console.error("Unable to load products:", error);
    return starterProducts;
  }
}

function loadCart() {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Unable to load cart:", error);
    return [];
  }
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function formatPrice(price) {
  return STORE.currency + Number(price || 0).toLocaleString("en-BD");
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function getElement(...ids) {
  for (const id of ids) {
    const element = document.getElementById(id);
    if (element) return element;
  }
  return null;
}

function showToast(message) {
  let toast = getElement("toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function getProductImage(product) {
  return escapeHTML(product.image || "assets/product-placeholder.jpg");
}

function renderProducts() {
  const grid = getElement("productGrid", "productsGrid", "products");
  if (!grid) return;

  const filteredProducts = products.filter(product => {
    const categoryMatches =
      activeCategory === "All" ||
      product.category === activeCategory;

    const text = [
      product.name,
      product.category,
      product.description
    ].join(" ").toLowerCase();

    return categoryMatches && text.includes(searchTerm.toLowerCase());
  });

  if (!filteredProducts.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <h3>No products found</h3>
        <p>Try another search or category.</p>
      </div>`;
    return;
  }

  grid.innerHTML = filteredProducts.map(product => `
    <article class="product-card">
      <div class="product-image">
        <img
          src="${getProductImage(product)}"
          alt="${escapeHTML(product.name)}"
          loading="lazy"
          onerror="this.onerror=null;this.src='assets/product-placeholder.jpg';"
        >
        ${product.badge ? `
          <span class="product-badge">
            ${escapeHTML(product.badge)}
          </span>` : ""}
      </div>

      <div class="product-info">
        <p>${escapeHTML(product.category)}</p>
        <h3>${escapeHTML(product.name)}</h3>
        <p>${escapeHTML(product.description || "")}</p>

        <div class="product-price">
          <span>${formatPrice(product.price)}</span>
          ${product.oldPrice ? `
            <span class="old-price">
              ${formatPrice(product.oldPrice)}
            </span>` : ""}
        </div>

        <div class="product-actions">
          <button
            class="btn btn-primary"
            type="button"
            data-add-to-cart="${Number(product.id)}"
          >
            Add to Cart
          </button>

          <button
            class="btn btn-outline"
            type="button"
            data-buy-now="${Number(product.id)}"
          >
            Buy Now
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

function renderCart() {
  const cartItems = getElement("cartItems");
  const cartCount = getElement("cartCount", "cart-count");
  const cartTotal = getElement("cartTotal", "cart-total");

  const totalQuantity = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const totalPrice = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  if (cartCount) cartCount.textContent = totalQuantity;
  if (cartTotal) cartTotal.textContent = formatPrice(totalPrice);

  if (!cartItems) return;

  const validItems = cart.filter(item =>
    products.some(product => product.id === item.id)
  );

  if (!validItems.length) {
    cartItems.innerHTML = `
      <div class="empty-state">
        <p>Your cart is empty.</p>
        <p>Add something lovely from Zivelle!</p>
      </div>`;
    return;
  }

  cartItems.innerHTML = validItems.map(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return "";

    return `
      <div class="cart-item">
        <img
          src="${getProductImage(product)}"
          alt="${escapeHTML(product.name)}"
          onerror="this.onerror=null;this.src='assets/product-placeholder.jpg';"
        >

        <div>
          <h4>${escapeHTML(product.name)}</h4>
          <p>${formatPrice(product.price)}</p>

          <div class="quantity-controls">
            <button
              type="button"
              data-cart-minus="${Number(product.id)}"
              aria-label="Decrease quantity"
            >−</button>

            <span>${Number(item.quantity)}</span>

            <button
              type="button"
              data-cart-plus="${Number(product.id)}"
              aria-label="Increase quantity"
            >+</button>
          </div>
        </div>

        <button
          type="button"
          class="drawer-close"
          data-cart-remove="${Number(product.id)}"
          aria-label="Remove ${escapeHTML(product.name)}"
        >×</button>
      </div>`;
  }).join("");
}

function addToCart(productId) {
  const id = Number(productId);
  const product = products.find(item => item.id === id);

  if (!product) {
    showToast("Product not found.");
    return;
  }

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, quantity: 1 });
  }

  saveCart();
  renderCart();
  showToast(product.name + " added to cart.");
}

function updateQuantity(productId, change) {
  const id = Number(productId);
  const item = cart.find(entry => entry.id === id);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(entry => entry.id !== id);
  }

  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  const id = Number(productId);
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
  showToast("Item removed from cart.");
}

function openCart() {
  const drawer = getElement("cartDrawer");
  const overlay = getElement("overlay");

  if (drawer) drawer.classList.add("open");
  if (overlay) overlay.classList.add("show");

  document.body.style.overflow = "hidden";
}

function closeCart() {
  const drawer = getElement("cartDrawer");
  const overlay = getElement("overlay");

  if (drawer) drawer.classList.remove("open");
  if (overlay) overlay.classList.remove("show");

  document.body.style.overflow = "";
}

function checkoutWhatsApp() {
  if (!cart.length) {
    showToast("Your cart is empty.");
    return;
  }

  if (!STORE.whatsapp) {
    showToast("WhatsApp number has not been configured yet.");
    return;
  }

  const lines = [
    `Hello ${STORE.name}! I want to place an order:`,
    ""
  ];

  let total = 0;

  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return;

    const lineTotal = product.price * item.quantity;
    total += lineTotal;

    lines.push(
      `${product.name} × ${item.quantity} = ${formatPrice(lineTotal)}`
    );
  });

  lines.push("");
  lines.push(`Total: ${formatPrice(total)}`);
  lines.push("");
  lines.push("Please let me know the delivery details.");

  const url = "https://wa.me/" +
    STORE.whatsapp.replace(/\D/g, "") +
    "?text=" + encodeURIComponent(lines.join("\n"));

  window.open(url, "_blank", "noopener,noreferrer");
}

function buyNow(productId) {
  const id = Number(productId);
  const product = products.find(item => item.id === id);
  if (!product) return;

  addToCart(id);
  openCart();
}

function filterByCategory(category) {
  activeCategory = category || "All";
  renderProducts();

  const productsSection = getElement("shop", "products-section");
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: "smooth" });
  }
}

function setupSearch() {
  const search = getElement("productSearch", "searchInput");

  if (search) {
    search.addEventListener("input", event => {
      searchTerm = event.target.value.trim();
      renderProducts();
    });
  }

  const categoryFilter = getElement("categoryFilter");

  if (categoryFilter) {
    categoryFilter.addEventListener("change", event => {
      filterByCategory(event.target.value);
    });
  }
}

function setupNavigation() {
  const menuToggle = getElement("menuToggle", "menu-toggle");
  const navLinks = getElement("navLinks", "nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }

  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      if (navLinks) navLinks.classList.remove("open");
    });
  });
}

function setupEvents() {
  document.addEventListener("click", event => {
    const target = event.target.closest("button, a");
    if (!target) return;

    if (target.matches("[data-add-to-cart]")) {
      addToCart(target.dataset.addToCart);
    }

    if (target.matches("[data-buy-now]")) {
      buyNow(target.dataset.buyNow);
    }

    if (target.matches("[data-cart-plus]")) {
      updateQuantity(target.dataset.cartPlus, 1);
    }

    if (target.matches("[data-cart-minus]")) {
      updateQuantity(target.dataset.cartMinus, -1);
    }

    if (target.matches("[data-cart-remove]")) {
      removeFromCart(target.dataset.cartRemove);
    }

    if (target.matches("[data-category]")) {
      event.preventDefault();
      filterByCategory(target.dataset.category);
    }

    if (target.matches("#cartButton, #openCart")) {
      event.preventDefault();
      openCart();
    }

    if (target.matches("#closeCart, #cartClose")) {
      event.preventDefault();
      closeCart();
    }

    if (target.matches("#overlay")) {
      closeCart();
    }

    if (target.matches("#checkoutButton, #checkout")) {
      event.preventDefault();
      checkoutWhatsApp();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeCart();
  });
}

function setupNewsletter() {
  const form = getElement("newsletterForm");

  if (!form) return;

  form.addEventListener("submit", event => {
    event.preventDefault();
    showToast("Thanks for your interest in Zivelle!");
    form.reset();
  });
}

function initializeStore() {
  renderProducts();
  renderCart();
  setupSearch();
  setupNavigation();
  setupEvents();
  setupNewsletter();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeStore);
} else {
  initializeStore();
}

/*
IMPORTANT:
This starter storefront stores cart/product demo data in this browser only.
A real Admin Panel with shared product updates needs a secure backend/database.
*/
