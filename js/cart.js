/* =========================================================
   CART.JS - ANNA AMUI
   SISTEM KERANJANG UTAMA
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
       CART
    ===================================================== */

    function getCart() {

        try {

            const data =
                localStorage.getItem(CART_KEY);

            if (!data) {
                return [];
            }

            const cart = JSON.parse(data);

            return Array.isArray(cart)
                ? cart
                : [];

        } catch (error) {

            console.error(
                "Gagal membaca keranjang:",
                error
            );

            return [];

        }

    }


    function saveCart(cart) {

        localStorage.setItem(
            CART_KEY,
            JSON.stringify(cart)
        );

        updateCartCount();

    }


    /* =====================================================
       TOTAL PACK
    ===================================================== */

    function getTotalQuantity(cart = getCart()) {

        return cart.reduce(
            (total, item) => {

                return total +
                    Number(item.quantity || 0);

            },
            0
        );

    }


    /* =====================================================
       HARGA
    ===================================================== */

    function getPricePerPack(
        cart = getCart()
    ) {

        const total =
            getTotalQuantity(cart);

        return total >= PROMO_MIN_QTY
            ? PROMO_PRICE
            : NORMAL_PRICE;

    }


    /* =====================================================
       SUBTOTAL
    ===================================================== */

    function getSubtotal(
        cart = getCart()
    ) {

        const total =
            getTotalQuantity(cart);

        const price =
            getPricePerPack(cart);

        return total * price;

    }


    /* =====================================================
       TAMBAH PRODUK
    ===================================================== */

    function addToCart(product) {

        if (!product || !product.id) {

            console.error(
                "Produk tidak valid."
            );

            return;

        }


        const cart =
            getCart();


        const existing =
            cart.find(
                item =>
                    item.id === product.id
            );


        if (existing) {

            existing.quantity += 1;

        } else {

            cart.push({

                id:
                    product.id,

                name:
                    product.name || "",

                variant:
                    product.variant || "",

                price:
                    Number(
                        product.price || NORMAL_PRICE
                    ),

                image:
                    product.image || "",

                quantity:
                    1

            });

        }


        saveCart(cart);

        showNotification(
            `${product.name} ditambahkan ke keranjang`
        );

    }


    /* =====================================================
       TAMBAH BEBERAPA
    ===================================================== */

    function addMultipleToCart(
        product,
        quantity
    ) {

        quantity =
            Number(quantity);


        if (
            !product ||
            !product.id ||
            quantity <= 0
        ) {

            return;

        }


        const cart =
            getCart();


        const existing =
            cart.find(
                item =>
                    item.id === product.id
            );


        if (existing) {

            existing.quantity += quantity;

        } else {

            cart.push({

                id:
                    product.id,

                name:
                    product.name || "",

                variant:
                    product.variant || "",

                price:
                    Number(
                        product.price || NORMAL_PRICE
                    ),

                image:
                    product.image || "",

                quantity:
                    quantity

            });

        }


        saveCart(cart);

        showNotification(
            `${quantity} Pack ${product.name} ditambahkan`
        );

    }


    /* =====================================================
       TAMBAH JUMLAH
    ===================================================== */

    function increaseQuantity(id) {

        const cart =
            getCart();


        const item =
            cart.find(
                product =>
                    product.id === id
            );


        if (!item) {
            return;
        }


        item.quantity++;


        saveCart(cart);

        renderCart();

    }


    /* =====================================================
       KURANG JUMLAH
    ===================================================== */

    function decreaseQuantity(id) {

        const cart =
            getCart();


        const item =
            cart.find(
                product =>
                    product.id === id
            );


        if (!item) {
            return;
        }


        item.quantity--;


        if (item.quantity <= 0) {

            const index =
                cart.findIndex(
                    product =>
                        product.id === id
                );

            cart.splice(
                index,
                1
            );

        }


        saveCart(cart);

        renderCart();

    }


    /* =====================================================
       HAPUS
    ===================================================== */

    function removeFromCart(id) {

        const cart =
            getCart().filter(
                item =>
                    item.id !== id
            );


        saveCart(cart);

        renderCart();

    }


    /* =====================================================
       KOSONGKAN
    ===================================================== */

    function clearCart() {

        localStorage.removeItem(
            CART_KEY
        );

        updateCartCount();

        renderCart();

    }


    /* =====================================================
       CART COUNT
    ===================================================== */

    function updateCartCount() {

        const total =
            getTotalQuantity();


        document
            .querySelectorAll(
                "#cart-count, .cart-count, #cart-summary-count"
            )
            .forEach(
                element => {

                    element.textContent =
                        total;

                    element.classList.toggle(
                        "has-items",
                        total > 0
                    );

                }
            );

    }


    /* =====================================================
       NOTIFICATION
    ===================================================== */

    function showNotification(
        message
    ) {

        let box =
            document.getElementById(
                "cart-notification"
            );


        if (!box) {

            box =
                document.createElement(
                    "div"
                );

            box.id =
                "cart-notification";

            box.className =
                "cart-notification";

            document.body.appendChild(
                box
            );

        }


        box.innerHTML = `
            <i class="fa-solid fa-check"></i>
            <span>${message}</span>
        `;


        box.classList.add(
            "show"
        );


        clearTimeout(
            box.timer
        );


        box.timer =
            setTimeout(
                function () {

                    box.classList.remove(
                        "show"
                    );

                },
                2200
            );

    }


    /* =====================================================
       RENDER CART
    ===================================================== */

    function renderCart() {

        const container =
            document.getElementById(
                "cart-items"
            );


        if (!container) {
            return;
        }


        const cart =
            getCart();


        if (cart.length === 0) {

            container.innerHTML = `

                <div class="cart-empty">

                    <div class="cart-empty-icon">

                        <i class="fa-solid fa-cart-shopping"></i>

                    </div>

                    <h2>
                        Keranjang Masih Kosong
                    </h2>

                    <p>
                        Belum ada produk di keranjang Anda.
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


        const price =
            getPricePerPack(cart);


        container.innerHTML =
            cart.map(
                item => {

                    const total =
                        item.quantity *
                        price;


                    return `

                        <article
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
                                    HK$${price} / Pack
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
                                        HK$${total}
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

                        </article>

                    `;

                }
            ).join("");


        initCartButtons();

        updateCartSummary();

    }


    /* =====================================================
       CART BUTTON
    ===================================================== */

    function initCartButtons() {

        document
            .querySelectorAll(".cart-plus")
            .forEach(
                button => {

                    button.onclick =
                        function () {

                            increaseQuantity(
                                this.dataset.id
                            );

                        };

                }
            );


        document
            .querySelectorAll(".cart-minus")
            .forEach(
                button => {

                    button.onclick =
                        function () {

                            decreaseQuantity(
                                this.dataset.id
                            );

                        };

                }
            );


        document
            .querySelectorAll(".cart-remove")
            .forEach(
                button => {

                    button.onclick =
                        function () {

                            removeFromCart(
                                this.dataset.id
                            );

                        };

                }
            );

    }


    /* =====================================================
       CART SUMMARY
    ===================================================== */

    function updateCartSummary() {

        const cart =
            getCart();


        const total =
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
                total;

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

            if (
                total >=
                PROMO_MIN_QTY
            ) {

                promo.innerHTML = `

                    <i class="fa-solid fa-circle-check"></i>

                    Promo aktif!
                    Harga
                    <strong>HK$10 / Pack</strong>

                    karena total pesanan
                    ${total} Pack.

                `;

                promo.classList.add(
                    "active"
                );

            } else {

                const kurang =
                    PROMO_MIN_QTY -
                    total;


                promo.innerHTML = `

                    <i class="fa-solid fa-tag"></i>

                    Tambah
                    <strong>${kurang} Pack</strong>
                    lagi untuk mendapatkan
                    harga promo
                    <strong>HK$10 / Pack</strong>.

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

    function initCheckout() {

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

                if (
                    getCart().length === 0
                ) {

                    showNotification(
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

    function init() {

        updateCartCount();

        renderCart();

        initCheckout();

    }


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.AnnaAmuiCart = {

        getCart,

        saveCart,

        addToCart,

        addMultipleToCart,

        increaseQuantity,

        decreaseQuantity,

        removeFromCart,

        clearCart,

        getTotalQuantity,

        getPricePerPack,

        getSubtotal,

        updateCartCount,

        renderCart,

        updateCartSummary

    };


    /* =====================================================
       START
    ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();

    }


})();
