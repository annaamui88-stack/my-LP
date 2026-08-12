/* ==========================================================================
   CART.JS - ANNA AMUI
   Sistem Keranjang Belanja
   ========================================================================== */

(function () {

    "use strict";


    /* =========================================================
       KONFIGURASI
    ========================================================= */

    const CART_KEY = "annaAmuiCart";


    /* =========================================================
       DATA PRODUK
    ========================================================= */

    const PRODUCTS = {

        "AM-MANGGA-001": {
            id: "AM-MANGGA-001",
            name: "Manisan Mangga Anna Amui",
            category: "manisan-mangga",
            image: "assets/img/manisan-mangga-paket-hemat-1-pack.png",

            variants: {
                "Original": {
                    price: 12,
                    weight: 0.2
                },

                "Pedas": {
                    price: 12,
                    weight: 0.2
                }
            }
        }

    };


    /* =========================================================
       AMBIL CART DARI LOCAL STORAGE
    ========================================================= */

    function getCart() {

        try {

            const cart = localStorage.getItem(CART_KEY);

            if (!cart) {
                return [];
            }

            const parsedCart = JSON.parse(cart);

            return Array.isArray(parsedCart)
                ? parsedCart
                : [];

        } catch (error) {

            console.error(
                "Gagal membaca keranjang:",
                error
            );

            return [];

        }

    }


    /* =========================================================
       SIMPAN CART
    ========================================================= */

    function saveCart(cart) {

        try {

            localStorage.setItem(
                CART_KEY,
                JSON.stringify(cart)
            );

        } catch (error) {

            console.error(
                "Gagal menyimpan keranjang:",
                error
            );

        }

    }


    /* =========================================================
       JUMLAH ITEM
    ========================================================= */

    function getCartCount() {

        const cart = getCart();

        return cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    }


    /* =========================================================
       TOTAL HARGA
    ========================================================= */

    function getCartTotal() {

        const cart = getCart();

        return cart.reduce(
            (total, item) =>
                total +
                (item.price * item.quantity),
            0
        );

    }


    /* =========================================================
       TOTAL BERAT
    ========================================================= */

    function getCartWeight() {

        const cart = getCart();

        return cart.reduce(
            (total, item) =>
                total +
                (item.weight * item.quantity),
            0
        );

    }


    /* =========================================================
       FORMAT HARGA
    ========================================================= */

    function formatPrice(price) {

        return "HK$" + Number(price).toFixed(0);

    }


    /* =========================================================
       TAMBAH PRODUK
    ========================================================= */

    function addToCart(
        productId,
        variant = "Original",
        quantity = 1
    ) {

        const product =
            PRODUCTS[productId];


        if (!product) {

            console.error(
                "Produk tidak ditemukan:",
                productId
            );

            return false;

        }


        const variantData =
            product.variants[variant];


        if (!variantData) {

            console.error(
                "Varian tidak ditemukan:",
                variant
            );

            return false;

        }


        let cart = getCart();


        /*
         * ID ITEM dibuat berdasarkan
         * produk + varian.
         *
         * Contoh:
         *
         * AM-MANGGA-001-Original
         * AM-MANGGA-001-Pedas
         */

        const itemId =
            productId + "-" + variant;


        const existingItem =
            cart.find(
                item =>
                    item.itemId === itemId
            );


        if (existingItem) {

            existingItem.quantity += quantity;

        } else {

            cart.push({

                itemId: itemId,

                productId: product.id,

                name: product.name,

                variant: variant,

                price: variantData.price,

                weight: variantData.weight,

                image: product.image,

                quantity: quantity

            });

        }


        saveCart(cart);

        updateCartUI();

        triggerCartEvent();

        return true;

    }


    /* =========================================================
       HAPUS PRODUK
    ========================================================= */

    function removeFromCart(itemId) {

        let cart = getCart();

        cart =
            cart.filter(
                item =>
                    item.itemId !== itemId
            );

        saveCart(cart);

        updateCartUI();

        triggerCartEvent();

    }


    /* =========================================================
       UPDATE JUMLAH
    ========================================================= */

    function updateQuantity(
        itemId,
        quantity
    ) {

        let cart = getCart();


        const item =
            cart.find(
                item =>
                    item.itemId === itemId
            );


        if (!item) {
            return;
        }


        quantity =
            parseInt(quantity, 10);


        if (isNaN(quantity) || quantity <= 0) {

            removeFromCart(itemId);

            return;

        }


        item.quantity = quantity;


        saveCart(cart);

        updateCartUI();

        triggerCartEvent();

    }


    /* =========================================================
       TAMBAH 1
    ========================================================= */

    function increaseQuantity(itemId) {

        const cart = getCart();

        const item =
            cart.find(
                item =>
                    item.itemId === itemId
            );


        if (!item) {
            return;
        }


        item.quantity += 1;


        saveCart(cart);

        updateCartUI();

        triggerCartEvent();

    }


    /* =========================================================
       KURANG 1
    ========================================================= */

    function decreaseQuantity(itemId) {

        const cart = getCart();

        const item =
            cart.find(
                item =>
                    item.itemId === itemId
            );


        if (!item) {
            return;
        }


        item.quantity -= 1;


        if (item.quantity <= 0) {

            removeFromCart(itemId);

            return;

        }


        saveCart(cart);

        updateCartUI();

        triggerCartEvent();

    }


    /* =========================================================
       KOSONGKAN CART
    ========================================================= */

    function clearCart() {

        localStorage.removeItem(
            CART_KEY
        );

        updateCartUI();

        triggerCartEvent();

    }


    /* =========================================================
       UPDATE ICON CART
    ========================================================= */

    function updateCartUI() {

        const count =
            getCartCount();


        const cartCounters =
            document.querySelectorAll(
                "#cart-count, .cart-count"
            );


        cartCounters.forEach(
            counter => {

                counter.textContent =
                    count;

                /*
                 * Tetap tampilkan 0.
                 * Nanti kalau ingin badge
                 * menghilang saat kosong,
                 * tinggal diubah.
                 */

                counter.setAttribute(
                    "aria-label",
                    count +
                    " item dalam keranjang"
                );

            }
        );


        /*
         * Animasi kecil ketika cart
         * memiliki isi.
         */

        const cartButtons =
            document.querySelectorAll(
                ".cart-button"
            );


        cartButtons.forEach(
            button => {

                if (count > 0) {

                    button.classList.add(
                        "has-items"
                    );

                } else {

                    button.classList.remove(
                        "has-items"
                    );

                }

            }
        );

    }


    /* =========================================================
       ANIMASI CART
    ========================================================= */

    function bumpCart() {

        const cartButtons =
            document.querySelectorAll(
                ".cart-button"
            );


        cartButtons.forEach(
            button => {

                button.classList.remove(
                    "cart-bump"
                );


                /*
                 * Memaksa browser
                 * membaca ulang animasi.
                 */

                void button.offsetWidth;


                button.classList.add(
                    "cart-bump"
                );

            }
        );

    }


    /* =========================================================
       CUSTOM EVENT
    ========================================================= */

    function triggerCartEvent() {

        document.dispatchEvent(
            new CustomEvent(
                "annaAmuiCartUpdated",
                {
                    detail: {
                        cart: getCart(),
                        count: getCartCount(),
                        total: getCartTotal(),
                        weight: getCartWeight()
                    }
                }
            )
        );

    }


    /* =========================================================
       EVENT KETIKA HALAMAN PRODUK DIBUKA
    ========================================================= */

    function initializeProductPage() {

        /*
         * TOMBOL VARIAN
         */

        const variantButtons =
            document.querySelectorAll(
                ".variant-btn"
            );


        variantButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        const parent =
                            button.closest(
                                ".variant-options"
                            );


                        if (!parent) {
                            return;
                        }


                        parent
                            .querySelectorAll(
                                ".variant-btn"
                            )
                            .forEach(
                                btn =>
                                    btn.classList.remove(
                                        "active"
                                    )
                            );


                        button.classList.add(
                            "active"
                        );

                    }
                );

            }
        );


        /*
         * TOMBOL TAMBAH KERANJANG
         */

        const addButtons =
            document.querySelectorAll(
                ".add-cart-btn"
            );


        addButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        const productId =
                            button.dataset.productId;


                        const card =
                            button.closest(
                                ".product-card"
                            );


                        if (!card) {
                            return;
                        }


                        const activeVariant =
                            card.querySelector(
                                ".variant-btn.active"
                            );


                        const variant =
                            activeVariant
                                ? activeVariant.dataset.variant
                                : "Original";


                        const success =
                            addToCart(
                                productId,
                                variant,
                                1
                            );


                        if (!success) {
                            return;
                        }


                        /*
                         * Feedback tombol
                         */

                        button.classList.add(
                            "added"
                        );


                        const originalHTML =
                            button.innerHTML;


                        button.innerHTML =
                            '<i class="fa-solid fa-check"></i> Ditambahkan';


                        bumpCart();


                        setTimeout(
                            function () {

                                button.classList.remove(
                                    "added"
                                );

                                button.innerHTML =
                                    originalHTML;

                            },
                            1200
                        );

                    }
                );

            }
        );


        /*
         * TOMBOL BELI SEKARANG
         */

        const buyButtons =
            document.querySelectorAll(
                ".buy-now-btn"
            );


        buyButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        const productId =
                            button.dataset.productId;


                        const card =
                            button.closest(
                                ".product-card"
                            );


                        if (!card) {
                            return;
                        }


                        const activeVariant =
                            card.querySelector(
                                ".variant-btn.active"
                            );


                        const variant =
                            activeVariant
                                ? activeVariant.dataset.variant
                                : "Original";


                        const success =
                            addToCart(
                                productId,
                                variant,
                                1
                            );


                        if (!success) {
                            return;
                        }


                        /*
                         * Untuk sekarang langsung
                         * menuju checkout.
                         *
                         * Nanti setelah keranjang.html
                         * selesai, alurnya bisa kita
                         * sesuaikan lagi.
                         */

                        window.location.href =
                            "checkout.html";

                    }
                );

            }
        );


        /*
         * FILTER KATEGORI
         */

        const categoryButtons =
            document.querySelectorAll(
                ".category-btn"
            );


        const productCards =
            document.querySelectorAll(
                ".product-card"
            );


        categoryButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        const category =
                            button.dataset.category;


                        categoryButtons
                            .forEach(
                                btn =>
                                    btn.classList.remove(
                                        "active"
                                    )
                            );


                        button.classList.add(
                            "active"
                        );


                        productCards
                            .forEach(
                                card => {

                                    /*
                                     * Card "Segera Hadir"
                                     * tidak ikut filter.
                                     */

                                    if (
                                        card.classList.contains(
                                            "product-coming-soon"
                                        )
                                    ) {
                                        return;
                                    }


                                    const cardCategory =
                                        card.dataset.category;


                                    if (
                                        category === "all" ||
                                        cardCategory === category
                                    ) {

                                        card.classList.remove(
                                            "product-hidden"
                                        );

                                    } else {

                                        card.classList.add(
                                            "product-hidden"
                                        );

                                    }

                                }
                            );

                    }
                );

            }
        );

    }


    /* =========================================================
       INITIALIZE
    ========================================================= */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            updateCartUI();

            initializeProductPage();

        }
    );


    /* =========================================================
       PUBLIC API
       ========================================================= */

    window.AnnaAmuiCart = {

        getCart,
        getCartCount,
        getCartTotal,
        getCartWeight,

        addToCart,
        removeFromCart,
        updateQuantity,

        increaseQuantity,
        decreaseQuantity,

        clearCart,

        formatPrice,

        updateCartUI

    };


})();
