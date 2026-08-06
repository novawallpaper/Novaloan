// ======================================================
// depthnova Gardens — Farm House & Garden Decoration
// Plant Nursery + Online Plant Store
// Pure vanilla JS, no backend required.
// ======================================================

// ------------------------------------------------------
// PART 0 — BUSINESS CONFIG
// ------------------------------------------------------
const WHATSAPP_NUMBER = "919311649629"; // country code + number, digits only
const DELIVERY_CHARGE = 49;             // flat delivery charge (INR)
const FREE_DELIVERY_ABOVE = 499;        // free delivery threshold (INR)
const RAZORPAY_KEY_ID = "rzp_test_TC8rdQlrs9bLOu"; // replace with your live key when ready

// ------------------------------------------------------
// PART 1 — CATEGORY DEFINITIONS
// ------------------------------------------------------
const categories = [
    { key: "indoor",      label: "Indoor Plants",     icon: "fa-house" },
    { key: "outdoor",     label: "Outdoor Plants",    icon: "fa-tree" },
    { key: "flower",      label: "Flower Plants",     icon: "fa-spa" },
    { key: "fruit",       label: "Fruit Plants",      icon: "fa-apple-whole" },
    { key: "bonsai",      label: "Bonsai",            icon: "fa-seedling" },
    { key: "decorative",  label: "Decorative Plants", icon: "fa-gem" },
    { key: "pots",        label: "Pots",              icon: "fa-box" },
    { key: "fertilizers", label: "Fertilizers",       icon: "fa-flask" },
    { key: "tools",       label: "Gardening Tools",   icon: "fa-screwdriver-wrench" }
];

function categoryLabel(key) {
    const c = categories.find(c => c.key === key);
    return c ? c.label : key;
}

// ------------------------------------------------------
// PART 2 — SERVICES DATA
// ------------------------------------------------------
const servicesData = [
    { name: "Farm House Decoration", icon: "fa-house-chimney", desc: "Complete themed decor for farm houses and weekend homes." },
    { name: "Garden Design",         icon: "fa-drafting-compass", desc: "Custom garden layouts designed around your space and light." },
    { name: "Landscaping",           icon: "fa-mountain-sun", desc: "Full landscape transformation — lawns, beds, pathways and more." },
    { name: "Lawn Development",      icon: "fa-leaf", desc: "New lawn laying, turfing and ongoing lawn care." },
    { name: "Vertical Garden",       icon: "fa-layer-group", desc: "Space-saving living walls for balconies, patios and offices." },
    { name: "Water Fountain",        icon: "fa-water", desc: "Decorative water fountains designed and installed on-site." },
    { name: "Artificial Grass",      icon: "fa-grip-lines", desc: "All-weather artificial turf for lawns, terraces and rooftops." },
    { name: "Irrigation System",     icon: "fa-faucet-drip", desc: "Drip and sprinkler irrigation systems for efficient watering." },
    { name: "Plant Installation",    icon: "fa-seedling", desc: "On-site plant selection, planting and placement by our team." }
];

