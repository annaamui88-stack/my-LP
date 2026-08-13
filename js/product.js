/* =========================================================
   PRODUCT.JS - ANNA AMUI
   Produk → Checkout
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       DATA PRODUK
    ===================================================== */

    let original = 0;
    let pedas = 0;

    const MIN_PROMO = 3;
    const NORMAL_PRICE = 12;
    const PROMO_PRICE = 10;


    /* =====================================================
       ELEMENT
    ===================================================== */

    const qtyOriginal =
        document.getElementById("qty-original");

    const qtyPedas =
        document.getElementById("qty-pedas");

    const totalPack =
        document.getElementById("product-total-pack");

    const promoInfo =
        document.getElementById("product-promo-info");

    const buyButton =
        document.getElementById("buyButton");


    /* =====================================================
       UPDATE TAMPILAN
    ===================================================== */

    function updateProduct() {

        const total =
            original + pedas;


        /* Jumlah Original */

        if (qtyOriginal) {
            qtyOriginal.textContent = original;
        }


        /* Jumlah Pedas */

        if (qtyPedas) {
            qtyPedas.textContent = pedas;
        }


        /* Total Pack */

        if (totalPack) {
            totalPack.textContent =
                total + " Pack";
        }


        /* =================================================
           PROMO
        ================================================= */

        if (!promoInfo) {
            return;
        }


        if (total === 0) {

            promoInfo.innerHTML =
                "Pilih jumlah produk terlebih dahulu.";

            promoInfo.classList.remove("active");

            return;
        }


        if (total >= MIN_PROMO) {

            promoInfo.innerHTML =
                '<i class="fa-solid fa-circle-check"></i> ' +
                'Promo aktif! <strong>HK$10 / Pack</strong>';

            promoInfo.classList.add("active");

        } else {

            const kurang =
                MIN_PROMO - total;

            promoInfo.innerHTML =
                '<i class="fa-solid fa-tag"></i> ' +
                'Tambah <strong>' +
                kurang +
                ' Pack</strong> lagi untuk mendapatkan ' +
                'harga promo <strong>HK$10 / Pack</strong>.';

            promoInfo.classList.remove("active");
        }

    }


    /* =====================================================
       TOMBOL JUMLAH
    ===================================================== */

    const quantityButtons =
        document.querySelectorAll(".quantity-btn");


    quantityButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const target =
                button.dataset.target;

            const action =
                button.dataset.action;


            /* =========================
               ORIGINAL
            ========================= */

            if (target === "original") {

                if (action === "plus") {
                    original++;
                }

                if (
                    action === "minus" &&
                    original > 0
                ) {
                    original--;
                }

            }


            /* =========================
               PEDAS
            ========================= */

            if (target === "pedas") {

                if (action === "plus") {
                    pedas++;
                }

                if (
                    action === "minus" &&
                    pedas > 0
                ) {
                    pedas--;
                }

            }


            updateProduct();

        });

    });


    /* =====================================================
       BELI SEKARANG
    ===================================================== */

    if (buyButton) {

        buyButton.addEventListener("click", function () {

            const total =
                original + pedas;


            /* Tidak boleh kosong */

            if (total <= 0) {

                alert(
                    "Silakan pilih minimal 1 Pack."
                );

                return;
            }


            /* =================================================
               BUAT URL CHECKOUT
            ================================================= */

            const checkoutURL =
                "checkout.html" +
                "?original=" +
                encodeURIComponent(original) +
                "&pedas=" +
                encodeURIComponent(pedas);


            /* =================================================
               ANIMASI BUTTON
            ================================================= */

            buyButton.disabled = true;

            buyButton.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> ' +
                'Membuka Checkout...';


            /* =================================================
               PINDAH KE CHECKOUT
            ================================================= */

            window.location.href =
                checkoutURL;

        });

    }


    /* =====================================================
       INIT
    ===================================================== */

    updateProduct();

});
