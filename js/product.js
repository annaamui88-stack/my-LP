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

    const productTotal =
        document.getElementById("product-total");

    const promoInfo =
        document.getElementById("product-promo-info");

    const buyButton =
        document.getElementById("buyButton");


    /* =====================================================
       UPDATE TAMPILAN
    ===================================================== */

    function updateProduct() {

        const total = original + pedas;

        /* =========================
           JUMLAH ORIGINAL
        ========================= */

        if (qtyOriginal) {
            qtyOriginal.textContent = original;
        }


        /* =========================
           JUMLAH PEDAS
        ========================= */

        if (qtyPedas) {
            qtyPedas.textContent = pedas;
        }


        /* =========================
           TOTAL PACK
        ========================= */

        if (totalPack) {
            totalPack.textContent =
                total + " Pack";
        }


        /* =========================
           TOTAL HARGA
        ========================= */

        if (productTotal) {

            const price =
                total >= MIN_PROMO
                    ? PROMO_PRICE
                    : NORMAL_PRICE;

            const totalHarga =
                total * price;

            productTotal.textContent =
                "HK$" + totalHarga;
        }


        /* =========================
           PROMO INFO
        ========================= */

        if (!promoInfo) {
            return;
        }


        /* BELUM MEMILIH */

        if (total === 0) {

            promoInfo.innerHTML =
                '<i class="fa-solid fa-tag"></i> ' +
                'Pilih jumlah produk terlebih dahulu.';

            promoInfo.classList.remove("active");

            return;
        }


        /* PROMO AKTIF */

        if (total >= MIN_PROMO) {

            promoInfo.innerHTML =
                '<i class="fa-solid fa-circle-check"></i> ' +
                'Promo aktif! ' +
                '<strong>HK$10 / Pack</strong>';

            promoInfo.classList.add("active");

            return;
        }


        /* BELUM MENCAPAI PROMO */

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


            /* =========================
               VALIDASI
            ========================= */

            if (total <= 0) {

                alert(
                    "Silakan pilih minimal 1 Pack."
                );

                return;
            }


            /* =========================
               CHECKOUT URL
            ========================= */

            const checkoutURL =
                "checkout.html" +
                "?original=" +
                encodeURIComponent(original) +
                "&pedas=" +
                encodeURIComponent(pedas);


            /* =========================
               DISABLE BUTTON
            ========================= */

            buyButton.disabled = true;

            buyButton.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> ' +
                'Membuka Checkout...';


            /* =========================
               PINDAH CHECKOUT
            ========================= */

            window.location.href =
                checkoutURL;
        });
    }


    /* =====================================================
       INIT
    ===================================================== */

    updateProduct();

});