// ------------------------------------------------------
// PART 3 — PRODUCT CATALOG
// ------------------------------------------------------
const productData = [
    { id: 1, name: "Money Plant (Golden Pothos)", category: "indoor", price: 249, mrp: 349, rating: 4.6, reviews: 812, bestseller: true,
      desc: "An easy-to-grow trailing vine known for its air-purifying qualities. Thrives in low light and needs watering only once a week — perfect for beginners and busy homes." },
    { id: 2, name: "Snake Plant (Sansevieria)", category: "indoor", price: 349, mrp: 499, rating: 4.7, reviews: 654, bestseller: false,
      desc: "One of the toughest indoor plants around. Tolerates neglect, low light and irregular watering while releasing oxygen through the night." },
    { id: 3, name: "Areca Palm", category: "indoor", price: 899, mrp: 1199, rating: 4.5, reviews: 231, bestseller: false,
      desc: "A lush, feathery palm that instantly softens any corner. Great as a natural room divider or statement piece near windows." },
    { id: 4, name: "Peace Lily", category: "indoor", price: 449, mrp: 599, rating: 4.6, reviews: 398, bestseller: false,
      desc: "Elegant white blooms paired with glossy dark green leaves. Actively filters indoor air and thrives in medium to low light." },

    { id: 5, name: "Bougainvillea (Mixed Colour)", category: "outdoor", price: 299, mrp: 399, rating: 4.5, reviews: 276, bestseller: false,
      desc: "A vigorous flowering climber that covers boundary walls and gates in vibrant colour almost all year round." },
    { id: 6, name: "Hibiscus Plant", category: "outdoor", price: 249, mrp: 349, rating: 4.4, reviews: 189, bestseller: false,
      desc: "A classic garden shrub producing large, showy blooms through the warmer months. Loves full sun." },
    { id: 7, name: "Croton Plant", category: "outdoor", price: 349, mrp: 449, rating: 4.3, reviews: 142, bestseller: false,
      desc: "Bold, multi-coloured foliage that adds year-round colour to outdoor beds and borders without needing flowers." },
    { id: 8, name: "Curry Leaf Plant", category: "outdoor", price: 199, mrp: 279, rating: 4.7, reviews: 503, bestseller: false,
      desc: "A kitchen-garden essential — fresh curry leaves whenever you need them, straight from your own garden." },

    { id: 9, name: "Rose Plant (Mixed Colours)", category: "flower", price: 279, mrp: 399, rating: 4.6, reviews: 421, bestseller: true,
      desc: "Fragrant, repeat-flowering rose bushes available in mixed colours. A timeless addition to any garden bed." },
    { id: 10, name: "Marigold Plant", category: "flower", price: 99, mrp: 149, rating: 4.5, reviews: 367, bestseller: false,
      desc: "Bright, festive blooms that flower quickly and repeatedly — ideal for borders, pots and quick garden colour." },
    { id: 11, name: "Jasmine (Mogra) Plant", category: "flower", price: 329, mrp: 449, rating: 4.7, reviews: 298, bestseller: false,
      desc: "Deliciously fragrant night-blooming flowers. A traditional favourite for Indian gardens and courtyards." },
    { id: 12, name: "Petunia Plant", category: "flower", price: 149, mrp: 219, rating: 4.3, reviews: 118, bestseller: false,
      desc: "Compact, trailing flowers perfect for hanging baskets, window boxes and colourful balcony displays." },

    { id: 13, name: "Dwarf Mango Plant (Grafted)", category: "fruit", price: 599, mrp: 799, rating: 4.5, reviews: 214, bestseller: true,
      desc: "A grafted dwarf mango variety suited to home gardens and large pots, fruiting within 2–3 years." },
    { id: 14, name: "Guava Plant (Grafted)", category: "fruit", price: 449, mrp: 599, rating: 4.4, reviews: 176, bestseller: false,
      desc: "Sweet, disease-resistant grafted guava that fruits early and performs well in containers or open ground." },
    { id: 15, name: "Lemon Plant (Grafted)", category: "fruit", price: 349, mrp: 449, rating: 4.6, reviews: 245, bestseller: false,
      desc: "A reliable, near year-round fruiting lemon variety — great for both kitchen gardens and pots." },
    { id: 16, name: "Papaya Plant (Dwarf)", category: "fruit", price: 199, mrp: 279, rating: 4.2, reviews: 97, bestseller: false,
      desc: "Fast-growing dwarf papaya that fruits within the first year, well suited to smaller garden spaces." },

    { id: 17, name: "Ficus Bonsai", category: "bonsai", price: 1499, mrp: 1999, rating: 4.6, reviews: 88, bestseller: false,
      desc: "A beginner-friendly bonsai with a naturally sturdy trunk and glossy leaves, ideal for indoor display." },
    { id: 18, name: "Banyan Bonsai", category: "bonsai", price: 2199, mrp: 2799, rating: 4.8, reviews: 54, bestseller: false,
      desc: "A striking specimen featuring aerial roots and a broad canopy — a real conversation-starter centrepiece." },
    { id: 19, name: "Jade Bonsai", category: "bonsai", price: 999, mrp: 1299, rating: 4.5, reviews: 132, bestseller: false,
      desc: "A succulent-style bonsai that stores water in thick leaves, making it very forgiving and low maintenance." },

    { id: 20, name: "Areca Palm Decorative Planter Set", category: "decorative", price: 1299, mrp: 1699, rating: 4.5, reviews: 76, bestseller: false,
      desc: "A ready-to-place Areca palm in a premium designer planter — instant décor for entryways and lobbies." },
    { id: 21, name: "Artificial Boxwood Topiary Ball", category: "decorative", price: 799, mrp: 999, rating: 4.3, reviews: 61, bestseller: false,
      desc: "Zero-maintenance faux greenery that keeps its shape and colour all year, perfect for entrance décor." },
    { id: 22, name: "Hanging Macrame Planter (with Plant)", category: "decorative", price: 449, mrp: 599, rating: 4.4, reviews: 149, bestseller: false,
      desc: "Boho-style handwoven macrame planter, pre-planted and ready to hang on your balcony or patio." },

    { id: 23, name: "Ceramic Textured Pot (10 inch)", category: "pots", price: 349, mrp: 449, rating: 4.5, reviews: 203, bestseller: false,
      desc: "A premium textured ceramic pot with drainage hole, finished to complement both indoor and outdoor plants." },
    { id: 24, name: "Terracotta Pot Set (3 pcs)", category: "pots", price: 299, mrp: 399, rating: 4.4, reviews: 267, bestseller: false,
      desc: "Classic breathable terracotta pots in three sizes — great root aeration for healthier plants." },
    { id: 25, name: "Self-Watering Plastic Pot", category: "pots", price: 249, mrp: 329, rating: 4.2, reviews: 158, bestseller: false,
      desc: "Built-in water reservoir keeps soil consistently moist, reducing watering frequency for busy plant parents." },

    { id: 26, name: "Organic Vermicompost (5kg)", category: "fertilizers", price: 199, mrp: 249, rating: 4.6, reviews: 342, bestseller: false,
      desc: "100% organic, odourless compost that improves soil structure and feeds plants naturally." },
    { id: 27, name: "NPK 19:19:19 Fertilizer (1kg)", category: "fertilizers", price: 249, mrp: 329, rating: 4.4, reviews: 187, bestseller: false,
      desc: "A balanced water-soluble fertilizer for steady, all-round growth across flowering and foliage plants." },
    { id: 28, name: "Bio Neem Pest Spray (500ml)", category: "fertilizers", price: 199, mrp: 259, rating: 4.5, reviews: 221, bestseller: false,
      desc: "A gentle, plant-safe neem-based spray that keeps common pests away without harsh chemicals." },

    { id: 29, name: "Gardening Tool Set (5 pcs)", category: "tools", price: 499, mrp: 699, rating: 4.6, reviews: 289, bestseller: true,
      desc: "A durable 5-piece hand tool kit — trowel, fork, pruner, cultivator and gloves — everything a home gardener needs." },
    { id: 30, name: "Watering Can (2L)", category: "tools", price: 299, mrp: 399, rating: 4.3, reviews: 165, bestseller: false,
      desc: "A lightweight 2-litre watering can with a fine-rose spout for gentle, even watering of seedlings and pots." }
];

