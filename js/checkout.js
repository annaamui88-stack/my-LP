/* =========================================================
   CHECKOUT.JS - ANNA AMUI
   FINAL VERSION
   Produk → Checkout → Google Sheets → WhatsApp
========================================================= */

"use strict";


/* =========================================================
   KONFIGURASI
========================================================= */

const API_URL =
    "https://script.google.com/macros/s/AKfycbxaL7XqgyEWnqr9VxsoHS4-gr3pLEssFxeiDl0MSJyqKUbk3sfiR0u1OYPBc9y15VMh/exec";

const WA_NUMBER =
    "6287862201153";


/* =========================================================
   HARGA PRODUK
========================================================= */

const NORMAL_PRICE = 12;
const PROMO_PRICE = 10;
const PROMO_MIN_QTY = 3;


/* =========================================================
   BERAT PRODUK
   5 PACK = 1 KG
========================================================= */

const KG_PER_PACK = 0.2;


/* =========================================================
   STATE
========================================================= */

let original = 0;
let pedas = 0;


/* =========================================================
   HELPER
========================================================= */

function getElement(id) {
    return document.getElementById(id);
}


function safeNumber(value) {
    const number = parseInt(value, 10);

    if (isNaN(number) || number < 0) {
        return 0;
    }

    return number;
}


/* =========================================================
   AMBIL JUMLAH DARI URL
========================================================= */

function getInitialQuantity() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    original =
        safeNumber(
            params.get("original")
        );


    pedas =
        safeNumber(
            params.get("pedas")
        );

}


/* =========================================================
   HITUNG TOTAL PACK
========================================================= */

function getTotalPack() {

    return original + pedas;

}


/* =========================================================
   HITUNG HARGA
========================================================= */

function getHarga(total) {

    return total >= PROMO_MIN_QTY
        ? PROMO_PRICE
        : NORMAL_PRICE;

}


/* =========================================================
   HITUNG TOTAL HARGA
========================================================= */

function getTotalHarga(total) {

    return total * getHarga(total);

}


/* =========================================================
   HITUNG BERAT
========================================================= */

function getBerat(total) {

    return total * KG_PER_PACK;

}


/* =========================================================
   UPDATE URL
========================================================= */

function updateUrl() {

    const total =
        getTotalPack();


    const url =
        new URL(
            window.location.href
        );


    if (total > 0) {

        url.searchParams.set(
            "original",
            original
        );

        url.searchParams.set(
            "pedas",
            pedas
        );

    } else {

        url.searchParams.delete(
            "original"
        );

        url.searchParams.delete(
            "pedas"
        );

    }


    window.history.replaceState(
        {},
        "",
        url
    );

}


/* =========================================================
   UPDATE RINGKASAN
========================================================= */

function updateSummary() {

    const total =
        getTotalPack();


    const harga =
        getHarga(total);


    const totalHarga =
        getTotalHarga(total);


    const berat =
        getBerat(total);


    /* =====================================================
       ELEMENT
    ===================================================== */

    const qtyOriginal =
        getElement("qty-original");

    const qtyPedas =
        getElement("qty-pedas");

    const sumOriginal =
        getElement("sum-original");

    const sumPedas =
        getElement("sum-pedas");

    const totalPack =
        getElement("total-pack");

    const hargaPack =
        getElement("harga-pack");

    const totalHargaElement =
        getElement("total-harga");

    const bottomTotal =
        getElement("bottom-total");

    const estimasiBerat =
        getElement("estimasi-berat");

    const promoMessage =
        getElement("promo-message");


    /* =====================================================
       JUMLAH
    ===================================================== */

    if (qtyOriginal) {

        qtyOriginal.textContent =
            original;

    }


    if (qtyPedas) {

        qtyPedas.textContent =
            pedas;

    }


    /* =====================================================
       RINGKASAN
    ===================================================== */

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


    if (totalHargaElement) {

        totalHargaElement.textContent =
            "HK$" + totalHarga;

    }


    if (bottomTotal) {

        bottomTotal.textContent =
            "HK$" + totalHarga;

    }


    if (estimasiBerat) {

        estimasiBerat.textContent =
            berat.toFixed(1) + " Kg";

    }


    /* =====================================================
       PESAN PROMO
    ===================================================== */

    if (promoMessage) {

        if (total === 0) {

            promoMessage.innerHTML =
                '<i class="fa-solid fa-tag"></i> ' +
                'Beli 3 Pack atau lebih untuk mendapatkan ' +
                'harga <strong>HK$10 / Pack</strong>.';

            promoMessage.classList.remove(
                "active"
            );

        }

        else if (total >= PROMO_MIN_QTY) {

            promoMessage.innerHTML =
                '<i class="fa-solid fa-circle-check"></i> ' +
                'Promo aktif! Semua pesanan mendapatkan ' +
                '<strong>HK$10 / Pack</strong>.';

            promoMessage.classList.add(
                "active"
            );

        }

        else {

            const kurang =
                PROMO_MIN_QTY - total;


            promoMessage.innerHTML =
                '<i class="fa-solid fa-tag"></i> ' +
                'Tambah <strong>' +
                kurang +
                ' Pack</strong> lagi untuk mendapatkan ' +
                'harga <strong>HK$10 / Pack</strong>.';

            promoMessage.classList.remove(
                "active"
            );

        }

    }


    /* =====================================================
       SIMPAN JUMLAH DI URL
    ===================================================== */

    updateUrl();

}


