// ==========================================
// NOVA - CHECKOUT
// ==========================================

const API_URL = "http://127.0.0.1:8000";

console.log("CHECKOUT JS LOADED");


// ==========================================
// FORMAT PRICE
// ==========================================

function formatPrice(price) {
    return `₹${Number(price || 0).toLocaleString("en-IN")}`;
}


// ==========================================
// GET CART FROM FASTAPI
// ==========================================

async function getCart() {

    console.log("Fetching cart from FastAPI...");

    const response = await fetch(`${API_URL}/api/cart`);

    if (!response.ok) {
        throw new Error(`Cart API failed: ${response.status}`);
    }

    const data = await response.json();

    console.log("Raw cart response:", data);

    // Handle different API response formats
    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data.items)) {
        return data.items;
    }

    if (Array.isArray(data.cart)) {
        return data.cart;
    }

    return [];
}


// ==========================================
// GET PRODUCT NAME
// ==========================================

function getProductName(item) {

    return (
        item.product?.name ||
        item.name ||
        item.product_name ||
        "Product"
    );
}


// ==========================================
// GET PRODUCT PRICE
// ==========================================

function getProductPrice(item) {

    return Number(
        item.product?.price ??
        item.price ??
        item.product_price ??
        0
    );
}


// ==========================================
// GET QUANTITY
// ==========================================

function getQuantity(item) {

    return Number(
        item.quantity ??
        item.qty ??
        1
    );
}


// ==========================================
// GET PRODUCT IMAGE
// ==========================================

function getProductImage(item) {

    return (
        item.product?.image ||
        item.image ||
        ""
    );
}


// ==========================================
// CALCULATE SUBTOTAL
// ==========================================

function calculateSubtotal(cart) {

    return cart.reduce(
        (total, item) => {

            const price = getProductPrice(item);
            const quantity = getQuantity(item);

            return total + (price * quantity);

        },
        0
    );
}


// ==========================================
// RENDER CHECKOUT ITEMS
// ==========================================

function renderCheckoutItems(cart) {

    const container =
        document.getElementById("checkoutItems");

    if (!container) {
        console.error("checkoutItems element not found.");
        return;
    }


    // EMPTY CART
    if (!cart || cart.length === 0) {

        container.innerHTML = `

            <div class="text-center py-4">

                <h5>Your cart is empty</h5>

                <p class="text-muted">
                    Add some products before checkout.
                </p>

                <a
                    href="index.html"
                    class="btn btn-dark"
                >
                    Continue Shopping
                </a>

            </div>

        `;

        return;
    }


    // PRODUCTS

    container.innerHTML = cart.map(item => {

        const name = getProductName(item);
        const price = getProductPrice(item);
        const quantity = getQuantity(item);
        const image = getProductImage(item);

        return `

            <div
                class="d-flex
                       justify-content-between
                       align-items-center
                       mb-3"
            >

                <div
                    class="d-flex
                           align-items-center
                           gap-3"
                >

                    ${
                        image
                            ? `
                                <img
                                    src="${image}"
                                    alt="${name}"
                                    style="
                                        width:60px;
                                        height:60px;
                                        object-fit:cover;
                                        border-radius:8px;
                                    "
                                >
                              `
                            : ""
                    }

                    <div>

                        <div class="fw-semibold">
                            ${name}
                        </div>

                        <small class="text-muted">
                            Qty: ${quantity}
                        </small>

                    </div>

                </div>

                <div class="fw-semibold">

                    ${formatPrice(price * quantity)}

                </div>

            </div>

        `;

    }).join("");
}


// ==========================================
// UPDATE ORDER SUMMARY
// ==========================================

function updateSummary(cart) {

    const subtotal =
        calculateSubtotal(cart);

    const shipping = 0;

    // 5% demo tax
    const tax =
        Math.round(subtotal * 0.05);

    const total =
        subtotal + shipping + tax;


    const subtotalElement =
        document.getElementById("checkoutSubtotal");

    const shippingElement =
        document.getElementById("checkoutShipping");

    const taxElement =
        document.getElementById("checkoutTax");

    const totalElement =
        document.getElementById("checkoutTotal");


    if (subtotalElement) {
        subtotalElement.textContent =
            formatPrice(subtotal);
    }


    if (shippingElement) {
        shippingElement.textContent =
            "FREE";
    }


    if (taxElement) {
        taxElement.textContent =
            formatPrice(tax);
    }


    if (totalElement) {
        totalElement.textContent =
            formatPrice(total);
    }


    console.log("Subtotal:", subtotal);
    console.log("Tax:", tax);
    console.log("Total:", total);
}


