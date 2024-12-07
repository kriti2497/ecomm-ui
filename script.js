const productGrid = document.getElementById("product-grid");
const filterContainer = document.getElementById("filter-categories");
const sortSelect = document.getElementById("sort");
const hamburger = document.getElementById("hamburger");

let allProducts = [];
let selectedFilters = [];

const fetchProducts = async () => {
  try {
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "loading-container";
    loadingDiv.innerHTML = `
    <p>Loading....</p>
    `;
    productGrid.append(loadingDiv);
    const response = await fetch("https://fakestoreapi.com/products");
    allProducts = await response.json();
    renderProducts(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

// Render products
const renderProducts = (products) => {
  const totalResults = document.getElementById("total-count");

  totalResults.innerHTML = `${products.length} Results`;

  productGrid.innerHTML = "";
  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.dataset.category = product.category.toLowerCase();

    productCard.innerHTML = `
    <div>
      <img src="${product.image}" alt="${product.title}" />
      </div>
      <h3 title="${product.title}">${product.title}</h3>
      <p>$${product.price.toFixed(2)}</p>
    `;

    productGrid.append(productCard);
  });
};

// Render filters dynamically
const renderFilters = () => {
  // hard code categories here

  const categories = [
    "men's clothing",
    "jewelery",
    "electronics",
    "women's clothing",
  ];
  filterContainer.innerHTML = ""; // Clear existing filters

  categories.forEach((category) => {
    const label = document.createElement("label");
    label.innerHTML = `
      <input type="checkbox" value="${category}" />
      ${category.charAt(0).toUpperCase() + category.slice(1)}
    `;
    filterContainer.appendChild(label);
  });

  filterContainer
    .querySelectorAll("input[type='checkbox']")
    .forEach((checkbox) => {
      checkbox.addEventListener("change", handleFilterChange);
    });
};

// apply filters and sorting
const applyFiltersAndSorting = () => {
  let filteredProducts = allProducts;

  if (selectedFilters.length > 0) {
    filteredProducts = filteredProducts.filter((product) => {
      return selectedFilters.includes(product.category.toLowerCase());
    });
  }

  const sortOrder = sortSelect.value;
  filteredProducts.sort((a, b) => {
    return sortOrder === "lh" ? a.price - b.price : b.price - a.price;
  });

  renderProducts(filteredProducts);
};

// handle filter changes
const handleFilterChange = () => {
  selectedFilters = [
    ...filterContainer.querySelectorAll("input[type='checkbox']:checked"),
  ].map((checkbox) => checkbox.value);
  applyFiltersAndSorting();
};

const toggleMobileNav = () => {
  hamburger.classList.toggle("open");
  const mobileNav = document.getElementById("mobile-nav");
  mobileNav.classList.toggle("open");
};

// event listener for sorting
sortSelect.addEventListener("change", applyFiltersAndSorting);

// event listener for hamburger click on mobile
hamburger.addEventListener("click", toggleMobileNav);

// fetch and display products on page load
renderFilters();
fetchProducts();
