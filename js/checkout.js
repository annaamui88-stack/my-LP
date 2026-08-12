/* =========================================================
   CHECKOUT.JS - ANNA AMUI
   Direct Product → Checkout → WhatsApp
========================================================= */

"use strict";


/* =========================================================
   KONFIGURASI
========================================================= */

const API_URL =
    "https://script.google.com/macros/s/AKfycbxaL7XqgyEWnqr9VxsoHS4-gr3pLEssFxeiDl0MSJyqKUbk3sfiR0u1OYPBc9y15VMh/exec";

const WA_NUMBER =
    "6287862201153";


const NORMAL_PRICE = 12;
const PROMO_PRICE = 10;
const PROMO_MIN_QTY = 3;


/*
 * Berat:
 *
 * 5 Pack = 1 Kg
 * sehingga 1 Pack = 0.2 Kg
 */

const KG_PER_PACK = 0.2;


/* =========================================================
   JUMLAH PRODUK
========================================================= */

let original = 0;
let pedas = 0;


/* =========================================================
   AMBIL DATA DARI URL
========================================================= */

function getInitialQuantity() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    original =
        Math.max(
            0,
            parseInt(
                params.get("original") || "0",
                10
            )
        );


    pedas =
        Math.max(
            0,
            parseInt(
                params.get("pedas") || "0",
                10
            )
        );

}


/* =========================================================
   ELEMENT
========================================================= */

const qtyOriginal =
    document.getElementById(
        "qty-original"
    );

const qtyPedas =
    document.getElementById(
        "qty-pedas"
    );

const sumOriginal =
    document.getElementById(
        "sum-original"
    );

const sumPedas =
    document.getElementById(
        "sum-pedas"
    );

const totalPack =
    document.getElementById(
        "total-pack"
    );

const hargaPack =
    document.getElementById(
        "harga-pack"
    );

const totalHarga =
    document.getElementById(
        "total-harga"
    );

const bottomTotal =
    document.getElementById(
        "bottom-total"
    );

const estimasiBerat =
    document.getElementById(
        "estimasi-berat"
    );

const promoMessage =
    document.getElementById(
        "promo-message"
    );


/* =========================================================
   HARGA
========================================================= */

function getHarga(total) {

    if (total >= PROMO_MIN_QTY) {

        return PROMO_PRICE;

    }

    return NORMAL_PRICE;

}


/* =========================================================
   UPDATE SUMMARY
========================================================= */

function updateSummary() {

    const total =
        original + pedas;


    const harga =
        getHarga(total);


    const totalBayar =
        total * harga;


    const berat =
        total * KG_PER_PACK;


    /* Quantity */

    if (qtyOriginal) {

        qtyOriginal.textContent =
            original;

    }


    if (qtyPedas) {

        qtyPedas.textContent =
            pedas;

    }


    /* Summary */

    if (sumOriginal) {

        sumOriginal.textContent =
            original + " Pack";

    }


    if (sumPedas) {

        sumPedas.textContent =
            pedas + " Pack";

    }


    if (totalPack) {

        totalPack.textContent =
            total;

    }


    if (hargaPack) {

        hargaPack.textContent =
            "HK$" + harga;

    }


    if (totalHarga) {

        totalHarga.textContent =
            "HK$" + totalBayar;

    }


    if (bottomTotal) {

        bottomTotal.textContent =
            "HK$" + totalBayar;

    }


    if (estimasiBerat) {

        estimasiBerat.textContent =
            berat.toFixed(1) + " Kg";

    }


    /* =====================================================
       PROMO
    ===================================================== */

    if (promoMessage) {

        if (total >= PROMO_MIN_QTY) {

            promoMessage.innerHTML =
                '<i class="fa-solid fa-circle-check"></i> ' +
                'Promo aktif! Semua pesanan mendapatkan ' +
                '<strong>HK$10 / Pack</strong>.';

            promoMessage.classList.add(
                "active"
            );

        } else {

            const kurang =
                PROMO_MIN_QTY - total;

            promoMessage.innerHTML =
                '<i class="fa-solid fa-tag"></i> ' +
                'Tambah <strong>' +
                kurang +
                ' Pack</strong> lagi untuk mendapatkan ' +
                'harga promo HK$10 / Pack.';

            promoMessage.classList.remove(
                "active"
            );

        }

    }

}


/* =========================================================
   TAMBAH / KURANG
========================================================= */

const plusOriginal =
    document.getElementById(
        "plus-original"
    );

const minusOriginal =
    document.getElementById(
        "minus-original"
    );

const plusPedas =
    document.getElementById(
        "plus-pedas"
    );

const minusPedas =
    document.getElementById(
        "minus-pedas"
    );


if (plusOriginal) {

    plusOriginal.addEventListener(
        "click",
        function () {

            original++;

            updateSummary();

        }
    );

}


if (minusOriginal) {

    minusOriginal.addEventListener(
        "click",
        function () {

            if (original > 0) {

                original--;

                updateSummary();

            }

        }
    );

}


