```javascript
/* ========================================================= 
   NEON — FUTURE STORE 
   JavaScript 
   Designed & Developed by Asim 
   ========================================================= */ 

"use strict"; 

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const particleCanvas = document.getElementById("particleCanvas");
    const searchButton = document.getElementById("searchButton");
    const searchPanel = document.getElementById("searchPanel");
    const closeSearch = document.getElementById("closeSearch");
    const searchInput = document.getElementById("searchInput");

    const cartButton = document.getElementById("cartButton");
    const cartDrawer = document.getElementById("cartDrawer");
    const cartOverlay = document.getElementById("cartOverlay");
    const closeCart = document.getElementById("closeCart");

    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const cartCount = document.querySelector(".cart-count");
    const checkoutButton = document.getElementById("checkoutButton");

    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    const productsGrid = document.getElementById("productsGrid");
    const emptyProducts = document.getElementById("emptyProducts");
    const showAllProducts = document.getElementById("showAllProducts");

    const categoryButtons = document.querySelectorAll(".category-card");


    /* =====================================================
       CART DATA
    ===================================================== */

    let cart = [];

    try {
        const savedCart = localStorage.getItem("neonCart");

        if (savedCart) {
            cart = JSON.parse(savedCart);

            if (!Array.isArray(cart)) {
                cart = [];
            }
        }
    } catch (error) {
        cart = [];
    }


    /* =====================================================
       SAVE CART
    ===================================================== */

    function saveCart() {
        try {
            localStorage.setItem("neonCart", JSON.stringify(cart));
        } catch (error) {
            console.warn("Cart could not be saved.");
        }
    }


    /* =====================================================
       OPEN CART
    ===================================================== */

    function openCart() {
        if (!cartDrawer || !cartOverlay) {
            return;
        }

        cartDrawer.classList.add("open");
        cartOverlay.classList.add("open");

        document.body.style.overflow = "hidden";

        renderCart();
    }


    /* =====================================================
       CLOSE CART
    ===================================================== */

    function closeCartDrawer() {
        if (!cartDrawer || !cartOverlay) {
            return;
        }

        cartDrawer.classList.remove("open");
        cartOverlay.classList.remove("open");

        document.body.style.overflow = "";
    }


    /* =====================================================
       CART BUTTON
    ===================================================== */

    if (cartButton) {
        cartButton.addEventListener("click", openCart);
    }

    if (closeCart) {
        closeCart.addEventListener("click", closeCartDrawer);
    }

    if (cartOverlay) {
        cartOverlay.addEventListener("click", closeCartDrawer);
    }


    /* =====================================================
       ADD PRODUCT
    ===================================================== */

    function addToCart(productName) {
        if (!productName) {
            return;
        }

        const existingProduct = cart.find(
            item => item.name === productName
        );

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({
                name: productName,
                quantity: 1
            });
        }

        saveCart();
        updateCartCount();
        renderCart();

        showToast(`${productName} added to your cart.`);
    }


    /* =====================================================
       ADD BUTTONS
    ===================================================== */

    document.querySelectorAll("[data-add]").forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();

            const productName = button.getAttribute("data-add");

            addToCart(productName);
        });
    });


    /* =====================================================
       CART COUNT
    ===================================================== */

    function updateCartCount() {
        if (!cartCount) {
            return;
        }

        const totalItems = cart.reduce(
            (total, item) => total + item.quantity,
            0
        );

        cartCount.textContent = totalItems;

        if (typeof cartCount.animate === "function") {
            cartCount.animate(
                [
                    { transform: "scale(1)" },
                    { transform: "scale(1.35)" },
                    { transform: "scale(1)" }
                ],
                {
                    duration: 250
                }
            );
        }
    }


    /* =====================================================
       RENDER CART
    ===================================================== */

    function renderCart() {
        if (!cartItems) {
            return;
        }

        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="cart-empty">
                    <div>🛒</div>

                    <h3>
                        YOUR CART IS EMPTY
                    </h3>

                    <p>
                        Add something futuristic.
                    </p>
                </div>
            `;

            if (cartTotal) {
                cartTotal.textContent = "$0";
            }

            return;
        }

        cartItems.innerHTML = "";

        cart.forEach((item, index) => {
            const itemElement = document.createElement("div");

            itemElement.className = "cart-item";

            itemElement.innerHTML = `
                <div>
                    <strong>
                        ${escapeHTML(item.name)}
                    </strong>

                    <div style="
                        margin-top:5px;
                        color:#687187;
                        font-size:10px;
                    ">
                        Quantity: ${item.quantity}
                    </div>
                </div>

                <button
                    type="button"
                    data-remove="${index}"
                    aria-label="Remove product"
                >
                    REMOVE
                </button>
            `;

            cartItems.appendChild(itemElement);
        });


        cartItems
            .querySelectorAll("[data-remove]")
            .forEach(button => {
                button.addEventListener("click", () => {
                    const index = Number(
                        button.getAttribute("data-remove")
                    );

                    removeFromCart(index);
                });
            });


        const prices = {
            "Neon Wireless Headphones": 79,
            "RGB Mechanical Keyboard": 69,
            "Nova Smartphone": 499,
            "Creator Desk Light": 39,
            "Studio Headset": 89,
            "Ultra Laptop": 899,
            "Precision Mouse": 49,
            "Smart Watch X": 129
        };


        let total = 0;

        cart.forEach(item => {
            const price = prices[item.name] || 0;

            total += price * item.quantity;
        });


        if (cartTotal) {
            cartTotal.textContent =
                `$${total.toLocaleString()}`;
        }
    }


    /* =====================================================
       REMOVE PRODUCT
    ===================================================== */

    function removeFromCart(index) {
        if (
            index < 0 ||
            index >= cart.length
        ) {
            return;
        }

        const removed = cart[index];

        cart.splice(index, 1);

        saveCart();
        updateCartCount();
        renderCart();

        showToast(
            `${removed.name} removed from cart.`
        );
    }


    /* =====================================================
       CHECKOUT
    ===================================================== */

    if (checkoutButton) {
        checkoutButton.addEventListener("click", () => {
            if (cart.length === 0) {
                showToast("Your cart is empty.");
                return;
            }

            showToast(
                "Checkout will be connected later."
            );
        });
    }


    /* =====================================================
       TOAST
    ===================================================== */

    let toastTimer;

    function showToast(message) {
        if (!toast) {
            return;
        }

        if (toastMessage) {
            toastMessage.textContent = message;
        }

        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2800);
    }


    /* =====================================================
       SEARCH OPEN
    ===================================================== */

    function openSearch() {
        if (!searchPanel) {
            return;
        }

        searchPanel.classList.add("open");

        setTimeout(() => {
            if (searchInput) {
                searchInput.focus();
            }
        }, 250);
    }


    /* =====================================================
       SEARCH CLOSE
    ===================================================== */

    function closeSearchPanel() {
        if (!searchPanel) {
            return;
        }

        searchPanel.classList.remove("open");

        if (searchInput) {
            searchInput.value = "";
            filterProducts("");
        }
    }


    if (searchButton) {
        searchButton.addEventListener(
            "click",
            openSearch
        );
    }

    if (closeSearch) {
        closeSearch.addEventListener(
            "click",
            closeSearchPanel
        );
    }


    /* =====================================================
       SEARCH
    ===================================================== */

    if (searchInput) {
        searchInput.addEventListener(
            "input",
            () => {
                const value = searchInput.value
                    .trim()
                    .toLowerCase();

                filterProducts(value);
            }
        );
    }


    function filterProducts(searchTerm) {
        if (!productsGrid) {
            return;
        }

        const products =
            productsGrid.querySelectorAll(
                ".product-card"
            );

        let visibleCount = 0;

        products.forEach(product => {
            const name =
                (product.dataset.name || "")
                    .toLowerCase();

            const category =
                (product.dataset.category || "")
                    .toLowerCase();

            const matches =
                name.includes(searchTerm) ||
                category.includes(searchTerm);

            if (matches) {
                product.style.display = "";
                visibleCount++;
            } else {
                product.style.display = "none";
            }
        });


        if (emptyProducts) {
            emptyProducts.style.display =
                visibleCount === 0
                    ? "block"
                    : "none";
        }
    }


    /* =====================================================
       CATEGORY FILTER
    ===================================================== */

    categoryButtons.forEach(button => {
        button.addEventListener(
            "click",
            () => {

                categoryButtons.forEach(item => {
                    item.classList.remove("active");
                });

                button.classList.add("active");

                const category =
                    button.dataset.category;

                const products =
                    productsGrid
                        ? productsGrid.querySelectorAll(
                            ".product-card"
                        )
                        : [];

                let visibleCount = 0;

                products.forEach(product => {
                    const productCategory =
                        product.dataset.category;

                    if (
                        category === "all" ||
                        productCategory === category
                    ) {
                        product.style.display = "";
                        visibleCount++;
                    } else {
                        product.style.display = "none";
                    }
                });


                if (emptyProducts) {
                    emptyProducts.style.display =
                        visibleCount === 0
                            ? "block"
                            : "none";
                }


                const productsSection =
                    document.getElementById(
                        "products"
                    );

                if (productsSection) {
                    productsSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }
        );
    });


    /* =====================================================
       SHOW ALL PRODUCTS
    ===================================================== */

    if (showAllProducts) {
        showAllProducts.addEventListener(
            "click",
            () => {

                categoryButtons.forEach(button => {
                    button.classList.remove("active");
                });


                const allButton =
                    document.querySelector(
                        '[data-category="all"]'
                    );

                if (allButton) {
                    allButton.classList.add("active");
                }


                if (productsGrid) {
                    productsGrid
                        .querySelectorAll(
                            ".product-card"
                        )
                        .forEach(product => {
                            product.style.display = "";
                        });
                }


                if (emptyProducts) {
                    emptyProducts.style.display = "none";
                }
            }
        );
    }


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {
            if (event.key === "Escape") {
                closeSearchPanel();
                closeCartDrawer();
            }
        }
    );


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }


    /* =====================================================
       PARTICLE SYSTEM
    ===================================================== */

    function startParticles() {
        if (!particleCanvas) {
            return;
        }

        const ctx =
            particleCanvas.getContext("2d");

        if (!ctx) {
            return;
        }


        let width = 0;
        let height = 0;

        const particles = [];

        const particleCount =
            window.innerWidth < 700
                ? 35
                : 70;


        function resizeCanvas() {
            const pixelRatio =
                Math.min(
                    window.devicePixelRatio || 1,
                    2
                );

            width = window.innerWidth;
            height = window.innerHeight;

            particleCanvas.width =
                width * pixelRatio;

            particleCanvas.height =
                height * pixelRatio;

            particleCanvas.style.width =
                `${width}px`;

            particleCanvas.style.height =
                `${height}px`;

            ctx.setTransform(
                pixelRatio,
                0,
                0,
                pixelRatio,
                0,
                0
            );
        }


        resizeCanvas();


        window.addEventListener(
            "resize",
            resizeCanvas
        );


        for (
            let i = 0;
            i < particleCount;
            i++
        ) {
            particles.push({
                x: Math.random() * width,

                y: Math.random() * height,

                radius:
                    Math.random() * 1.5 + 0.3,

                speedX:
                    (Math.random() - 0.5) * 0.25,

                speedY:
                    (Math.random() - 0.5) * 0.25,

                opacity:
                    Math.random() * 0.55 + 0.1
            });
        }


        function animateParticles() {
            ctx.clearRect(
                0,
                0,
                width,
                height
            );


            particles.forEach(
                particle => {

                    particle.x +=
                        particle.speedX;

                    particle.y +=
                        particle.speedY;


                    if (particle.x < -10) {
                        particle.x = width + 10;
                    }

                    if (particle.x > width + 10) {
                        particle.x = -10;
                    }

                    if (particle.y < -10) {
                        particle.y = height + 10;
                    }

                    if (particle.y > height + 10) {
                        particle.y = -10;
                    }


                    ctx.beginPath();

                    ctx.arc(
                        particle.x,
                        particle.y,
                        particle.radius,
                        0,
                        Math.PI * 2
                    );


                    ctx.fillStyle =
                        `rgba(0,245,255,${particle.opacity})`;

                    ctx.fill();
                }
            );


            for (
                let i = 0;
                i < particles.length;
                i++
            ) {

                for (
                    let j = i + 1;
                    j < particles.length;
                    j++
                ) {

                    const first =
                        particles[i];

                    const second =
                        particles[j];


                    const dx =
                        first.x - second.x;

                    const dy =
                        first.y - second.y;

                    const distance =
                        Math.sqrt(
                            dx * dx +
                            dy * dy
                        );


                    if (distance < 120) {

                        const opacity =
                            (1 - distance / 120) *
                            0.08;


                        ctx.beginPath();

                        ctx.moveTo(
                            first.x,
                            first.y
                        );

                        ctx.lineTo(
                            second.x,
                            second.y
                        );


                        ctx.strokeStyle =
                            `rgba(0,245,255,${opacity})`;

                        ctx.lineWidth = 0.6;

                        ctx.stroke();
                    }
                }
            }


            requestAnimationFrame(
                animateParticles
            );
        }


        animateParticles();
    }


    /* =====================================================
       START PARTICLES
    ===================================================== */

    startParticles();


    /* =====================================================
       INITIAL CART
    ===================================================== */

    updateCartCount();
    renderCart();


    /* =====================================================
       PAGE READY
    ===================================================== */

    console.log(
        "%c NEON SYSTEM ONLINE ",
        "color:#00f5ff;font-weight:bold;"
    );

    console.log(
        "%c Designed & Developed by Asim ",
        "color:#8b5cff;font-weight:bold;"
    );

});
```