// ==========================================
// VALIDATE SHIPPING FORM
// ==========================================

function validateShippingForm() {

    const form =
        document.getElementById("shippingForm");

    if (!form) {
        console.error("Shipping form not found.");
        return false;
    }


    // ------------------------------------------
    // GET VALUES
    // ------------------------------------------

    const firstName =
        document.getElementById("firstName");

    const lastName =
        document.getElementById("lastName");

    const email =
        document.getElementById("email");

    const phone =
        document.getElementById("phone");

    const address =
        document.getElementById("address");

    const city =
        document.getElementById("city");

    const pinCode =
        document.getElementById("pinCode");


    // ------------------------------------------
    // TRIM TEXT INPUTS
    // ------------------------------------------

    if (firstName) {
        firstName.value = firstName.value.trim();
    }

    if (lastName) {
        lastName.value = lastName.value.trim();
    }

    if (email) {
        email.value = email.value.trim();
    }

    if (phone) {
        phone.value = phone.value.trim();
    }

    if (address) {
        address.value = address.value.trim();
    }

    if (city) {
        city.value = city.value.trim();
    }

    if (pinCode) {
        pinCode.value = pinCode.value
            .replace(/\D/g, "")
            .slice(0, 6);
    }


    // ------------------------------------------
    // PIN VALIDATION
    // ------------------------------------------

    if (
        pinCode &&
        !/^\d{6}$/.test(pinCode.value)
    ) {

        pinCode.setCustomValidity(
            "Please enter a valid 6-digit PIN code."
        );

        form.reportValidity();

        pinCode.focus();

        return false;

    } else if (pinCode) {

        pinCode.setCustomValidity("");

    }


    // ------------------------------------------
    // HTML5 VALIDATION
    // ------------------------------------------

    if (!form.checkValidity()) {

        form.reportValidity();

        return false;
    }


    return true;
}


// ==========================================
// GET SHIPPING INFORMATION
// ==========================================

function getShippingInformation() {

    return {

        firstName:
            document.getElementById("firstName")?.value.trim() || "",

        lastName:
            document.getElementById("lastName")?.value.trim() || "",

        email:
            document.getElementById("email")?.value.trim() || "",

        phone:
            document.getElementById("phone")?.value.trim() || "",

        address:
            document.getElementById("address")?.value.trim() || "",

        city:
            document.getElementById("city")?.value.trim() || "",

        pinCode:
            document.getElementById("pinCode")?.value.trim() || ""

    };
}


// ==========================================
// LOAD CHECKOUT
// ==========================================

async function loadCheckout() {

    const container =
        document.getElementById("checkoutItems");


    // Show loading
    if (container) {

        container.innerHTML = `

            <div class="text-center py-4">

                <div
                    class="spinner-border spinner-border-sm"
                    role="status"
                ></div>

                <div class="text-muted mt-2">
                    Loading your order...
                </div>

            </div>

        `;
    }


    try {

        // ------------------------------------------
        // GET CART
        // ------------------------------------------

        const cart =
            await getCart();

        console.log("Checkout cart:", cart);


        // ------------------------------------------
        // RENDER CART
        // ------------------------------------------

        renderCheckoutItems(cart);


        // ------------------------------------------
        // UPDATE TOTALS
        // ------------------------------------------

        updateSummary(cart);


        // ------------------------------------------
        // PAY BUTTON
        // ------------------------------------------

        const payButton =
            document.getElementById("payNowBtn");


        if (payButton) {

            if (cart.length === 0) {

                payButton.disabled = true;

                payButton.textContent =
                    "Cart is Empty";

            } else {

                payButton.disabled = false;

                payButton.textContent =
                    "Pay Now";

            }

        }

    }

    catch (error) {

        console.error(
            "Checkout loading error:",
            error
        );


        if (container) {

            container.innerHTML = `

                <div class="text-center py-4">

                    <h5 class="text-danger">
                        Unable to load your cart
                    </h5>

                    <p class="text-muted">
                        Please make sure the FastAPI server is running.
                    </p>

                    <button
                        type="button"
                        class="btn btn-dark"
                        onclick="loadCheckout()"
                    >
                        Try Again
                    </button>

                </div>

            `;

        }

    }

}


// ==========================================
// PAY NOW
// ==========================================