if (plusPedas) {

    plusPedas.addEventListener(
        "click",
        function () {

            pedas++;

            updateSummary();

        }
    );

}


if (minusPedas) {

    minusPedas.addEventListener(
        "click",
        function () {

            if (pedas > 0) {

                pedas--;

                updateSummary();

            }

        }
    );

}


/* =========================================================
   ORDER ID
========================================================= */

function generateOrderId() {

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            now.getDate()
        ).padStart(2, "0");


    const random =
        Math.floor(
            1000 +
            Math.random() * 9000
        );


    return (
        "AA-" +
        year +
        month +
        day +
        "-" +
        random
    );

}


/* =========================================================
   KIRIM KE GOOGLE SHEETS
========================================================= */

function kirimOrder(
    data,
    orderId
) {

    let iframe =
        document.getElementById(
            "hidden_iframe"
        );


    if (!iframe) {

        iframe =
            document.createElement(
                "iframe"
            );

        iframe.name =
            "hidden_iframe";

        iframe.id =
            "hidden_iframe";

        iframe.style.display =
            "none";

        document.body.appendChild(
            iframe
        );

    }


    const form =
        document.createElement(
            "form"
        );


    form.method =
        "POST";


    form.action =
        API_URL;


    form.target =
        "hidden_iframe";


    for (
        const key in data
    ) {

        const input =
            document.createElement(
                "input"
            );


        input.type =
            "hidden";


        input.name =
            key;


        input.value =
            data[key];


        form.appendChild(
            input
        );

    }


    document.body.appendChild(
        form
    );


    form.submit();


    setTimeout(
        function () {

            if (
                form.parentNode
            ) {

                form.parentNode.removeChild(
                    form
                );

            }

        },
        1000
    );


    /* =====================================================
       WHATSAPP
    ===================================================== */

    const pesanWA =
`Halo Anna Amui,

Saya ingin memesan Manisan Mangga.

--------------------------------
*ORDER ID: ${orderId}*
--------------------------------

Original : ${data.original} Pack
Pedas : ${data.pedas} Pack

--------------------------------

Total : ${data.totalPack} Pack
Harga : HK$${data.harga}/Pack
Total Barang : HK$${data.totalBayar}

Estimasi Berat : ${data.berat} Kg

--------------------------------

Nama : ${data.nama}
Nomor WhatsApp : ${data.nomor}
Tempat Pengambilan : ${data.lokasi}

Catatan :
${data.catatan || "-"}

Terima kasih.`;


    const url =
        "https://wa.me/" +
        WA_NUMBER +
        "?text=" +
        encodeURIComponent(
            pesanWA
        );


    setTimeout(
        function () {

            window.location.href =
                url;

        },
        500
    );

}


/* =========================================================
   CHECKOUT
========================================================= */

const checkoutBtn =
    document.getElementById(
        "checkoutBtn"
    );


if (checkoutBtn) {

    checkoutBtn.addEventListener(
        "click",
        function () {

            const namaInput =
                document.getElementById(
                    "nama"
                );

            const nomorInput =
                document.getElementById(
                    "nomor"
                );

            const lokasiInput =
                document.getElementById(
                    "pickup"
                );

            const catatanInput =
                document.getElementById(
                    "catatan"
                );


            const nama =
                namaInput.value.trim();


            const nomor =
                nomorInput.value.trim();


            const lokasi =
                lokasiInput.value;


            const catatan =
                catatanInput.value.trim();


            const total =
                original + pedas;


            /* =================================================
               VALIDASI
            ================================================== */

            if (total === 0) {

                alert(
                    "Silakan pilih minimal 1 Pack."
                );

                return;

            }


            if (!nama) {

                alert(
                    "Nama penerima belum diisi."
                );

                namaInput.focus();

                return;

            }


            if (!nomor) {

                alert(
                    "Nomor WhatsApp belum diisi."
                );

                nomorInput.focus();

                return;

            }


            if (!lokasi) {

                alert(
                    "Silakan pilih tempat pengambilan."
                );

                lokasiInput.focus();

                return;

            }


            /* =================================================
               HITUNG
            ================================================== */

            const harga =
                getHarga(total);


            const totalBayar =
                total * harga;


            const berat =
                total * KG_PER_PACK;


            const orderId =
                generateOrderId();


            /* =================================================
               DATA
            ================================================== */

            const data = {

                nama:
                    nama,

                nomor:
                    nomor,

                original:
                    original,

                pedas:
                    pedas,

                totalPack:
                    total,

                harga:
                    harga,

                totalBayar:
                    totalBayar,

                berat:
                    berat.toFixed(1),

                lokasi:
                    lokasi,

                catatan:
                    catatan,

                idOrder:
                    orderId

            };


            /* =================================================
               BUTTON
            ================================================== */

            checkoutBtn.disabled =
                true;


            checkoutBtn.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';


            /* =================================================
               KIRIM
            ================================================== */

            kirimOrder(
                data,
                orderId
            );

        }
    );

}


/* =========================================================
   INIT
========================================================= */

getInitialQuantity();

updateSummary();
