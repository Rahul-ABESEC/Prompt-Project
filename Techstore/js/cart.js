
const cartItems = document.getElementById("cartItems");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let products = [];

const formatPrice = price => {
    return "₹" + Math.round(price * 85).toLocaleString("en-IN");
};

// Fetch products from API

async function loadCart() {

    try {

        cartItems.innerHTML = "<p>Loading cart...</p>";

        const response = await fetch(
            "https://fakestoreapi.com/products"
        );

        if (!response.ok) {
            throw new Error("Unable to fetch products");
        }

        products = await response.json();

        renderCart();

    }

    catch (error) {

        cartItems.innerHTML = `
            <p>Unable to load cart. Please refresh the page.</p>
        `;

        console.error(error);

    }

}


// Display cart products

function renderCart() {

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">

                <h2>Your Cart is Empty 🛒</h2>

                <p>
                    Looks like you haven't added anything yet.
                </p>

                <a href="../index.html">
                    Start Shopping
                </a>

            </div>
        `;

        updateSummary();
        return;

    }

    cartItems.innerHTML = cart.map(item => {

        const product = products.find(
            p => p.id === item.id
        );

        if (!product) return "";

        return `

            <div class="cart-item">

                <div class="product-info">

                    <img src="${product.image}"
                         alt="${product.title}">

                    <div>

                        <h3>${product.title}</h3>

                        <p>${formatPrice(product.price)}</p>

                        <button
                            class="remove-btn"
                            data-action="remove"
                            data-id="${product.id}">
                            Remove
                        </button>

                    </div>

                </div>


                <div class="quantity-control">

                    <button
                        data-action="decrease"
                        data-id="${product.id}">
                        −
                    </button>

                    <span>${item.quantity}</span>

                    <button
                        data-action="increase"
                        data-id="${product.id}">
                        +
                    </button>

                </div>


                <div class="item-subtotal">

                    ${formatPrice(
                        product.price * item.quantity
                    )}

                </div>

            </div>

        `;

    }).join("");

    updateSummary();

}


// Update quantity and remove products

cartItems.addEventListener("click", function(event) {

    const button = event.target.closest("button");

    if (!button) return;

    const id = Number(button.dataset.id);

    const action = button.dataset.action;

    const item = cart.find(product => product.id === id);

    if (!item) return;

    if (action === "increase") {

        item.quantity++;

    }

    else if (action === "decrease") {

        item.quantity--;

        if (item.quantity <= 0) {

            cart = cart.filter(product => product.id !== id);

        }

    }

    else if (action === "remove") {

        cart = cart.filter(product => product.id !== id);

    }

    saveCart();

    renderCart();

});


// Save cart in Local Storage

function saveCart() {

    localStorage.setItem("cart", JSON.stringify(cart));

}


// Calculate subtotal, shipping and total

function updateSummary() {

    let subtotal = 0;

    cart.forEach(item => {

        const product = products.find(
            p => p.id === item.id
        );

        if (product) {

            subtotal += product.price * item.quantity;

        }

    });

    const subtotalINR = subtotal * 85;

    const shipping = subtotal === 0
        ? 0
        : subtotalINR >= 5000 ? 0 : 99;

    const total = subtotalINR + shipping;

    document.getElementById("subtotal").textContent =
        formatPrice(subtotal);

    document.getElementById("shipping").textContent =
        "₹" + shipping.toLocaleString("en-IN");

    document.getElementById("total").textContent =
        "₹" + Math.round(total).toLocaleString("en-IN");

    const totalItems = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    document.getElementById("itemCount").textContent =
        `${totalItems} Items`;

}


// Checkout button

document.getElementById("checkoutBtn").addEventListener(
    "click",
    function() {

        if (cart.length === 0) {

            alert("Your cart is empty!");

            return;

        }

        window.location.href = "checkout.html";

    }
);


// Initialize

loadCart();
