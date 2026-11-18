
const checkoutItems = document.getElementById("checkoutItems");

const checkoutForm = document.getElementById("checkoutForm");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let products = [];

let finalTotal = 0;

const formatPrice = price => {
    return "₹" + Math.round(price * 85).toLocaleString("en-IN");
};


// Load cart products

async function loadCheckout() {

    try {

        if (cart.length === 0) {
            window.location.href = "cart.html";
            return;
        }

        const response = await fetch(
            "https://fakestoreapi.com/products"
        );

        if (!response.ok) {
            throw new Error("Unable to load products");
        }

        products = await response.json();

        displayCheckout();

    }

    catch (error) {

        checkoutItems.innerHTML =
            "<p>Unable to load order summary. Please refresh.</p>";

        console.error(error);

    }

}


// Display order summary

function displayCheckout() {

    let subtotal = 0;

    checkoutItems.innerHTML = cart.map(item => {

        const product = products.find(
            p => p.id === item.id
        );

        if (!product || item.quantity < 1) return "";

        subtotal += product.price * item.quantity;

        return `

            <div class="checkout-product">

                <img src="${product.image}"
                     alt="${product.title}">

                <div>

                    <h3>${product.title}</h3>

                    <p>
                        Qty: ${item.quantity}
                    </p>

                </div>

            </div>

        `;

    }).join("");

    const subtotalINR = subtotal * 85;

    const shipping = subtotal === 0
        ? 0
        : subtotalINR >= 5000 ? 0 : 99;

    finalTotal = Math.round(subtotalINR + shipping);

    document.getElementById("subtotal").textContent =
        formatPrice(subtotal);

    document.getElementById("shipping").textContent =
        "₹" + shipping.toLocaleString("en-IN");

    document.getElementById("total").textContent =
        "₹" + finalTotal.toLocaleString("en-IN");

}


// Place order

checkoutForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const message = document.getElementById("formMessage");

    if (cart.length === 0) {

        message.textContent = "Your cart is empty!";

        return;

    }

    if (!products.length || !finalTotal) {

        message.textContent =
            "Order details are still loading. Please wait.";

        return;

    }

    if (!checkoutForm.checkValidity()) {

        checkoutForm.reportValidity();

        return;

    }


    // Customer details

    const customer = {

        name: document.getElementById("name").value.trim(),

        email: document.getElementById("email").value.trim(),

        phone: document.getElementById("phone").value.trim(),

        address: document.getElementById("address").value.trim(),

        city: document.getElementById("city").value.trim(),

        pincode: document.getElementById("pincode").value.trim()

    };


    // Payment method

    const payment = document.querySelector(
        'input[name="payment"]:checked'
    ).value;


    // Prepare order products

    const orderProducts = cart.map(item => {

        const product = products.find(
            p => p.id === item.id
        );

        return {

            id: product.id,

            title: product.title,

            price: product.price,

            image: product.image,

            quantity: item.quantity

        };

    });


    // Create order

    const order = {

        orderId: "TS" + Date.now(),

        customer: customer,

        products: orderProducts,

        paymentMethod: payment,

        total: finalTotal,

        status: "Order Placed",

        date: new Date().toLocaleString("en-IN")

    };


    // Save order history

    let orders = JSON.parse(
        localStorage.getItem("orders")
    ) || [];

    orders.push(order);

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );


    // Save latest order for confirmation page

    localStorage.setItem(
        "latestOrder",
        JSON.stringify(order)
    );


    // Clear cart

    localStorage.removeItem("cart");


    // Redirect

    window.location.href = "confirmation.html";

});


// Initialize

loadCheckout();