productData.forEach(p => {
    p.image = `https://picsum.photos/seed/depthnova-plant-${p.id}/600/600`;
    p.off = Math.round(((p.mrp - p.price) / p.mrp) * 100);
});

// ------------------------------------------------------
// PART 4 — REVIEWS + GALLERY DATA
// ------------------------------------------------------
const reviewsData = [
    { name: "Ananya Sharma", rating: 5, avatar: "https://i.pravatar.cc/150?img=47",
      text: "The team transformed our farm house lawn completely. Every plant they recommended is thriving even after the summer heat." },
    { name: "Rohan Mehta", rating: 5, avatar: "https://i.pravatar.cc/150?img=12",
      text: "Ordered a set of indoor plants — arrived healthy, well-packed, and exactly as shown. Will order again." },
    { name: "Priya Nair", rating: 4, avatar: "https://i.pravatar.cc/150?img=32",
      text: "Vertical garden installation for our balcony looks stunning. Quick site visit and quote on WhatsApp itself." },
    { name: "Vikram Singh", rating: 5, avatar: "https://i.pravatar.cc/150?img=51",
      text: "Subscribed to the Premium plant care plan — our garden has never looked healthier. Highly recommended." },
    { name: "Kavita Rao", rating: 5, avatar: "https://i.pravatar.cc/150?img=45",
      text: "Beautiful water fountain installed within the timeline promised. Great craftsmanship and clean finish." },
    { name: "Arjun Kapoor", rating: 4, avatar: "https://i.pravatar.cc/150?img=14",
      text: "Landscaping for our farm house driveway and lawn came out better than we imagined. Very professional crew." }
];

const galleryImages = [
    { seed: "gallery-farmhouse-1", wide: true },
    { seed: "gallery-lawn-2", wide: false },
    { seed: "gallery-fountain-3", wide: false },
    { seed: "gallery-vertical-4", wide: false },
    { seed: "gallery-pathway-5", wide: false },
    { seed: "gallery-garden-6", wide: true }
];

// ------------------------------------------------------
// PART 5 — APP STATE
// ------------------------------------------------------
let cartItems = [];       // [{ id, qty }]
let wishlistIds = [];     // [id, id, ...]
let currentShopCategory = "all";
let selectedPlan = "basic";
let modalProductId = null;
let modalQty = 1;
let uploadedQuoteImageName = "";

const toastEl = document.getElementById("app-toast");
const searchInput = document.getElementById("search-input");

