
const wishlistItems = document.getElementById("wishlistItems");

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const formatPrice = price =>
    "₹" + Math.round(price * 85).toLocaleString("en-IN");

function displayWishlist() {

    if (wishlist.length === 0) {

        wishlistItems.innerHTML = `
            <div class="empty-wishlist">

                <h2>Your Wishlist is Empty ♡</h2>

                <p>Save your favourite products here.</p>

                <a href="../index.html">Explore Products</a>

            </div>
        `;

        return;
    }

    wishlistItems.innerHTML = wishlist.map(product => `

        <div class="wishlist-card">

            <img src="${product.image}" alt="${product.title}">

            <h3>${product.title}</h3>

            <p>${formatPrice(product.price)}</p>

            <button
                class="move-cart"
                data-action="cart"
                data-id="${product.id}">
                Add to Cart
            </button>

            <button
                class="remove-wishlist"
                data-action="remove"
                data-id="${product.id}">
                Remove ♡
            </button>

        </div>

    `).join("");

}


// Handle wishlist buttons

wishlistItems.addEventListener("click", function(event) {

    const button = event.target.closest("button");

    if (!button) return;

    const id = Number(button.dataset.id);

    const action = button.dataset.action;

    const product = wishlist.find(item => item.id === id);

    if (!product) return;

    if (action === "cart") {

        const existing = cart.find(item => item.id === id);

        if (existing) {
            existing.quantity++;
        } else {
            cart.push({
                id: id,
                quantity: 1
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        wishlist = wishlist.filter(item => item.id !== id);

        localStorage.setItem("wishlist", JSON.stringify(wishlist));

        displayWishlist();

    }

    else if (action === "remove") {

        wishlist = wishlist.filter(item => item.id !== id);

        localStorage.setItem("wishlist", JSON.stringify(wishlist));

        displayWishlist();

    }

});


displayWishlist();