/* =========================================================
   TAMBAH ORIGINAL
========================================================= */

const plusOriginal =
    getElement("plus-original");


if (plusOriginal) {

    plusOriginal.addEventListener(
        "click",
        function () {

            original++;

            updateSummary();

        }
    );

}


/* =========================================================
   KURANG ORIGINAL
========================================================= */

const minusOriginal =
    getElement("minus-original");


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


/* =========================================================
   TAMBAH PEDAS
========================================================= */

const plusPedas =
    getElement("plus-pedas");


if (plusPedas) {

    plusPedas.addEventListener(
        "click",
        function () {

            pedas++;

            updateSummary();

        }
    );

}


/* =========================================================
   KURANG PEDAS
========================================================= */

const minusPedas =
    getElement("minus-pedas");


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
   GENERATE ORDER ID
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


    const hours =
        String(
            now.getHours()
        ).padStart(2, "0");


    const minutes =
        String(
            now.getMinutes()
        ).padStart(2, "0");


    const random =
        Math.floor(
            100 +
            Math.random() * 900
        );


    return (
        "AA-" +
        year +
        month +
        day +
        "-" +
        hours +
        minutes +
        "-" +
        random
    );

}


/* =========================================================
   NORMALISASI NOMOR WHATSAPP
========================================================= */

function normalizePhone(phone) {

    return phone
        .replace(/\s+/g, "")
        .replace(/-/g, "")
        .replace(/\+/g, "");

}


/* =========================================================
   VALIDASI NOMOR WHATSAPP
========================================================= */

function isValidPhone(phone) {

    const normalized =
        normalizePhone(phone);


    /*
     * Format Hong Kong:
     * 8 digit
     */

    return /^\d{8}$/.test(
        normalized
    );

}


/* =========================================================
   KIRIM DATA KE GOOGLE SHEETS
========================================================= */

