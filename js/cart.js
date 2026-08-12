/* =========================================================
   CART.JS - ANNA AMUI
   Sistem Keranjang Terpadu
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
       GET CART
    ===================================================== */

    function getCart() {

        try {

            const data =
                localStorage.getItem(CART_KEY);

            if (!data) {
                return [];
            }

            const cart =
                JSON.parse(data);

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


    /* =====================================================
       SAVE CART
    ===================================================== */

    function saveCart(cart) {

        localStorage.setItem(
            CART_KEY,
            JSON.stringify(cart)
        );

        updateCartCount();

    }


    /* =====================================================
       TOTAL SEMUA PACK
    ===================================================== */

    function getTotalQuantity(cart) {

        cart =
            cart || getCart();

        return cart.reduce(
            function (total, item) {

                return total +
                    Number(item.quantity || 0);

            },
            0
        );

    }


    /* =====================================================
       CEK PROMO
    ===================================================== */

    function isPromoActive(cart) {

        return getTotalQuantity(cart)
            >= PROMO_MIN_QTY;

    }


    /* =====================================================
       HARGA PACK
    ===================================================== */

    function getPricePerPack(cart) {

        cart =
            cart || getCart();

        return isPromoActive(cart)
            ? PROMO_PRICE
            : NORMAL_PRICE;

    }


    /* =====================================================
       SUBTOTAL
    ===================================================== */

    function getSubtotal(cart) {

        cart =
            cart || getCart();

        const total =
            getTotalQuantity(cart);

        const price =
            getPricePerPack(cart);

        return total * price;

    }


    /* =====================================================
       TAMBAH PRODUK
       quantity bisa 1, 2, 3, dst
    ===================================================== */

    function addToCart(product, quantity) {

        if (!product || !product.id) {

            console.error(
                "Data produk tidak valid."
            );

            return;

        }


        quantity =
            Number(quantity || 1);


        if (quantity < 1) {
            quantity = 1;
        }


        const cart =
            getCart();


        const existing =
            cart.find(function (item) {

                return item.id === product.id;

            });


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

                image:
                    product.image || "",

                quantity:
                    quantity

            });

        }


        saveCart(cart);


        showNotification(
            `${product.name} × ${quantity} ditambahkan`
        );


        updateProductSummary();

    }


    /* =====================================================
       TAMBAH 1
    ===================================================== */

    function increaseQuantity(id) {

        const cart =
            getCart();


        const item =
            cart.find(function (product) {

                return product.id === id;

            });


        if (!item) {
            return;
        }


        item.quantity++;

        saveCart(cart);

        renderCart();

    }


    /* =====================================================
       KURANG 1
    ===================================================== */

    function decreaseQuantity(id) {

        const cart =
            getCart();


        const index =
            cart.findIndex(function (product) {

                return product.id === id;

            });


        if (index === -1) {
            return;
        }


        cart[index].quantity--;


        if (cart[index].quantity <= 0) {

            cart.splice(index, 1);

        }


        saveCart(cart);

        renderCart();

    }


    /* =====================================================
       HAPUS
    ===================================================== */

    function removeFromCart(id) {

        let cart =
            getCart();


        cart =
            cart.filter(function (item) {

                return item.id !== id;

            });


        saveCart(cart);

        renderCart();

    }


    /* =====================================================
       CLEAR
    ===================================================== */

    function clearCart() {

        localStorage.removeItem(
            CART_KEY
        );

        updateCartCount();

        renderCart();

    }


    /* =====================================================
       UPDATE ICON CART
    ===================================================== */

    function updateCartCount() {

        const total =
            getTotalQuantity();


        document
            .querySelectorAll(
                "#cart-count, .cart-count"
            )
            .forEach(function (element) {

                element.textContent =
                    total;

            });


        updateProductSummary();

    }


    /* =====================================================
       NOTIFICATION
    ===================================================== */

    function showNotification(message) {

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
            notification.timer
        );


        notification.timer =
            setTimeout(function () {

                notification.classList.remove(
                    "show"
                );

            }, 2200);

    }


    /* =====================================================
       RENDER CART
       Untuk cart.html
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
                        Yuk pilih produk Anna Amui
                        terlebih dahulu.
                    </p>

                    <a
                        href="produk.html"
                        class="btn btn-primary">

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
            cart.map(function (item) {

                const total =
                    item.quantity * price;


                return `

                    <div
                        class="cart-item"
                        data-id="${item.id}">

                        <div class="cart-item-image">

                            <img
                                src="${item.image}"
                                alt="${item.name}">

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
                                        data-id="${item.id}">

                                        −

                                    </button>


                                    <span>
                                        ${item.quantity}
                                    </span>


                                    <button
                                        type="button"
                                        class="cart-plus"
                                        data-id="${item.id}">

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
                                data-id="${item.id}">

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
            .forEach(function (button) {

                button.onclick =
                    function () {

                        increaseQuantity(
                            button.dataset.id
                        );

                    };

            });


        document
            .querySelectorAll(".cart-minus")
            .forEach(function (button) {

                button.onclick =
                    function () {

                        decreaseQuantity(
                            button.dataset.id
                        );

                    };

            });


        document
            .querySelectorAll(".cart-remove")
            .forEach(function (button) {

                button.onclick =
                    function () {

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

            if (total >= PROMO_MIN_QTY) {

                promo.innerHTML = `

                    <i class="fa-solid fa-circle-check"></i>

                    Promo aktif!

                    Semua produk mendapat harga
                    <strong>HK$10 / Pack</strong>.

                    Total ${total} Pack.

                `;

                promo.classList.add(
                    "active"
                );

            } else {

                const kurang =
                    PROMO_MIN_QTY - total;


                promo.innerHTML = `

                    <i class="fa-solid fa-tag"></i>

                    Tambah ${kurang} Pack lagi
                    untuk mendapatkan harga promo
                    <strong>HK$10 / Pack</strong>.

                `;

                promo.classList.remove(
                    "active"
                );

            }

        }

    }


    /* =====================================================
       PRODUCT PAGE SUMMARY
    ===================================================== */

    function updateProductSummary() {

        const total =
            getTotalQuantity();


        const count =
            document.getElementById(
                "cart-summary-count"
            );


        const text =
            document.getElementById(
                "cart-summary-text"
            );


        if (count) {

            count.textContent =
                total;

        }


        if (text) {

            if (total === 0) {

                text.textContent =
                    "Belum ada produk";

            } else {

                text.textContent =
                    `${total} Pack di keranjang`;

            }

        }

    }


    /* =====================================================
       INIT
    ===================================================== */

    function init() {

        updateCartCount();

        renderCart();

    }


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.AnnaAmuiCart = {

        getCart:
            getCart,

        saveCart:
            saveCart,

        addToCart:
            addToCart,

        increaseQuantity:
            increaseQuantity,

        decreaseQuantity:
            decreaseQuantity,

        removeFromCart:
            removeFromCart,

        clearCart:
            clearCart,

        getTotalQuantity:
            getTotalQuantity,

        getPricePerPack:
            getPricePerPack,

        getSubtotal:
            getSubtotal,

        isPromoActive:
            isPromoActive,

        updateCartCount:
            updateCartCount,

        renderCart:
            renderCart

    };


    /* =====================================================
       START
    ===================================================== */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();

    }

})();
