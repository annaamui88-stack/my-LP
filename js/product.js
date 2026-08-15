/* =========================================================
   PRODUCT.JS - ANNA AMUI
   HALAMAN KATALOG PRODUK
========================================================= */

"use strict";


document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =====================================================
           KONFIGURASI
        ====================================================== */

        const MIN_PROMO = 3;

        const NORMAL_PRICE = 12;

        const PROMO_PRICE = 10;


        /* =====================================================
           STATE
        ====================================================== */

        let original = 0;

        let pedas = 0;


        /* =====================================================
           ELEMENT
        ====================================================== */

        const qtyOriginal =
            document.getElementById(
                "qty-original"
            );


        const qtyPedas =
            document.getElementById(
                "qty-pedas"
            );


        const totalPack =
            document.getElementById(
                "product-total-pack"
            );


        const promoInfo =
            document.getElementById(
                "product-promo-info"
            );


        const buyButton =
            document.getElementById(
                "buyButton"
            );


        /* =====================================================
           TOTAL PACK
        ====================================================== */

        function getTotalPack() {

            return original + pedas;

        }


        /* =====================================================
           UPDATE PRODUCT
        ====================================================== */

        function updateProduct() {

            const total =
                getTotalPack();


            /* ================================================
               ORIGINAL
            ================================================= */

            if (qtyOriginal) {

                qtyOriginal.textContent =
                    original;

            }


            /* ================================================
               PEDAS
            ================================================= */

            if (qtyPedas) {

                qtyPedas.textContent =
                    pedas;

            }


            /* ================================================
               TOTAL
            ================================================= */

            if (totalPack) {

                totalPack.textContent =
                    total + " Pack";

            }


            /* ================================================
               PROMO INFO
            ================================================= */

            if (!promoInfo) {
                return;
            }


            /* BELUM MEMILIH */

            if (total === 0) {

                promoInfo.innerHTML =
                    '<i class="fa-solid fa-circle-info" ' +
                    'aria-hidden="true"></i>' +
                    '<span>' +
                    'Pilih jumlah produk terlebih dahulu.' +
                    '</span>';

                promoInfo.classList.remove(
                    "active"
                );

                return;

            }


            /* PROMO AKTIF */

            if (total >= MIN_PROMO) {

                promoInfo.innerHTML =
                    '<i class="fa-solid fa-circle-check" ' +
                    'aria-hidden="true"></i>' +
                    '<span>' +
                    'Promo aktif! ' +
                    '<strong>HK$' +
                    PROMO_PRICE +
                    ' / Pack</strong>' +
                    '</span>';

                promoInfo.classList.add(
                    "active"
                );

                return;

            }


            /* BELUM PROMO */

            const kurang =
                MIN_PROMO - total;


            promoInfo.innerHTML =
                '<i class="fa-solid fa-tag" ' +
                'aria-hidden="true"></i>' +
                '<span>' +
                'Tambah <strong>' +
                kurang +
                ' Pack</strong> lagi untuk mendapatkan ' +
                'harga promo <strong>HK$' +
                PROMO_PRICE +
                ' / Pack</strong>.' +
                '</span>';

            promoInfo.classList.remove(
                "active"
            );

        }


        /* =====================================================
           QUANTITY BUTTON
        ====================================================== */

        const quantityButtons =
            document.querySelectorAll(
                ".quantity-btn"
            );


        quantityButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const target =
                            button.dataset.target;


                        const action =
                            button.dataset.action;


                        /* ====================================
                           ORIGINAL
                        ==================================== */

                        if (
                            target ===
                            "original"
                        ) {

                            if (
                                action ===
                                "plus"
                            ) {

                                original++;

                            }


                            if (
                                action ===
                                "minus" &&
                                original > 0
                            ) {

                                original--;

                            }

                        }


                        /* ====================================
                           PEDAS
                        ==================================== */

                        if (
                            target ===
                            "pedas"
                        ) {

                            if (
                                action ===
                                "plus"
                            ) {

                                pedas++;

                            }


                            if (
                                action ===
                                "minus" &&
                                pedas > 0
                            ) {

                                pedas--;

                            }

                        }


                        updateProduct();

                    }
                );

            }
        );


        /* =====================================================
           BUY NOW
        ====================================================== */

        if (buyButton) {

            buyButton.addEventListener(
                "click",
                function () {


                    const total =
                        getTotalPack();


                    /* ========================================
                       VALIDASI
                    ======================================== */

                    if (total <= 0) {

                        alert(
                            "Silakan pilih minimal 1 Pack."
                        );

                        return;

                    }


                    /* ========================================
                       CHECKOUT URL
                    ======================================== */

                    const checkoutURL =
                        "checkout.html" +
                        "?original=" +
                        encodeURIComponent(
                            original
                        ) +
                        "&pedas=" +
                        encodeURIComponent(
                            pedas
                        );


                    /* ========================================
                       BUTTON LOADING
                    ======================================== */

                    buyButton.disabled =
                        true;


                    buyButton.innerHTML =
                        '<i class="fa-solid fa-spinner fa-spin" ' +
                        'aria-hidden="true"></i>' +
                        '<span>Membuka Checkout...</span>';


                    /* ========================================
                       REDIRECT
                    ======================================== */

                    window.location.href =
                        checkoutURL;

                }
            );

        }


        /* =====================================================
           INITIALIZE
        ====================================================== */

        updateProduct();


    }
);
