
/* ==============================
   1. PRODUCT DATA
================================ */

const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 1299,
        category: "Electronics",
        image: "🎧"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 1999,
        category: "Electronics",
        image: "⌚"
    },
    {
        id: 3,
        name: "Running Shoes",
        price: 1499,
        category: "Fashion",
        image: "👟"
    },
    {
        id: 4,
        name: "Travel Backpack",
        price: 899,
        category: "Accessories",
        image: "🎒"
    },
    {
        id: 5,
        name: "Sunglasses",
        price: 499,
        category: "Fashion",
        image: "🕶️"
    },
    {
        id: 6,
        name: "Coffee Mug",
        price: 199,
        category: "Home",
        image: "☕"
    },
    {
        id: 7,
        name: "Desk Lamp",
        price: 649,
        category: "Home",
        image: "💡"
    },
    {
        id: 8,
        name: "Bluetooth Speaker",
        price: 1099,
        category: "Electronics",
        image: "🔊"
    }
];


/* ==============================
   2. CART DATA
================================ */

// Load saved cart from localStorage
let cart = {};

try {
    cart = JSON.parse(localStorage.getItem("cart")) || {};

    if (
        typeof cart !== "object" ||
        cart === null ||
        Array.isArray(cart)
    ) {
        cart = {};
    }
} catch (error) {
    cart = {};
}


/* ==============================
   3. SELECT HTML ELEMENTS
================================ */

const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");

const cartSection = document.getElementById("cartSection");
const cartButton = document.getElementById("cartButton");
const closeCart = document.getElementById("closeCart");
const overlay = document.getElementById("overlay");

const checkoutButton = document.getElementById("checkoutButton");
const checkoutModal = document.getElementById("checkoutModal");

const confirmButton = document.getElementById("confirmButton");
const cancelButton = document.getElementById("cancelButton");


/* ==============================
   4. FORMAT PRICE
================================ */

function formatPrice(price) {
    return price.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    });
}


/* ==============================
   5. DISPLAY PRODUCTS
================================ */

function renderProducts() {

    productGrid.innerHTML = products.map(product => {

        return `
            <div class="product-card">

                <div class="product-image">
                    ${product.image}
                </div>

                <p class="product-category">
                    ${product.category}
                </p>

                <h3>${product.name}</h3>

                <p class="product-price">
                    ${formatPrice(product.price)}
                </p>

                <button
                    class="add-button"
                    data-id="${product.id}">
                    Add to Cart +
                </button>

            </div>
        `;

    }).join("");
}


/* ==============================
   6. ADD TO CART
================================ */

function addToCart(id) {

    cart[id] = (cart[id] || 0) + 1;

    saveCart();
}


/* ==============================
   7. CHANGE QUANTITY
================================ */

function changeQuantity(id, delta) {

    if (!cart[id]) return;

    cart[id] += delta;

    if (cart[id] <= 0) {
        delete cart[id];
    }

    saveCart();
}


/* ==============================
   8. REMOVE PRODUCT
================================ */

function removeItem(id) {

    delete cart[id];

    saveCart();
}


/* ==============================
   9. CALCULATE TOTALS
================================ */

function calculateTotals() {

    const subtotal = Object.keys(cart).reduce((sum, id) => {

        const product = products.find(
            item => item.id === Number(id)
        );

        if (!product) return sum;

        return sum + product.price * cart[id];

    }, 0);

    const delivery = subtotal > 0 && subtotal < 500
        ? 40
        : 0;

    return {
        subtotal,
        delivery,
        total: subtotal + delivery
    };
}


/* ==============================
   10. SAVE CART
================================ */

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    renderCart();
}


/* ==============================
   11. DISPLAY CART
================================ */

