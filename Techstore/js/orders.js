
const ordersList = document.getElementById("ordersList");

const orders = JSON.parse(
    localStorage.getItem("orders")
) || [];

const formatPrice = price =>
    "₹" + Number(price).toLocaleString("en-IN");

function displayOrders() {

    if (orders.length === 0) {

        ordersList.innerHTML = `
            <div class="empty-orders">
                <h2>No Orders Yet!</h2>
                <p>Your orders will appear here after checkout.</p>
            </div>
        `;

        return;
    }

    ordersList.innerHTML = [...orders].reverse().map(order => `

        <div class="order-card">

            <div class="order-header">

                <div>
                    <strong>${order.orderId}</strong>
                    <p>${order.date}</p>
                </div>

                <div>
                    <span class="order-status">
                        ${order.status}
                    </span>
                </div>

            </div>

            ${order.products.map(product => `

                <div class="order-product">

                    <img src="${product.image}"
                         alt="${product.title}">

                    <div>
                        <h3>${product.title}</h3>
                        <p>Quantity: ${product.quantity}</p>
                    </div>

                </div>

            `).join("")}

            <div class="order-total">
                Total: ${formatPrice(order.total)}
            </div>

        </div>

    `).join("");

}

displayOrders();
