/* =========================================================
   PRODUCT.JS - ANNA AMUI
   Sistem Halaman Produk
   Terhubung dengan cart.js
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CEK CART.JS
       ===================================================== */

    if (typeof window.AnnaAmuiCart === "undefined") {

        console.error(
            "AnnaAmuiCart tidak ditemukan. Pastikan cart.js dimuat sebelum product.js."
        );

        return;

    }


    const Cart = window.AnnaAmuiCart;


    /* =====================================================
       QUANTITY PRODUK
       ===================================================== */

    const quantities = {

        original: 1,

        pedas: 1

    };


    /* =====================================================
       UPDATE TAMPILAN QUANTITY
       ===================================================== */

    function updateQuantityDisplay(product) {

        const element =
            document.getElementById(
                "qty-" + product
            );


        if (element) {

            element.textContent =
                quantities[product];

        }

    }


    /* =====================================================
       TOMBOL QUANTITY
       ===================================================== */

    function initQuantityButtons() {

        const buttons =
            document.querySelectorAll(
                ".quantity-btn"
            );


        buttons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const product =
                        this.dataset.product;

                    const action =
                        this.dataset.action;


                    if (!quantities.hasOwnProperty(product)) {

                        return;

                    }


                    if (action === "plus") {

                        quantities[product]++;

                    }


                    if (action === "minus") {

                        if (quantities[product] > 1) {

                            quantities[product]--;

                        }

                    }


                    updateQuantityDisplay(product);

                }
            );

        });

    }


    /* =====================================================
       AMBIL DATA PRODUK
       ===================================================== */

    function getProductData(button) {

        return {

            id:
                button.dataset.productId,

            name:
                button.dataset.productName,

            variant:
                button.dataset.productVariant || "",

            price:
                Number(
                    button.dataset.productPrice || 12
                ),

            image:
                button.dataset.productImage || ""

        };

    }


    /* =====================================================
       TAMBAHKAN SESUAI QUANTITY
       ===================================================== */

    function addProductQuantity(product, quantity) {

        if (!product || !product.id) {

            console.error(
                "Data produk tidak lengkap."
            );

            return;

        }


        if (quantity < 1) {

            quantity = 1;

        }


        /*
         * cart.js saat ini menambahkan
         * 1 pack setiap kali addToCart()
         *
         * Jadi kita panggil sebanyak
         * quantity yang dipilih.
         */

        for (
            let i = 0;
            i < quantity;
            i++
        ) {

            Cart.addToCart(product);

        }

    }


    /* =====================================================
       NOTIFIKASI BUTTON
       ===================================================== */

    function buttonFeedback(button) {

        const originalHTML =
            button.innerHTML;


        button.disabled = true;

        button.classList.add(
            "added"
        );


        button.innerHTML = `
            <i class="fa-solid fa-check"></i>
            Ditambahkan
        `;


        setTimeout(function () {

            button.innerHTML =
                originalHTML;

            button.disabled = false;

            button.classList.remove(
                "added"
            );

        }, 1200);

    }


    /* =====================================================
       UPDATE UI KERANJANG
       ===================================================== */

    function updateProductCartUI() {

        const cart =
            Cart.getCart();


        const total =
            Cart.getTotalQuantity(cart);


        /* HEADER CART */

        const headerCount =
            document.getElementById(
                "cart-count"
            );


        if (headerCount) {

            headerCount.textContent =
                total;

        }


        /* SUMMARY COUNT */

        const summaryCount =
            document.getElementById(
                "cart-summary-count"
            );


        if (summaryCount) {

            summaryCount.textContent =
                total;

        }


        /* SUMMARY TEXT */

        const summaryText =
            document.getElementById(
                "cart-summary-text"
            );


        if (summaryText) {

            if (total === 0) {

                summaryText.textContent =
                    "Belum ada produk";

            } else {

                summaryText.textContent =
                    total + " Pack di keranjang";

            }

        }

    }


    /* =====================================================
       TOMBOL TAMBAH KE KERANJANG
       ===================================================== */

    function initAddToCart() {

        const buttons =
            document.querySelectorAll(
                ".product-add-cart"
            );


        buttons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const product =
                        getProductData(this);


                    const productType =
                        this.closest(
                            ".product-card"
                        )?.dataset.product;


                    const quantity =
                        quantities[
                            productType
                        ] || 1;


                    addProductQuantity(
                        product,
                        quantity
                    );


                    buttonFeedback(
                        this
                    );


                    updateProductCartUI();

                }
            );

        });

    }


    /* =====================================================
       UPDATE SEMUA
       ===================================================== */

    function init() {

        initQuantityButtons();

        initAddToCart();

        updateQuantityDisplay(
            "original"
        );

        updateQuantityDisplay(
            "pedas"
        );

        updateProductCartUI();

    }


    /* =====================================================
       DOCUMENT READY
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
