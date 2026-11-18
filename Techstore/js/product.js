
const productDetails = document.getElementById("productDetails");

const params = new URLSearchParams(window.location.search);

const productId = Number(params.get("id"));

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

const formatPrice = price =>
    "₹" + Math.round(price * 85).toLocaleString("en-IN");

async function loadProduct() {

    try {

        if (!Number.isInteger(productId) || productId < 1) {
            throw new Error("Invalid product ID");
        }

        const response = await fetch(
            `https://fakestoreapi.com/products/${productId}`
        );

        if (!response.ok) {
            throw new Error("Product not found");
        }

        const product = await response.json();

        displayProduct(product);

    }

    catch (error) {

        productDetails.innerHTML = `
            <h2>Product not found!</h2>
            <p>Please return to the shop.</p>
            <a href="../index.html">Go to Home</a>
        `;

        console.error(error);

    }

}

function displayProduct(product) {

    productDetails.innerHTML = `

        <div class="product-detail">

            <div class="detail-image">
                <img src="${product.image}" alt="${product.title}">
            </div>

            <div class="detail-info">

                <p class="detail-category">
                    ${product.category}
                </p>

                <h1>${product.title}</h1>

                <p class="detail-rating">
                    ⭐ ${product.rating.rate}
                    (${product.rating.count} reviews)
                </p>

                <p class="detail-price">
                    ${formatPrice(product.price)}
                </p>

                <p class="detail-description">
                    ${product.description}
                </p>

                <div class="action-buttons">

                    <button
                        class="add-cart"
                        id="addCartBtn">
                        Add to Cart
                    </button>

                    <button
                        class="add-wishlist"
                        id="wishlistBtn">
                        ♡ Add to Wishlist
                    </button>

                </div>

                <p class="product-message" id="message"></p>

            </div>

        </div>

    `;

    document.getElementById("addCartBtn")
        .addEventListener("click", () => addToCart(product));

    document.getElementById("wishlistBtn")
        .addEventListener("click", () => addToWishlist(product));

}

function addToCart(product) {

    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id: product.id,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    document.getElementById("message").textContent =
        "Product added to cart successfully!";

}

function addToWishlist(product) {

    const exists = wishlist.some(
        item => item.id === product.id
    );

    if (exists) {

        document.getElementById("message").textContent =
            "This product is already in your wishlist!";

        return;

    }

    wishlist.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category
    });

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    document.getElementById("message").textContent =
        "Added to your wishlist successfully!";

}

loadProduct();
