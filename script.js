const productData = [
  { name: "Fortified maize flour", detail: "2 kg family pack", price: 6500, category: "Pantry", image: "🌽", tone: "yellow" },
  { name: "Premium rice", detail: "5 kg household pack", price: 24500, category: "Pantry", image: "🍚", tone: "cream" },
  { name: "Sunflower cooking oil", detail: "3 litre bottle", price: 28500, category: "Pantry", image: "🫗", tone: "green" },
  { name: "Laundry soap bundle", detail: "4 × 500 g bars", price: 12000, category: "Household", image: "🧼", tone: "yellow" },
  { name: "School exercise books", detail: "10 book bundle", price: 15000, category: "Scholastics", image: "📒", tone: "cream" },
  { name: "Assorted sweets", detail: "Mixed counter pack", price: 8000, category: "Sweets", image: "🍬", tone: "green" },
  { name: "Fresh market basket", detail: "Seasonal grocery mix", price: 18000, category: "Groceries", image: "🥬", tone: "yellow" },
  { name: "Toilet tissue", detail: "10 roll value pack", price: 14000, category: "Household", image: "🧻", tone: "cream" },
];

const categories = ["All goods", "Household", "Pantry", "Scholastics", "Groceries", "Sweets"];

let activeCategory = "All goods";
let searchQuery = "";

function formatMoney(value) {
  return `UGX ${value.toLocaleString("en-UG")}`;
}

const iconChevronRight = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;
const iconArrowUpRight = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>`;

function renderCategories() {
  const list = document.getElementById("categoryList");
  list.innerHTML = categories
    .map((category, index) => {
      const activeClass = category === activeCategory ? " active" : "";
      const number = String(index + 1).padStart(2, "0");
      return `
        <button class="category-chip${activeClass}" data-category="${category}">
          <span>${number}</span>
          ${category}
          ${iconChevronRight}
        </button>`;
    })
    .join("");

  list.querySelectorAll(".category-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      activeCategory = chip.dataset.category;
      renderCategories();
      renderProducts();
    });
  });
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  const emptyState = document.getElementById("emptyState");

  const filtered = productData.filter((product) => {
    const matchesCategory = activeCategory === "All goods" || product.category === activeCategory;
    const haystack = `${product.name} ${product.detail} ${product.category}`.toLowerCase();
    const matchesQuery = haystack.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  grid.innerHTML = filtered
    .map((product, index) => {
      const number = String(index + 1).padStart(2, "0");
      return `
        <article class="product-card ${product.tone}" style="animation-delay:${index * 45}ms">
          <div class="product-image">
            <span>${product.image}</span>
            <div class="product-number">${number}</div>
          </div>
          <div class="product-content">
            <span class="product-category">${product.category}</span>
            <h3>${product.name}</h3>
            <p>${product.detail}</p>
            <div class="product-bottom">
              <strong>${formatMoney(product.price)}</strong>
              <button class="enquire-btn" data-item="${product.name}" aria-label="Enquire about ${product.name}">
                ${iconArrowUpRight}
              </button>
            </div>
          </div>
        </article>`;
    })
    .join("");

  emptyState.style.display = filtered.length === 0 ? "block" : "none";

  grid.querySelectorAll(".enquire-btn").forEach((button) => {
    button.addEventListener("click", () => showEnquiry(button.dataset.item));
  });
}

document.getElementById("searchInput").addEventListener("input", (event) => {
  searchQuery = event.target.value;
  renderProducts();
});

const menuButton = document.getElementById("menuButton");
const mainNav = document.getElementById("mainNav");
const menuIconOpen = document.getElementById("menuIconOpen");
const menuIconClose = document.getElementById("menuIconClose");

menuButton.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuIconOpen.style.display = isOpen ? "none" : "block";
  menuIconClose.style.display = isOpen ? "block" : "none";
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuIconOpen.style.display = "block";
    menuIconClose.style.display = "none";
  });
});

function showEnquiry(item = "our current stock") {
  const container = document.getElementById("toastContainer");

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <strong>Enquiry noted for ${item}.</strong>
    <p>Call or WhatsApp us on +256 752 418 902 to confirm availability.</p>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("fade-out");
    toast.addEventListener("animationend", () => toast.remove());
  }, 3500);
}

document.getElementById("askBulkRates").addEventListener("click", () => showEnquiry());
document.getElementById("enquireStock").addEventListener("click", () => showEnquiry("bulk quantities"));
document.getElementById("contactShop").addEventListener("click", () => showEnquiry("a store visit"));

renderCategories();
renderProducts();