// ------------------------------------------------------
// PART 6 — INIT
// ------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    renderShopCategoryBar();
    renderShopProducts();
    renderHomePopular();
    renderServicesGrid("home-services-grid");
    renderServicesGrid("more-services-grid");
    renderReviews("home-review-scroll");
    renderReviews("more-review-scroll");
    renderGallery();
    renderCart();
    selectPlan("basic");

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            renderShopProducts(this.value.trim().toLowerCase());
        });
    }

    const productModal = document.getElementById("product-modal");
    if (productModal) {
        productModal.addEventListener("click", (e) => {
            if (e.target === productModal) closeProductModal();
        });
    }
});

// ------------------------------------------------------
// PART 7 — NAVIGATION
// ------------------------------------------------------
function switchTab(tabName, element) {
    document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
    document.querySelectorAll(".screen-content").forEach(screen => screen.classList.remove("active"));
    if (element) element.classList.add("active");
    const screen = document.getElementById("screen-" + tabName);
    if (screen) screen.classList.add("active");
    const activeScreen = document.querySelector(".screen-content.active");
    if (activeScreen) activeScreen.scrollTop = 0;
}

function scrollMoreTo(elementId) {
    switchTab("more", document.getElementById("nav-more"));
    setTimeout(() => {
        const el = document.getElementById(elementId);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
}

function openHomeCategoryInfo(serviceName) {
    openQuoteSheet();
    const select = document.getElementById("q-project-type");
    if (select) {
        for (const opt of select.options) {
            if (opt.value === serviceName) { select.value = serviceName; break; }
        }
    }
}

// ------------------------------------------------------
// PART 8 — SHOP: CATEGORY BAR + PRODUCT GRID
// ------------------------------------------------------
function renderShopCategoryBar() {
    const bar = document.getElementById("shop-cat-bar");
    if (!bar) return;
    let html = `
      <div class="shop-cat-pill active" data-cat="all" onclick="switchShopCategory('all', this)">
        <div class="shop-cat-pill-icon"><i class="fa-solid fa-border-all"></i></div>
        <span>All</span>
      </div>`;
    categories.forEach(c => {
        html += `
      <div class="shop-cat-pill" data-cat="${c.key}" onclick="switchShopCategory('${c.key}', this)">
        <div class="shop-cat-pill-icon"><i class="fa-solid ${c.icon}"></i></div>
        <span>${c.label}</span>
      </div>`;
    });
    bar.innerHTML = html;
}

function switchShopCategory(catKey, element) {
    currentShopCategory = catKey;
    document.querySelectorAll(".shop-cat-pill").forEach(p => p.classList.remove("active"));
    if (element) element.classList.add("active");
    renderShopProducts(searchInput ? searchInput.value.trim().toLowerCase() : "");
}

function renderShopProducts(searchQuery = "") {
    const grid = document.getElementById("shop-product-grid");
    if (!grid) return;
    let list = [...productData];

    if (currentShopCategory !== "all") {
        list = list.filter(p => p.category === currentShopCategory);
    }
    if (searchQuery) {
        list = list.filter(p =>
            p.name.toLowerCase().includes(searchQuery) ||
            categoryLabel(p.category).toLowerCase().includes(searchQuery)
        );
    }

    if (list.length === 0) {
        grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><i class="fa-solid fa-magnifying-glass"></i><p>No products found. Try a different search.</p></div>`;
        return;
    }

    grid.innerHTML = list.map(p => productCardHtml(p)).join("");
}

function renderHomePopular() {
    const grid = document.getElementById("home-popular-grid");
    if (!grid) return;
    const list = productData.filter(p => p.bestseller).slice(0, 4);
    grid.innerHTML = list.map(p => productCardHtml(p)).join("");
}

function productCardHtml(p) {
    const wished = wishlistIds.includes(p.id);
    return `
    <div class="product-card">
      <div class="product-img-wrap" style="background-image:url('${p.image}')" onclick="openProductModal(${p.id})">
        <div class="card-top">
          ${p.bestseller ? `<span class="bestseller-badge"><i class="fa-solid fa-star"></i> BESTSELLER</span>` : `<span></span>`}
          <div class="product-wish-btn ${wished ? "wished" : ""}" onclick="toggleWishlist(event, ${p.id})">
            <i class="fa-solid fa-heart"></i>
          </div>
        </div>
      </div>
      <div class="product-info">
        <h4 onclick="openProductModal(${p.id})">${p.name}</h4>
        <div class="product-rating"><i class="fa-solid fa-star"></i> ${p.rating.toFixed(1)} <span>(${p.reviews})</span></div>
        <div class="product-price-row">
          <span class="product-price">₹${p.price}</span>
          <span class="product-mrp">₹${p.mrp}</span>
          <span class="product-off">${p.off}% OFF</span>
        </div>
        <div class="product-btn-row">
          <button class="product-btn-cart" onclick="event.stopPropagation(); addToCart(${p.id}, 1);"><i class="fa-solid fa-cart-plus"></i> Add</button>
          <button class="product-btn-buy" onclick="event.stopPropagation(); buyNow(${p.id});">Buy Now</button>
        </div>
      </div>
    </div>`;
}

// ------------------------------------------------------
// PART 9 — PRODUCT DETAIL MODAL
// ------------------------------------------------------
function openProductModal(id) {
    const p = productData.find(x => x.id === id);
    if (!p) return;
    modalProductId = id;
    modalQty = 1;

    const modal = document.getElementById("product-modal");
    const modalBg = document.getElementById("modal-preview-bg");
    modalBg.style.backgroundImage = `url('${p.image}')`;
    modalBg.style.backgroundSize = "cover";
    modalBg.style.backgroundPosition = "center";

    document.getElementById("modal-product-title").innerText = p.name;
    document.getElementById("modal-product-cat").innerText = categoryLabel(p.category);
    document.getElementById("modal-product-rating").innerHTML = `<i class="fa-solid fa-star"></i> ${p.rating.toFixed(1)} <span>(${p.reviews} ratings)</span>`;
    document.getElementById("modal-product-price").innerText = `₹${p.price}`;
    document.getElementById("modal-product-mrp").innerText = `₹${p.mrp}`;
    document.getElementById("modal-product-off").innerText = `${p.off}% OFF`;
    document.getElementById("modal-product-desc").innerText = p.desc;
    document.getElementById("modal-product-qty").innerText = modalQty;

    const favBtn = document.getElementById("modal-fav-btn");
    favBtn.classList.toggle("favorited", wishlistIds.includes(id));

    modal.classList.add("active");
}

function closeProductModal() {
    document.getElementById("product-modal").classList.remove("active");
}

function changeModalQty(delta) {
    modalQty = Math.max(1, modalQty + delta);
    document.getElementById("modal-product-qty").innerText = modalQty;
}

function addModalToCart() {
    if (!modalProductId) return;
    addToCart(modalProductId, modalQty);
    closeProductModal();
}

function buyModalNow() {
    if (!modalProductId) return;
    addToCart(modalProductId, modalQty);
    closeProductModal();
    openCheckoutSheet();
}

function toggleFavoriteModal() {
    if (!modalProductId) return;
    toggleWishlistById(modalProductId);
    const favBtn = document.getElementById("modal-fav-btn");
    favBtn.classList.toggle("favorited", wishlistIds.includes(modalProductId));
}

// ------------------------------------------------------
// PART 10 — WISHLIST
// ------------------------------------------------------
function toggleWishlist(event, id) {
    event.stopPropagation();
    toggleWishlistById(id);
    renderShopProducts(searchInput ? searchInput.value.trim().toLowerCase() : "");
    renderHomePopular();
}

function toggleWishlistById(id) {
    const idx = wishlistIds.indexOf(id);
    if (idx > -1) {
        wishlistIds.splice(idx, 1);
        showToast("Removed from Wishlist");
    } else {
        wishlistIds.push(id);
        showToast("Added to Wishlist ❤️");
    }
}

function openWishlistSheet() {
    const grid = document.getElementById("wishlist-grid");
    const empty = document.getElementById("wishlist-empty-state");
    const list = productData.filter(p => wishlistIds.includes(p.id));

    if (list.length === 0) {
        grid.innerHTML = "";
        grid.style.display = "none";
        empty.style.display = "block";
    } else {
        grid.style.display = "grid";
        empty.style.display = "none";
        grid.innerHTML = list.map(p => productCardHtml(p)).join("");
    }
    document.getElementById("wishlist-sheet-overlay").classList.add("active");
}

// ------------------------------------------------------
// PART 11 — CART
// ------------------------------------------------------
function addToCart(id, qty = 1) {
    const existing = cartItems.find(c => c.id === id);
    if (existing) {
        existing.qty += qty;
    } else {
        cartItems.push({ id, qty });
    }
    renderCart();
    showToast("Added to Cart 🛒");
}

function buyNow(id) {
    addToCart(id, 1);
    openCheckoutSheet();
}

function updateCartQty(id, delta) {
    const item = cartItems.find(c => c.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        cartItems = cartItems.filter(c => c.id !== id);
    }
    renderCart();
}

function removeFromCart(id) {
    cartItems = cartItems.filter(c => c.id !== id);
    renderCart();
    showToast("Item removed from cart");
}

function getCartTotals() {
    let subtotal = 0;
    cartItems.forEach(c => {
        const p = productData.find(x => x.id === c.id);
        if (p) subtotal += p.price * c.qty;
    });
    const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_CHARGE;
    const grandTotal = subtotal + delivery;
    return { subtotal, delivery, grandTotal };
}

function renderCart() {
    const list = document.getElementById("cart-items-list");
    const emptyState = document.getElementById("cart-empty-state");
    const summaryCard = document.getElementById("cart-summary-card");

    updateCartBadge();

    if (!list) return;

    if (cartItems.length === 0) {
        list.innerHTML = "";
        emptyState.style.display = "block";
        summaryCard.style.display = "none";
        return;
    }

    emptyState.style.display = "none";
    summaryCard.style.display = "block";

    list.innerHTML = cartItems.map(c => {
        const p = productData.find(x => x.id === c.id);
        if (!p) return "";
        return `
        <div class="cart-item-row">
          <div class="cart-item-img" style="background-image:url('${p.image}')"></div>
          <div class="cart-item-info">
            <h4>${p.name}</h4>
            <div class="cart-item-price">₹${p.price * c.qty}</div>
            <div class="cart-item-controls">
              <div class="qty-stepper">
                <button onclick="updateCartQty(${p.id}, -1)">−</button>
                <span>${c.qty}</span>
                <button onclick="updateCartQty(${p.id}, 1)">+</button>
              </div>
              <div class="cart-remove-btn" onclick="removeFromCart(${p.id})"><i class="fa-solid fa-trash"></i></div>
            </div>
          </div>
        </div>`;
    }).join("");

    const { subtotal, delivery, grandTotal } = getCartTotals();
    document.getElementById("cart-subtotal").innerText = `₹${subtotal}`;
    document.getElementById("cart-delivery").innerText = delivery === 0 ? "FREE" : `₹${delivery}`;
    document.getElementById("cart-grand-total").innerText = `₹${grandTotal}`;
}

function updateCartBadge() {
    const totalQty = cartItems.reduce((sum, c) => sum + c.qty, 0);
    const badge = document.getElementById("cart-badge-home");
    if (badge) badge.innerText = totalQty;
}

// ------------------------------------------------------
// PART 12 — SHEETS (open/close helpers)
// ------------------------------------------------------
function closeSheet(id) {
    document.getElementById(id).classList.remove("active");
}

function openCheckoutSheet() {
    if (cartItems.length === 0) {
        showToast("Your cart is empty");
        return;
    }
    document.getElementById("checkout-sheet-overlay").classList.add("active");
}

function openQuoteSheet() {
    document.getElementById("quote-sheet-overlay").classList.add("active");
}

// ------------------------------------------------------
// PART 13 — CHECKOUT → WHATSAPP
// ------------------------------------------------------
function placeOrder() {
    const name = document.getElementById("co-name").value.trim();
    const mobile = document.getElementById("co-mobile").value.trim();
    const email = document.getElementById("co-email").value.trim();
    const address = document.getElementById("co-address").value.trim();
    const state = document.getElementById("co-state").value.trim();
    const city = document.getElementById("co-city").value.trim();
    const pincode = document.getElementById("co-pincode").value.trim();
    const landmark = document.getElementById("co-landmark").value.trim();

    if (!name || !mobile || !address || !state || !city || !pincode) {
        showToast("Please fill all required fields (*)");
        return;
    }
    if (!/^\d{10}$/.test(mobile)) {
        showToast("Please enter a valid 10-digit mobile number");
        return;
    }

    const { subtotal, delivery, grandTotal } = getCartTotals();

    let productLines = cartItems.map(c => {
        const p = productData.find(x => x.id === c.id);
        return p ? `• ${p.name} x${c.qty} = ₹${p.price * c.qty}` : "";
    }).join("\n");

    const message =
`🌿 *New Order — depthnova Gardens*

*Customer Details*
Name: ${name}
Mobile: ${mobile}
Email: ${email || "-"}

*Delivery Address*
${address}
${landmark ? "Landmark: " + landmark : ""}
${city}, ${state} - ${pincode}

*Order Items*
${productLines}

Subtotal: ₹${subtotal}
Delivery: ${delivery === 0 ? "FREE" : "₹" + delivery}
*Grand Total: ₹${grandTotal}*

Please confirm my order. Thank you!`;

    openWhatsAppMessage(message);

    cartItems = [];
    renderCart();
    closeSheet("checkout-sheet-overlay");
    showToast("Order sent on WhatsApp! We'll confirm shortly.");
}

// Optional: pay online instead of / in addition to WhatsApp confirmation
function payOnlineRazorpay() {
    if (typeof Razorpay === "undefined") {
        showToast("Payment SDK not loaded. Check your connection.");
        return;
    }
    const { grandTotal } = getCartTotals();
    if (grandTotal <= 0) {
        showToast("Your cart is empty");
        return;
    }
    const options = {
        key: RAZORPAY_KEY_ID,
        amount: grandTotal * 100,
        currency: "INR",
        name: "depthnova Gardens",
        description: "Plant Store Order Payment",
        prefill: {
            name: document.getElementById("co-name").value.trim(),
            contact: document.getElementById("co-mobile").value.trim(),
            email: document.getElementById("co-email").value.trim()
        },
        theme: { color: "#1a8f4c" },
        handler: function () {
            showToast("Payment Successful! Confirming your order...");
            placeOrder();
        },
        modal: {
            ondismiss: function () { showToast("Payment Cancelled"); }
        }
    };
    const rzp = new Razorpay(options);
    rzp.on("payment.failed", function () { showToast("Payment Failed. Please try again."); });
    rzp.open();
}

// ------------------------------------------------------
// PART 14 — INSTANT QUOTE → WHATSAPP
// ------------------------------------------------------
function handleQuoteImageUpload(event) {
    const file = event.target.files[0];
    const box = document.getElementById("q-upload-box");
    if (!file) return;
    uploadedQuoteImageName = file.name;
    const reader = new FileReader();
    reader.onload = function (e) {
        box.classList.add("has-image");
        box.innerHTML = `<img src="${e.target.result}" alt="Uploaded site photo" />`;
    };
    reader.readAsDataURL(file);
}

function submitQuote() {
    const name = document.getElementById("q-name").value.trim();
    const mobile = document.getElementById("q-mobile").value.trim();
    const city = document.getElementById("q-city").value.trim();
    const projectType = document.getElementById("q-project-type").value;
    const area = document.getElementById("q-area").value.trim();
    const budget = document.getElementById("q-budget").value.trim();
    const notes = document.getElementById("q-notes").value.trim();

    if (!name || !mobile || !city || !projectType || !area) {
        showToast("Please fill all required fields (*)");
        return;
    }
    if (!/^\d{10}$/.test(mobile)) {
        showToast("Please enter a valid 10-digit mobile number");
        return;
    }

    const message =
`🌱 *Instant Quote Request — depthnova Gardens*

Name: ${name}
Mobile: ${mobile}
City: ${city}
Project Type: ${projectType}
Area Size: ${area}
Budget: ${budget || "Not specified"}
${uploadedQuoteImageName ? "Site Photo: " + uploadedQuoteImageName + " (I'll share the photo here on WhatsApp)" : ""}

Notes: ${notes || "-"}

Please share a quote for my project. Thank you!`;

    openWhatsAppMessage(message);
    closeSheet("quote-sheet-overlay");
    showToast("Request sent on WhatsApp!");
}

// ------------------------------------------------------
// PART 15 — SUBSCRIPTION PLANS
// ------------------------------------------------------
function selectPlan(planId) {
    selectedPlan = planId;
    document.getElementById("plan-basic").classList.toggle("selected", planId === "basic");
    document.getElementById("plan-premium").classList.toggle("selected", planId === "premium");
    document.querySelectorAll(".plan-radio i").forEach(i => i.style.display = "none");
    const activePlan = document.getElementById("plan-" + planId);
    if (activePlan) activePlan.querySelector(".plan-radio i").style.display = "block";
}

function subscribePlan() {
    const planName = selectedPlan === "premium"
        ? "Premium Plan (Weekly maintenance, health check, pest inspection, watering inspection, fertilizer guidance, cleaning & small issue fixing)"
        : "Basic Plan (One visit every 7 days)";
    const message = `🪴 *Plant Care Subscription Request — depthnova Gardens*\n\nI'd like to subscribe to the:\n${planName}\n\nPlease share the pricing and next steps.`;
    openWhatsAppMessage(message);
    showToast("Subscription request sent on WhatsApp!");
}

// ------------------------------------------------------
// PART 16 — REVIEWS + GALLERY RENDER
// ------------------------------------------------------
function renderReviews(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = reviewsData.map(r => `
      <div class="review-card">
        <div class="review-top">
          <div class="review-avatar" style="background-image:url('${r.avatar}')"></div>
          <div>
            <div class="review-name">${r.name}</div>
            <div class="review-stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
          </div>
        </div>
        <p class="review-text">${r.text}</p>
      </div>
    `).join("");
}

function renderGallery() {
    const el = document.getElementById("gallery-grid");
    if (!el) return;
    el.innerHTML = galleryImages.map(g => `
      <div class="gallery-tile ${g.wide ? "wide" : ""}" style="background-image:url('https://picsum.photos/seed/${g.seed}/700/500')"></div>
    `).join("");
}

// ------------------------------------------------------
// PART 17 — SERVICES RENDER
// ------------------------------------------------------
function renderServicesGrid(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = servicesData.map(s => `
      <div class="service-tile" onclick="openHomeCategoryInfo('${s.name}')">
        <div class="service-tile-icon"><i class="fa-solid ${s.icon}"></i></div>
        <p>${s.name}</p>
      </div>
    `).join("");
}

// ------------------------------------------------------
// PART 18 — CONTACT ACTIONS
// ------------------------------------------------------
function contactWhatsApp() {
    openWhatsAppMessage("Hi depthnova Gardens, I'd like to know more about your services.");
}

function contactCall() {
    window.location.href = `tel:+${WHATSAPP_NUMBER}`;
}

function contactEmail() {
    window.location.href = "mailto:depthnovacustomersupport@gmail.com";
}

function openWhatsAppMessage(message) {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
}

// ------------------------------------------------------
// PART 19 — POLICY SHEETS (About / Privacy / Terms)
// ------------------------------------------------------
const policyContent = {
    about: {
        title: "About Us",
        body: `
        <p><strong>depthnova Gardens</strong> is a farm house & garden decoration studio and online plant nursery, helping homes, farm houses and offices turn empty spaces into thriving green environments.</p>
        <h4>What We Do</h4>
        <p>We design and build complete outdoor spaces — from farm house decoration and garden design to landscaping, lawns, vertical gardens, water features and irrigation systems. Alongside our project work, our online plant store delivers healthy indoor and outdoor plants, pots, fertilizers and gardening tools straight to your door.</p>
        <h4>Our Promise</h4>
        <p>Every plant we sell and every project we take on is backed by our in-house horticulture team. We also offer ongoing Plant Care Subscription plans so your garden keeps looking its best long after installation day.</p>
        <h4>Get In Touch</h4>
        <p>Reach us anytime on WhatsApp or phone at +91 93116 49629, or email depthnovacustomersupport@gmail.com for quotes, orders or support.</p>`
    },
    privacy: {
        title: "Privacy Policy",
        body: `
        <p>This Privacy Policy explains how depthnova Gardens ("we", "us") collects and uses information when you use this website.</p>
        <h4>Information We Collect</h4>
        <p>When you place an order, request a quote or contact us, we collect details you provide directly — such as your name, mobile number, email, delivery address and project information. Cart and wishlist selections are stored only in your browser session and are not transmitted to any server unless you submit an order or quote request.</p>
        <h4>How We Use Your Information</h4>
        <p>Order and quote details you submit are sent directly to our business WhatsApp number to process your order, prepare a quote, or respond to your enquiry. We do not sell or share your personal information with third parties for marketing purposes.</p>
        <h4>Payments</h4>
        <p>Online payments made through Razorpay are processed by Razorpay's secure payment gateway. We do not store your card, UPI or banking details on our systems.</p>
        <h4>Contact</h4>
        <p>For any privacy-related questions, please email depthnovacustomersupport@gmail.com.</p>`
    },
    terms: {
        title: "Terms & Conditions",
        body: `
        <p>By using this website and placing an order or quote request, you agree to the following terms.</p>
        <h4>Orders & Pricing</h4>
        <p>Product prices, discounts and delivery charges shown are correct at the time of listing and may change without prior notice. Orders placed via WhatsApp are confirmed by our team before dispatch.</p>
        <h4>Plants & Delivery</h4>
        <p>Plants are living products and their appearance may vary slightly from photos shown. We take care to pack and deliver plants safely; please inspect your order on delivery and report any issues to us within 24 hours.</p>
        <h4>Services & Quotes</h4>
        <p>Instant Quote requests are estimates based on the information and photos you provide. A final quote is confirmed only after our team reviews your requirements or completes a site visit where required.</p>
        <h4>Subscriptions</h4>
        <p>Plant Care Subscription plans renew as per the schedule agreed with our team at the time of subscribing and can be cancelled by contacting us on WhatsApp.</p>
        <h4>Payments</h4>
        <p>Online payments are securely processed via Razorpay. Cash-on-delivery/WhatsApp-confirmed orders are settled as agreed with our team at the time of order confirmation.</p>`
    }
};

function openPolicySheet(type) {
    const content = policyContent[type];
    if (!content) return;
    document.getElementById("policy-sheet-title").innerText = content.title;
    document.getElementById("policy-sheet-body").innerHTML = content.body;
    document.getElementById("policy-sheet-overlay").classList.add("active");
}

function closePolicySheet() {
    document.getElementById("policy-sheet-overlay").classList.remove("active");
}

// ------------------------------------------------------
// PART 20 — TOAST
// ------------------------------------------------------
function showToast(message) {
    if (!toastEl) { console.log(message); return; }
    toastEl.innerText = message;
    toastEl.classList.add("show");
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2500);
}
