/* =========================================================
   CART.JS - ANNA AMUI
   Sistem Keranjang Belanja
   ========================================================= */

(function () {

    "use strict";

    /* =====================================================
       KONFIGURASI
       ===================================================== */

    const CART_KEY = "annaAmuiCart";

    const NORMAL_PRICE = 12;
    const PROMO_PRICE = 10;
    const PROMO_MIN_QTY = 3;


    /* =====================================================
       AMBIL CART
       ===================================================== */

    function getCart() {

        try {

            const cart = localStorage.getItem(CART_KEY);

            if (!cart) {
                return [];
            }

            const parsed = JSON.parse(cart);

            return Array.isArray(parsed) ? parsed : [];

        } catch (error) {

            console.error(
                "Gagal membaca keranjang:",
                error
            );

            return [];

        }

    }


    /* =====================================================
       SIMPAN CART
       ===================================================== */

    function saveCart(cart) {

        try {

            localStorage.setItem(
                CART_KEY,
                JSON.stringify(cart)
            );

            updateCartCount();

        } catch (error) {

            console.error(
                "Gagal menyimpan keranjang:",
                error
            );

        }

    }


    /* =====================================================
       TOTAL ITEM
       ===================================================== */

    function getTotalQuantity(cart = getCart()) {

        return cart.reduce(
            (total, item) => total + Number(item.quantity || 0),
            0
        );

    }


    /* =====================================================
       HARGA PER PACK
       ===================================================== */

    function getPricePerPack(cart = getCart()) {

        const totalQty = getTotalQuantity(cart);

        return totalQty >= PROMO_MIN_QTY
            ? PROMO_PRICE
            : NORMAL_PRICE;

    }


    /* =====================================================
       SUBTOTAL
       ===================================================== */

    function getSubtotal(cart = getCart()) {

        const totalQty = getTotalQuantity(cart);

        const price = getPricePerPack(cart);

        return totalQty * price;

    }


    /* =====================================================
       TAMBAH PRODUK
       ===================================================== */

    function addToCart(product) {

        if (!product || !product.id) {
            console.error(
                "Data produk tidak valid."
            );

            return;
        }


        const cart = getCart();


        const existingProduct = cart.find(
            item => item.id === product.id
        );


        if (existingProduct) {

            existingProduct.quantity += 1;

        } else {

            cart.push({

                id: product.id,

                name: product.name,

                variant: product.variant || "",

                price: Number(product.price || NORMAL_PRICE),

                image: product.image || "",

                quantity: 1

            });

        }


        saveCart(cart);


        showCartNotification(
            `${product.name} ditambahkan ke keranjang`
        );

    }


    /* =====================================================
       TAMBAH JUMLAH
       ===================================================== */

    function increaseQuantity(productId) {

        const cart = getCart();

        const item = cart.find(
            product => product.id === productId
        );

        if (!item) {
            return;
        }

        item.quantity += 1;

        saveCart(cart);

        renderCart();

    }


    /* =====================================================
       KURANG JUMLAH
       ===================================================== */

    function decreaseQuantity(productId) {

        const cart = getCart();

        const item = cart.find(
            product => product.id === productId
        );

        if (!item) {
            return;
        }


        item.quantity -= 1;


        if (item.quantity <= 0) {

            const index = cart.findIndex(
                product => product.id === productId
            );

            cart.splice(index, 1);

        }


        saveCart(cart);

        renderCart();

    }


    /* =====================================================
       HAPUS PRODUK
       ===================================================== */

    function removeFromCart(productId) {

        let cart = getCart();

        cart = cart.filter(
            item => item.id !== productId
        );

        saveCart(cart);

        renderCart();

    }


    /* =====================================================
       KOSONGKAN CART
       ===================================================== */

    function clearCart() {

        localStorage.removeItem(CART_KEY);

        updateCartCount();

        renderCart();

    }


    /* =====================================================
       UPDATE JUMLAH ICON CART
       ===================================================== */

    function updateCartCount() {

        const cart = getCart();

        const total = getTotalQuantity(cart);


        const counters = document.querySelectorAll(
            "#cart-count, .cart-count"
        );


        counters.forEach(counter => {

            counter.textContent = total;

            if (total > 0) {

                counter.classList.add(
                    "has-items"
                );

            } else {

                counter.classList.remove(
                    "has-items"
                );

            }

        });

    }


    /* =====================================================
       NOTIFIKASI
       ===================================================== */

    function showCartNotification(message) {

        let notification =
            document.getElementById(
                "cart-notification"
            );


        if (!notification) {

            notification =
                document.createElement("div");

            notification.id =
                "cart-notification";

            notification.className =
                "cart-notification";

            document.body.appendChild(
                notification
            );

        }


        notification.innerHTML = `
            <i class="fa-solid fa-check"></i>
            <span>${message}</span>
        `;


        notification.classList.add(
            "show"
        );


        clearTimeout(
            notification._timer
        );


        notification._timer =
            setTimeout(() => {

                notification.classList.remove(
                    "show"
                );

            }, 2200);

    }


    /* =====================================================
       DATA DARI TOMBOL PRODUK
       ===================================================== */

    function getProductFromButton(button) {

        return {

            id:
                button.dataset.productId,

            name:
                button.dataset.productName,

            variant:
                button.dataset.productVariant,

            price:
                Number(
                    button.dataset.productPrice ||
                    NORMAL_PRICE
                ),

            image:
                button.dataset.productImage || ""

        };

    }


    /* =====================================================
       TOMBOL TAMBAH KE KERANJANG
       ===================================================== */

    function initAddToCartButtons() {

        const buttons =
            document.querySelectorAll(
                ".product-add-cart"
            );


        buttons.forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    const product =
                        getProductFromButton(
                            this
                        );

                    addToCart(product);

                }
            );

        });

    }


    /* =====================================================
       BELI SEKARANG
       ===================================================== */

    function initBuyNowButtons() {

        const buttons =
            document.querySelectorAll(
                ".product-buy-now"
            );


        buttons.forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    const product =
                        getProductFromButton(
                            this
                        );


                    const cart =
                        getCart();


                    const existing =
                        cart.find(
                            item =>
                                item.id ===
                                product.id
                        );


                    if (existing) {

                        existing.quantity += 1;

                    } else {

                        cart.push({

                            id:
                                product.id,

                            name:
                                product.name,

                            variant:
                                product.variant,

                            price:
                                product.price,

                            image:
                                product.image,

                            quantity: 1

                        });

                    }


                    saveCart(cart);


                    window.location.href =
                        "cart.html";

                }
            );

        });

    }


    /* =====================================================
       RENDER CART
       ===================================================== */

    function renderCart() {

        const cartContainer =
            document.getElementById(
                "cart-items"
            );


        if (!cartContainer) {
            return;
        }


        const cart = getCart();


        if (cart.length === 0) {

            cartContainer.innerHTML = `
                <div class="cart-empty">

                    <div class="cart-empty-icon">
                        <i class="fa-solid fa-cart-shopping"></i>
                    </div>

                    <h2>
                        Keranjang Masih Kosong
                    </h2>

                    <p>
                        Yuk pilih produk Anna Amui
                        terlebih dahulu.
                    </p>

                    <a
                        href="produk.html"
                        class="btn btn-primary"
                    >
                        Lihat Produk
                    </a>

                </div>
            `;

            updateCartSummary();

            return;

        }


        cartContainer.innerHTML =
            cart.map(item => {

                const itemTotal =
                    item.quantity *
                    getPricePerPack(cart);


                return `

                    <div
                        class="cart-item"
                        data-id="${item.id}"
                    >

                        <div class="cart-item-image">

                            <img
                                src="${item.image}"
                                alt="${item.name}"
                            >

                        </div>


                        <div class="cart-item-info">

                            <span class="cart-item-variant">
                                ${item.variant}
                            </span>

                            <h3>
                                ${item.name}
                            </h3>

                            <p>
                                HK$${getPricePerPack(cart)}
                                / Pack
                            </p>


                            <div class="cart-item-bottom">

                                <div class="cart-quantity">

                                    <button
                                        type="button"
                                        class="cart-minus"
                                        data-id="${item.id}"
                                    >
                                        −
                                    </button>

                                    <span>
                                        ${item.quantity}
                                    </span>

                                    <button
                                        type="button"
                                        class="cart-plus"
                                        data-id="${item.id}"
                                    >
                                        +
                                    </button>

                                </div>


                                <strong>
                                    HK$${itemTotal}
                                </strong>

                            </div>


                            <button
                                type="button"
                                class="cart-remove"
                                data-id="${item.id}"
                            >
                                <i class="fa-solid fa-trash"></i>
                                Hapus
                            </button>

                        </div>

                    </div>

                `;

            }).join("");


        initCartButtons();

        updateCartSummary();

    }


    /* =====================================================
       BUTTON CART
       ===================================================== */

    function initCartButtons() {

        document
            .querySelectorAll(".cart-plus")
            .forEach(button => {

                button.onclick = () => {

                    increaseQuantity(
                        button.dataset.id
                    );

                };

            });


        document
            .querySelectorAll(".cart-minus")
            .forEach(button => {

                button.onclick = () => {

                    decreaseQuantity(
                        button.dataset.id
                    );

                };

            });


        document
            .querySelectorAll(".cart-remove")
            .forEach(button => {

                button.onclick = () => {

                    removeFromCart(
                        button.dataset.id
                    );

                };

            });

    }


    /* =====================================================
       SUMMARY CART
       ===================================================== */

    function updateCartSummary() {

        const cart = getCart();

        const totalQty =
            getTotalQuantity(cart);

        const price =
            getPricePerPack(cart);

        const subtotal =
            getSubtotal(cart);


        const totalPack =
            document.getElementById(
                "cart-total-pack"
            );

        const pricePack =
            document.getElementById(
                "cart-price-pack"
            );

        const subtotalElement =
            document.getElementById(
                "cart-subtotal"
            );


        if (totalPack) {
            totalPack.textContent =
                totalQty;
        }


        if (pricePack) {

            pricePack.textContent =
                `HK$${price}`;

        }


        if (subtotalElement) {

            subtotalElement.textContent =
                `HK$${subtotal}`;

        }


        const promo =
            document.getElementById(
                "cart-promo"
            );


        if (promo) {

            if (totalQty >= PROMO_MIN_QTY) {

                promo.innerHTML = `
                    <i class="fa-solid fa-circle-check"></i>
                    Promo aktif! Harga
                    <strong>HK$10 / Pack</strong>
                    karena membeli ${totalQty} Pack.
                `;

                promo.classList.add(
                    "active"
                );

            } else {

                promo.innerHTML = `
                    <i class="fa-solid fa-tag"></i>
                    Beli ${PROMO_MIN_QTY - totalQty}
                    Pack lagi untuk mendapatkan
                    harga promo HK$10 / Pack.
                `;

                promo.classList.remove(
                    "active"
                );

            }

        }


        updateCartCount();

    }


    /* =====================================================
       CHECKOUT
       ===================================================== */

    function initCheckoutButton() {

        const button =
            document.getElementById(
                "cart-checkout"
            );


        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            function () {

                const cart = getCart();


                if (
                    cart.length === 0
                ) {

                    showCartNotification(
                        "Keranjang masih kosong"
                    );

                    return;

                }


                window.location.href =
                    "checkout.html";

            }
        );

    }


    /* =====================================================
       INIT
       ===================================================== */

    function initCart() {

        updateCartCount();

        initAddToCartButtons();

        initBuyNowButtons();

        renderCart();

        initCheckoutButton();

    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.AnnaAmuiCart = {

        getCart,

        saveCart,

        addToCart,

        increaseQuantity,

        decreaseQuantity,

        removeFromCart,

        clearCart,

        getTotalQuantity,

        getPricePerPack,

        getSubtotal,

        updateCartCount,

        renderCart

    };


    /* =====================================================
       DOCUMENT READY
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initCart
        );

    } else {

        initCart();

    }


})();
