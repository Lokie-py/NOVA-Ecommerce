// ==========================================
// NOVA - RECEIPT
// ==========================================

console.log("RECEIPT JS LOADED");


// ==========================================
// FORMAT PRICE
// ==========================================

function formatPrice(price) {

    return `₹${Number(price || 0).toLocaleString("en-IN")}`;

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==========================================
// LOAD RECEIPT
// ==========================================

function loadReceipt() {

    console.log("Loading receipt...");


    // ------------------------------------------
    // GET SAVED ORDER
    // ------------------------------------------

    const savedOrder =
        localStorage.getItem("novaLastOrder");


    console.log(
        "Saved order:",
        savedOrder
    );


    // ------------------------------------------
    // NO ORDER FOUND
    // ------------------------------------------

    if (!savedOrder) {

        showError();

        return;
    }


    let order;


    // ------------------------------------------
    // PARSE ORDER
    // ------------------------------------------

    try {

        order =
            JSON.parse(savedOrder);

    }

    catch (error) {

        console.error(
            "Invalid order data:",
            error
        );

        showError();

        return;
    }


    console.log(
        "Order loaded:",
        order
    );


    // ------------------------------------------
    // BASIC ORDER DETAILS
    // ------------------------------------------

    const orderId =
        document.getElementById(
            "receiptOrderId"
        );


    const orderDate =
        document.getElementById(
            "receiptDate"
        );


    const orderTime =
        document.getElementById(
            "receiptTime"
        );


    const paymentMethod =
        document.getElementById(
            "receiptPayment"
        );


    if (orderId) {

        orderId.textContent =
            order.orderId ||
            "NOVA-ORDER";

    }


    if (orderDate) {

        orderDate.textContent =
            order.date ||
            new Date()
                .toLocaleDateString("en-IN");

    }


    if (orderTime) {

        orderTime.textContent =
            order.time ||
            "—";

    }


    if (paymentMethod) {

        paymentMethod.textContent =
            order.paymentMethod ||
            "Credit / Debit Card";

    }


    // ------------------------------------------
    // CUSTOMER INFORMATION
    // ------------------------------------------

    const customer =
        order.customer || {};


    const customerName =
        document.getElementById(
            "receiptCustomerName"
        );


    const customerEmail =
        document.getElementById(
            "receiptCustomerEmail"
        );


    const customerPhone =
        document.getElementById(
            "receiptCustomerPhone"
        );


    const customerAddress =
        document.getElementById(
            "receiptCustomerAddress"
        );


    if (customerName) {

        const fullName =
            `${customer.firstName || ""} ${customer.lastName || ""}`
                .trim();


        customerName.textContent =
            fullName || "Customer";

    }


    if (customerEmail) {

        customerEmail.textContent =
            customer.email ||
            "—";

    }


    if (customerPhone) {

        customerPhone.textContent =
            customer.phone ||
            "—";

    }


    if (customerAddress) {

        const addressParts = [
            customer.address,
            customer.city,
            customer.pinCode
        ].filter(Boolean);


        customerAddress.textContent =
            addressParts.length
                ? addressParts.join(", ")
                : "—";

    }


    // ------------------------------------------
    // ORDER ITEMS
    // ------------------------------------------

    const itemsContainer =
        document.getElementById(
            "receiptItems"
        );


    const items =
        Array.isArray(order.items)
            ? order.items
            : [];


    if (itemsContainer) {

        if (items.length === 0) {

            itemsContainer.innerHTML = `

                <div class="text-muted">
                    No items found.
                </div>

            `;

        }

        else {

            itemsContainer.innerHTML =
                items.map(item => {

                    const product =
                        item.product || item;


                    const name =
                        product.name ||
                        item.name ||
                        "Product";


                    const price =
                        Number(
                            product.price ??
                            item.price ??
                            0
                        );


                    const quantity =
                        Number(
                            item.quantity ??
                            item.qty ??
                            1
                        );


                    const image =
                        product.image ||
                        item.image ||
                        "";


                    return `

                        <div
                            class="
                                receipt-item
                                d-flex
                                justify-content-between
                                align-items-center
                                border-bottom
                            "
                        >

                            <div
                                class="
                                    d-flex
                                    align-items-center
                                    gap-3
                                "
                            >

                                ${
                                    image
                                        ? `
                                            <img
                                                src="${escapeHtml(image)}"
                                                alt="${escapeHtml(name)}"
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
                                        ${escapeHtml(name)}
                                    </div>


                                    <small class="text-muted">
                                        Qty: ${quantity}
                                    </small>

                                </div>

                            </div>


                            <div class="fw-semibold">

                                ${formatPrice(
                                    price * quantity
                                )}

                            </div>

                        </div>

                    `;

                }).join("");

        }

    }


    // ------------------------------------------
    // TOTALS
    // ------------------------------------------

    const subtotal =
        document.getElementById(
            "receiptSubtotal"
        );


    const shipping =
        document.getElementById(
            "receiptShipping"
        );


    const tax =
        document.getElementById(
            "receiptTax"
        );


    const total =
        document.getElementById(
            "receiptTotal"
        );


    if (subtotal) {

        subtotal.textContent =
            formatPrice(order.subtotal);

    }


    if (shipping) {

        shipping.textContent =
            Number(order.shipping || 0) === 0
                ? "FREE"
                : formatPrice(order.shipping);

    }


    if (tax) {

        tax.textContent =
            formatPrice(order.tax);

    }


    if (total) {

        total.textContent =
            formatPrice(order.total);

    }


    // ------------------------------------------
    // SHOW RECEIPT
    // ------------------------------------------

    const loading =
        document.getElementById(
            "receiptLoading"
        );


    const receiptContent =
        document.getElementById(
            "receiptContent"
        );


    const receiptError =
        document.getElementById(
            "receiptError"
        );


    if (loading) {

        loading.style.display =
            "none";

    }


    if (receiptContent) {

        receiptContent.style.display =
            "block";

    }


    if (receiptError) {

        receiptError.style.display =
            "none";

    }


    console.log(
        "Receipt displayed successfully."
    );

}


// ==========================================
// SHOW ERROR
// ==========================================

function showError() {

    console.error(
        "No valid order found."
    );


    const loading =
        document.getElementById(
            "receiptLoading"
        );


    const receiptContent =
        document.getElementById(
            "receiptContent"
        );


    const receiptError =
        document.getElementById(
            "receiptError"
        );


    if (loading) {

        loading.style.display =
            "none";

    }


    if (receiptContent) {

        receiptContent.style.display =
            "none";

    }


    if (receiptError) {

        receiptError.style.display =
            "block";

    }

}


// ==========================================
// PRINT RECEIPT
// ==========================================

function printReceipt() {

    window.print();

}


// ==========================================
// CONTINUE SHOPPING
// ==========================================

function continueShopping() {

    window.location.href =
        "index.html";

}


// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadReceipt();

    }
);