
const productGrid = document.getElementById("productGrid");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");

const productCount = document.getElementById("productCount");

let products = [];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// 1. Fetch products from API

async function fetchProducts() {

    try {

        productGrid.innerHTML = "<p>Loading products...</p>";

        const response = await fetch(
            "https://fakestoreapi.com/products"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        products = await response.json();

        displayProducts(products);

    }

    catch (error) {

        productGrid.innerHTML = `
            <p class="no-products">
                Unable to load products. Please try again.
            </p>
        `;

        console.error(error);

    }

}

// 2. Display Products

function displayProducts(productList) {

    productCount.textContent =
        `Showing ${productList.length} products`;

    if (productList.length === 0) {
        productGrid.innerHTML = `
            <p class="no-products">No products found!</p>
        `;
        return;
    }

    productGrid.innerHTML = productList.map(product => {

        return `
            <div class="product-card">

                <a href="pages/product.html?id=${product.id}"
                   class="product-link">

                    <img src="${product.image}" alt="${product.title}">

                    <p class="category">${product.category}</p>

                    <h3>${product.title}</h3>

                    <p>₹${(product.price * 85).toLocaleString("en-IN", {
                        maximumFractionDigits: 0
                    })}</p>

                </a>

                <button onclick="addToCart(${product.id})">
                    Add to Cart
                </button>

            </div>
        `;

    }).join("");

}

// 3. Search, Filter and Sort

function filterProducts() {

    let filteredProducts = [...products];

    // Search

    const searchValue = searchInput.value.toLowerCase().trim();

    filteredProducts = filteredProducts.filter(product =>
        product.title.toLowerCase().includes(searchValue)
    );

    // Category Filter

    const selectedCategory = categoryFilter.value;

    if (selectedCategory !== "all") {

        filteredProducts = filteredProducts.filter(product =>
            product.category === selectedCategory
        );

    }

    // Sorting

    const sortValue = sortFilter.value;

    if (sortValue === "low") {

        filteredProducts.sort((a, b) => a.price - b.price);

    }

    else if (sortValue === "high") {

        filteredProducts.sort((a, b) => b.price - a.price);

    }

    else if (sortValue === "az") {

        filteredProducts.sort((a, b) =>
            a.title.localeCompare(b.title)
        );

    }

    displayProducts(filteredProducts);

}

// 4. Event Listeners

searchInput.addEventListener("input", filterProducts);

categoryFilter.addEventListener("change", filterProducts);

sortFilter.addEventListener("change", filterProducts);

// 5. Shopping Cart

function addToCart(id) {

    const existingProduct = cart.find(item => item.id === id);

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            id: id,
            quantity: 1
        });

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    showToast("Product added to cart!");

}

// 6. Update Cart Count

function updateCartCount() {

    const count = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    document.getElementById("cartCount").textContent = count;

}

// Start Application

fetchProducts(
    productGrid.innerHTML = Array(4)
    .fill('<div class="skeleton"></div>')
    .join("")
);

updateCartCount();
function showToast(message, type = "success") {

    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.textContent = message;

    toast.className = `toast show ${type}`;

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        toast.className = "toast";
    }, 2500);

}
const menuToggle = document.getElementById("menuToggle");

const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", () => {

        mainNav.classList.toggle("active");

    });

}
const clearSearch = document.getElementById("clearSearch");

if (clearSearch) {

    clearSearch.addEventListener("click", () => {

        searchInput.value = "";

        categoryFilter.value = "all";

        sortFilter.value = "default";

        filterProducts();

    });

}