const API_URL = "http://127.0.0.1:8000";

// ==========================================
// COMMON HELPERS
// ==========================================

function formatPrice(price) {
    return `₹${Number(price).toLocaleString("en-IN")}`;
}

function getCartCount() {
    return Number(localStorage.getItem("cartCount") || 0);
}

function updateCartCount(count) {
    localStorage.setItem("cartCount", count);

    const cartBadge = document.getElementById("cartCount");

    if (cartBadge) {
        cartBadge.textContent = count;
        cartBadge.style.display = count > 0 ? "inline-block" : "none";
    }
}


// ==========================================
// LOAD PRODUCTS
// ==========================================

async function loadProducts() {

    const productsContainer =
        document.getElementById("productsContainer");

    const loading =
        document.getElementById("loading");

    if (!productsContainer) {
        return;
    }

    // Show loading while fetching
    if (loading) {
        loading.style.display = "block";
    }

    try {

        const response =
            await fetch(`${API_URL}/api/products`);

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        const products = await response.json();

        console.log("Products loaded:", products);

        // Clear old content
        productsContainer.innerHTML = "";

        // No products
        if (!products || products.length === 0) {

            productsContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <h5>No products available</h5>
                    <p class="text-muted">
                        Please check again later.
                    </p>
                </div>
            `;

            return;
        }

        // Create product cards
        products.forEach(product => {

            const productCard = document.createElement("div");

            productCard.className =
                "col-12 col-md-6 col-lg-4 mb-4";

            productCard.innerHTML = `

                <div class="card h-100 border-0 shadow-sm product-card">

                    <a href="product.html?id=${product.id}"
                       class="text-decoration-none text-dark">

                        <img
                            src="${product.image}"
                            class="card-img-top product-image"
                            alt="${product.name}"
                            style="
                                height: 260px;
                                object-fit: cover;
                            "
                        >

                        <div class="card-body">

                            <small class="text-uppercase text-muted">
                                ${product.category}
                            </small>

                            <h5 class="card-title mt-2">
                                ${product.name}
                            </h5>

                            <p class="mb-2 text-muted">
                                ★ ${product.rating}
                            </p>

                            <h6 class="fw-bold">
                                ${formatPrice(product.price)}
                            </h6>

                        </div>

                    </a>

                    <div class="card-footer bg-white border-0 pb-3">

                        <button
                            class="btn btn-dark btn-sm w-100"
                            onclick="addToCart(${product.id}, event)"
                        >
                            Add to Cart
                        </button>

                    </div>

                </div>
            `;

            productsContainer.appendChild(productCard);
        });

    }

    catch (error) {

        console.error("Product loading error:", error);

        productsContainer.innerHTML = `

            <div class="col-12 text-center py-5">

                <h5 class="text-danger">
                    Unable to load products
                </h5>

                <p class="text-muted">
                    Please make sure the FastAPI server is running.
                </p>

                <button
                    class="btn btn-dark"
                    onclick="loadProducts()"
                >
                    Try Again
                </button>

            </div>
        `;

    }

    finally {

        // ==========================================
        // IMPORTANT:
        // ALWAYS HIDE LOADING AFTER REQUEST FINISHES
        // ==========================================

        if (loading) {
            loading.style.display = "none";
        }
    }
}


// ==========================================
// ADD TO CART
// ==========================================

async function addToCart(productId, event) {

    // Prevent opening product page
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    try {

        const response = await fetch(
            `${API_URL}/api/cart`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    product_id: Number(productId),
                    quantity: 1
                })
            }
        );

        if (!response.ok) {
            throw new Error("Failed to add product to cart");
        }

        const data = await response.json();

        console.log("Cart response:", data);

        // Update cart count
        const currentCount = getCartCount();

        updateCartCount(currentCount + 1);

        // Small success message
        showMessage(
            "Product added to cart!",
            "success"
        );

    }

    catch (error) {

        console.error("Add to cart error:", error);

        showMessage(
            "Unable to add product to cart.",
            "danger"
        );
    }
}


// ==========================================
// SHOW MESSAGE
// ==========================================

function showMessage(message, type = "success") {

    // Remove existing message
    const oldMessage =
        document.getElementById("appMessage");

    if (oldMessage) {
        oldMessage.remove();
    }

    const messageBox =
        document.createElement("div");

    messageBox.id = "appMessage";

    messageBox.className =
        `alert alert-${type} position-fixed shadow`;

    messageBox.style.cssText = `
        top: 80px;
        right: 25px;
        z-index: 9999;
        min-width: 250px;
    `;

    messageBox.innerHTML = `
        ${message}
        <button
            type="button"
            class="btn-close float-end"
            onclick="this.parentElement.remove()">
        </button>
    `;

    document.body.appendChild(messageBox);

    setTimeout(() => {

        if (messageBox) {
            messageBox.remove();
        }

    }, 2500);
}


// ==========================================
// LOAD CART COUNT
// ==========================================

function loadCartCount() {

    const count =
        getCartCount();

    const cartBadge =
        document.getElementById("cartCount");

    if (cartBadge) {

        cartBadge.textContent = count;

        cartBadge.style.display =
            count > 0 ? "inline-block" : "none";
    }
}


// ==========================================
// CATEGORY FILTER
// ==========================================

function filterByCategory(category) {

    window.location.href =
        `index.html?category=${encodeURIComponent(category)}`;
}


// ==========================================
// INITIALIZE APP
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("NOVA frontend loaded");

    loadCartCount();

    // Load products only if product container exists
    if (document.getElementById("productsContainer")) {
        loadProducts();
    }

});