async function handlePayment() {

    const payButton =
        document.getElementById("payNowBtn");


    try {

        console.log("Pay Now clicked.");


        // ------------------------------------------
        // VALIDATE SHIPPING FORM
        // ------------------------------------------

        if (!validateShippingForm()) {

            console.log(
                "Shipping form validation failed."
            );

            return;
        }


        // ------------------------------------------
        // GET CART
        // ------------------------------------------

        const cart =
            await getCart();


        if (!cart || cart.length === 0) {

            alert(
                "Your cart is empty."
            );

            return;
        }


        // ------------------------------------------
        // PAYMENT METHOD
        // ------------------------------------------

        const selectedPayment =
            document.querySelector(
                'input[name="payment_method"]:checked'
            );


        const paymentMethod =
            selectedPayment
                ? selectedPayment.value
                : "Credit / Debit Card";


        console.log(
            "Selected payment:",
            paymentMethod
        );


        // ------------------------------------------
        // SHIPPING INFORMATION
        // ------------------------------------------

        const shippingInfo =
            getShippingInformation();


        console.log(
            "Shipping information:",
            shippingInfo
        );


        // ------------------------------------------
        // CALCULATE TOTAL
        // ------------------------------------------

        const subtotal =
            calculateSubtotal(cart);

        const shipping = 0;

        const tax =
            Math.round(subtotal * 0.05);

        const total =
            subtotal +
            shipping +
            tax;


        // ------------------------------------------
        // PREVENT DOUBLE CLICK
        // ------------------------------------------

        if (payButton) {

            payButton.disabled = true;

            payButton.innerHTML = `
                <span
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                ></span>
                Processing...
            `;
        }


        // ------------------------------------------
        // CREATE DEMO ORDER
        // ------------------------------------------

        const order = {

            orderId:
                "NOVA-" +
                Date.now()
                    .toString()
                    .slice(-8),

            date:
                new Date()
                    .toLocaleDateString("en-IN"),

            time:
                new Date()
                    .toLocaleTimeString("en-IN"),

            items:
                cart,

            subtotal:
                subtotal,

            shipping:
                shipping,

            tax:
                tax,

            total:
                total,

            paymentMethod:
                paymentMethod,

            customer:
                shippingInfo

        };


        console.log(
            "Order created:",
            order
        );


        // ------------------------------------------
        // SAVE ORDER
        // ------------------------------------------

        localStorage.setItem(
            "novaLastOrder",
            JSON.stringify(order)
        );


        // ------------------------------------------
        // CLEAR CART COUNT
        // ------------------------------------------

        localStorage.setItem(
            "cartCount",
            "0"
        );


        // ------------------------------------------
        // SMALL DELAY FOR REALISTIC UX
        // ------------------------------------------

        await new Promise(
            resolve => setTimeout(resolve, 500)
        );


        // ------------------------------------------
        // GO TO RECEIPT
        // ------------------------------------------

        window.location.href =
            "receipt.html";

    }

    catch (error) {

        console.error(
            "Payment error:",
            error
        );


        alert(
            "Something went wrong while creating your order. Please try again."
        );


        // ------------------------------------------
        // RESTORE BUTTON
        // ------------------------------------------

        if (payButton) {

            payButton.disabled = false;

            payButton.innerHTML =
                "Pay Now";

        }

    }

}


// ==========================================
// PAYMENT OPTION UI
// ==========================================

function setupPaymentOptions() {

    const paymentOptions =
        document.querySelectorAll(
            ".payment-option"
        );


    paymentOptions.forEach(option => {

        const radio =
            option.querySelector(
                'input[type="radio"]'
            );


        if (!radio) {
            return;
        }


        option.addEventListener(
            "click",
            function () {

                radio.checked = true;

                paymentOptions.forEach(
                    item => {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                option.classList.add(
                    "selected"
                );

            }
        );

    });

}


// ==========================================
// PIN CODE INPUT
// ==========================================

function setupPinCode() {

    const pinCode =
        document.getElementById("pinCode");


    if (!pinCode) {
        return;
    }


    pinCode.addEventListener(
        "input",
        function () {

            // Allow digits only
            this.value =
                this.value
                    .replace(/\D/g, "")
                    .slice(0, 6);

            // Clear custom validation after
            // user enters a valid PIN
            if (/^\d{6}$/.test(this.value)) {

                this.setCustomValidity("");

            }

        }
    );

}


// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Loading checkout..."
        );


        loadCheckout();

        setupPaymentOptions();

        setupPinCode();


        // ------------------------------------------
        // PAY BUTTON
        // ------------------------------------------

        const payButton =
            document.getElementById(
                "payNowBtn"
            );


        if (payButton) {

            payButton.addEventListener(
                "click",
                handlePayment
            );

        }

    }
);