function renderCart() {

    const ids = Object.keys(cart);

    // Calculate total number of items
    const itemCount = Object.values(cart).reduce(
        (sum, quantity) => sum + quantity,
        0
    );

    cartCount.textContent = itemCount;

    // Empty cart message
    if (ids.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <h2>🛒</h2>
                <p>Your cart is empty!</p>
                <p>Add some products to get started.</p>
            </div>
        `;

    } else {

        cartItems.innerHTML = ids.map(id => {

            const product = products.find(
                item => item.id === Number(id)
            );

            if (!product) return "";

            const quantity = cart[id];

            return `
                <div class="cart-item">

                    <div class="cart-item-emoji">
                        ${product.image}
                    </div>

                    <div class="cart-item-info">

                        <h4>${product.name}</h4>

                        <p>${formatPrice(product.price * quantity)}</p>

                        <div class="quantity-controls">

                            <button
                                data-action="decrease"
                                data-id="${id}">
                                -
                            </button>

                            <span>${quantity}</span>

                            <button
                                data-action="increase"
                                data-id="${id}">
                                +
                            </button>

                        </div>

                    </div>

                    <button
                        class="remove-button"
                        data-action="remove"
                        data-id="${id}">
                        Remove
                    </button>

                </div>
            `;

        }).join("");
    }

    // Update price details
    const totals = calculateTotals();

    document.getElementById("subtotal").textContent =
        formatPrice(totals.subtotal);

    document.getElementById("delivery").textContent =
        formatPrice(totals.delivery);

    document.getElementById("total").textContent =
        formatPrice(totals.total);

    checkoutButton.disabled = ids.length === 0;
}


/* ==============================
   12. OPEN AND CLOSE CART
================================ */

function openCart() {

    cartSection.classList.add("active");
    overlay.classList.add("active");
}

function hideCart() {

    cartSection.classList.remove("active");
    overlay.classList.remove("active");
}

cartButton.addEventListener("click", openCart);

closeCart.addEventListener("click", hideCart);

overlay.addEventListener("click", hideCart);


/* ==============================
   13. PRODUCT BUTTON EVENTS
================================ */

productGrid.addEventListener("click", function(event) {

    const button = event.target.closest(".add-button");

    if (!button) return;

    const id = Number(button.dataset.id);

    addToCart(id);

    // Small visual feedback
    button.textContent = "Added ✓";

    setTimeout(() => {
        button.textContent = "Add to Cart +";
    }, 800);

});


/* ==============================
   14. CART BUTTON EVENTS
================================ */

cartItems.addEventListener("click", function(event) {

    const button = event.target.closest("button");

    if (!button) return;

    const id = Number(button.dataset.id);

    const action = button.dataset.action;

    if (action === "increase") {
        changeQuantity(id, 1);
    }

    else if (action === "decrease") {
        changeQuantity(id, -1);
    }

    else if (action === "remove") {
        removeItem(id);
    }

});


/* ==============================
   15. CHECKOUT PREVIEW
================================ */

checkoutButton.addEventListener("click", function() {

    if (Object.keys(cart).length === 0) return;

    const totals = calculateTotals();

    const checkoutItems = document.getElementById(
        "checkoutItems"
    );

    checkoutItems.innerHTML = Object.keys(cart).map(id => {

        const product = products.find(
            item => item.id === Number(id)
        );

        if (!product) return "";

        return `
            <div class="checkout-product">
                <span>
                    ${product.name} × ${cart[id]}
                </span>

                <strong>
                    ${formatPrice(product.price * cart[id])}
                </strong>
            </div>
        `;

    }).join("");

    document.getElementById("checkoutSubtotal").textContent =
        formatPrice(totals.subtotal);

    document.getElementById("checkoutDelivery").textContent =
        formatPrice(totals.delivery);

    document.getElementById("checkoutTotal").textContent =
        formatPrice(totals.total);

    hideCart();

    checkoutModal.showModal();

});


/* ==============================
   16. CONFIRM DEMO ORDER
================================ */

confirmButton.addEventListener("click", function() {

    alert(
        "Your demo order has been placed successfully! 🎉"
    );

    // Clear the cart
    cart = {};

    saveCart();

    checkoutModal.close();

});


/* ==============================
   17. CANCEL CHECKOUT
================================ */

cancelButton.addEventListener("click", function() {

    checkoutModal.close();

});


/* ==============================
   18. INITIALIZE WEBSITE
================================ */

renderProducts();

renderCart();