function kirimOrder(
    data
) {

    let iframe =
        getElement(
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


    /*
     * Tambahkan semua data
     */

    Object.keys(data).forEach(
        function (key) {

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
    );


    document.body.appendChild(
        form
    );


    form.submit();


    /*
     * Bersihkan form
     */

    setTimeout(
        function () {

            if (form.parentNode) {

                form.parentNode.removeChild(
                    form
                );

            }

        },
        1500
    );

}


/* =========================================================
   BUAT PESAN WHATSAPP
========================================================= */

function buatPesanWhatsApp(
    data
) {

    return `Halo Anna Amui,

Saya ingin memesan Manisan Mangga.

━━━━━━━━━━━━━━━━━━━━
*ORDER ID: ${data.idOrder}*
━━━━━━━━━━━━━━━━━━━━

*DETAIL PESANAN*

Original : ${data.original} Pack
Pedas : ${data.pedas} Pack

Total : ${data.totalPack} Pack
Harga : HK$${data.harga} / Pack

*Total Barang : HK$${data.totalBayar}*

Estimasi Berat : ${data.berat} Kg

━━━━━━━━━━━━━━━━━━━━
*DATA PENERIMA*
━━━━━━━━━━━━━━━━━━━━

Nama : ${data.nama}
WhatsApp : ${data.nomor}
Tempat Pengambilan : ${data.lokasi}

Catatan :
${data.catatan || "-"}

Terima kasih.`;
}


/* =========================================================
   BUKA WHATSAPP
========================================================= */

function bukaWhatsApp(
    data
) {

    const pesan =
        buatPesanWhatsApp(
            data
        );


    const url =
        "https://wa.me/" +
        WA_NUMBER +
        "?text=" +
        encodeURIComponent(
            pesan
        );


    window.location.href =
        url;

}


/* =========================================================
   CHECKOUT
========================================================= */

const checkoutBtn =
    getElement(
        "checkoutBtn"
    );


if (checkoutBtn) {

    checkoutBtn.addEventListener(
        "click",
        function () {

            /* =================================================
               CEGAH DOUBLE CLICK
            ================================================= */

            if (
                checkoutBtn.disabled
            ) {

                return;

            }


            /* =================================================
               ELEMENT FORM
            ================================================= */

            const namaInput =
                getElement(
                    "nama"
                );

            const nomorInput =
                getElement(
                    "nomor"
                );

            const lokasiInput =
                getElement(
                    "pickup"
                );

            const catatanInput =
                getElement(
                    "catatan"
                );


            /* =================================================
               AMBIL DATA
            ================================================= */

            const nama =
                namaInput
                    ? namaInput.value.trim()
                    : "";


            const nomorRaw =
                nomorInput
                    ? nomorInput.value.trim()
                    : "";


            const nomor =
                normalizePhone(
                    nomorRaw
                );


            const lokasi =
                lokasiInput
                    ? lokasiInput.value
                    : "";


            const catatan =
                catatanInput
                    ? catatanInput.value.trim()
                    : "";


            /* =================================================
               TOTAL
            ================================================= */

            const total =
                getTotalPack();


            /* =================================================
               VALIDASI PRODUK
            ================================================= */

            if (total === 0) {

                alert(
                    "Silakan pilih minimal 1 Pack."
                );

                return;

            }


            /* =================================================
               VALIDASI NAMA
            ================================================= */

            if (!nama) {

                alert(
                    "Nama penerima belum diisi."
                );


                if (namaInput) {

                    namaInput.focus();

                }


                return;

            }


            /* =================================================
               VALIDASI NOMOR
            ================================================= */

            if (!nomor) {

                alert(
                    "Nomor WhatsApp Hong Kong belum diisi."
                );


                if (nomorInput) {

                    nomorInput.focus();

                }


                return;

            }


            if (!isValidPhone(nomor)) {

                alert(
                    "Nomor WhatsApp Hong Kong harus terdiri dari 8 digit."
                );


                if (nomorInput) {

                    nomorInput.focus();

                }


                return;

            }


            /* =================================================
               VALIDASI LOKASI
            ================================================= */

            if (!lokasi) {

                alert(
                    "Silakan pilih tempat pengambilan paket."
                );


                if (lokasiInput) {

                    lokasiInput.focus();

                }


                return;

            }


            /* =================================================
               HITUNG PESANAN
            ================================================= */

            const harga =
                getHarga(total);


            const totalBayar =
                getTotalHarga(total);


            const berat =
                getBerat(total);


            const orderId =
                generateOrderId();


            /* =================================================
               DATA ORDER
            ================================================= */

            const data = {

                idOrder:
                    orderId,

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
                    catatan

            };


            /* =================================================
               LOCK BUTTON
            ================================================= */

            checkoutBtn.disabled =
                true;


            checkoutBtn.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> ' +
                'Memproses...';


            /* =================================================
               KIRIM GOOGLE SHEETS
            ================================================= */

            kirimOrder(
                data
            );


            /* =================================================
               BUKA WHATSAPP
            ================================================= */

            setTimeout(
                function () {

                    bukaWhatsApp(
                        data
                    );

                },
                700
            );

        }
    );

}


/* =========================================================
   INIT
========================================================= */

getInitialQuantity();

updateSummary();
