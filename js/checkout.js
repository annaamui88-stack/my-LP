/* =========================================================
   CHECKOUT.JS - ANNA AMUI
   Produk → Checkout → WhatsApp
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

const PACK_WEIGHT = 0.2;
const SHIPPING_PER_KG = 33;


/* =========================================================
   AMBIL DATA PRODUK
========================================================= */

let orderData = null;


function getCheckoutData() {

    try {

        const data =
            localStorage.getItem(
                "annaAmuiCheckout"
            );


        if (!data) {

            return null;

        }


        return JSON.parse(data);

    } catch (error) {

        console.error(
            "Gagal membaca data checkout:",
            error
        );

        return null;

    }

}



/* =========================================================
   DATA PESANAN
========================================================= */

function loadOrder() {

    orderData =
        getCheckoutData();


    if (!orderData) {

        alert(
            "Pesanan belum dipilih. Silakan pilih produk terlebih dahulu."
        );


        window.location.href =
            "produk.html";

        return false;

    }


    return true;

}



/* =========================================================
   HARGA
========================================================= */

function getPrice(quantity) {

    return quantity >= PROMO_MIN_QTY
        ? PROMO_PRICE
        : NORMAL_PRICE;

}



/* =========================================================
   UPDATE CHECKOUT
========================================================= */

function updateCheckout() {

    if (!orderData) {
        return;
    }


    const quantity =
        Number(orderData.quantity || 0);


    const variant =
        orderData.variant || "original";


    const price =
        getPrice(quantity);


    const subtotal =
        quantity * price;


    const berat =
        quantity * PACK_WEIGHT;


    const ongkir =
        berat * SHIPPING_PER_KG;



    /* ==============================================
       PRODUK
    ============================================== */

    const productContainer =
        document.getElementById(
            "checkout-product"
        );


    if (productContainer) {

        const variantName =
            variant === "pedas"
                ? "Pedas"
                : "Original";


        productContainer.innerHTML = `

            <div class="checkout-product-item">

                <div class="checkout-product-info">

                    <h3>
                        Manisan Mangga Anna Amui
                    </h3>

                    <p>
                        Varian:
                        <strong>
                            ${variantName}
                        </strong>
                    </p>

                </div>

                <div class="checkout-product-quantity">

                    ${quantity} Pack

                </div>

            </div>

        `;

    }



    /* ==============================================
       SUMMARY
    ============================================== */

    const summaryProduct =
        document.getElementById(
            "summary-product"
        );


    const summaryVariant =
        document.getElementById(
            "summary-variant"
        );


    const summaryQuantity =
        document.getElementById(
            "summary-quantity"
        );


    const summaryPrice =
        document.getElementById(
            "summary-price"
        );


    const summaryTotal =
        document.getElementById(
            "summary-total"
        );


    const beratElement =
        document.getElementById(
            "estimasi-berat"
        );


    const ongkirElement =
        document.getElementById(
            "estimasi-ongkir"
        );


    if (summaryProduct) {

        summaryProduct.textContent =
            "Manisan Mangga";

    }


    if (summaryVariant) {

        summaryVariant.textContent =
            variant === "pedas"
                ? "Pedas"
                : "Original";

    }


    if (summaryQuantity) {

        summaryQuantity.textContent =
            quantity + " Pack";

    }


    if (summaryPrice) {

        summaryPrice.textContent =
            "HK$" + price;

    }


    if (summaryTotal) {

        summaryTotal.textContent =
            "HK$" + subtotal;

    }


    if (beratElement) {

        beratElement.textContent =
            berat.toFixed(1) + " Kg";

    }


    if (ongkirElement) {

        ongkirElement.textContent =
            "HK$" + ongkir.toFixed(0);

    }

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


    const random =
        Math.floor(
            1000 +
            Math.random() * 9000
        );


    return `AA-${year}${month}${day}-${random}`;

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


            if (!orderData) {

                alert(
                    "Data pesanan tidak ditemukan."
                );

                return;

            }


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


            /* =========================================
               VALIDASI
            ========================================= */

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



            /* =========================================
               DATA PESANAN
            ========================================= */

            const quantity =
                Number(
                    orderData.quantity
                );


            const variant =
                orderData.variant;


            const price =
                getPrice(quantity);


            const totalBayar =
                quantity * price;


            const berat =
                quantity * PACK_WEIGHT;


            const ongkir =
                berat * SHIPPING_PER_KG;


            const orderId =
                generateOrderId();



            const data = {

                idOrder:
                    orderId,

                nama:
                    nama,

                nomor:
                    nomor,

                produk:
                    "Manisan Mangga Anna Amui",

                variant:
                    variant,

                quantity:
                    quantity,

                totalPack:
                    quantity,

                harga:
                    price,

                totalBayar:
                    totalBayar,

                berat:
                    berat,

                estimasiOngkir:
                    ongkir,

                lokasi:
                    lokasi,

                catatan:
                    catatan

            };



            /* =========================================
               SIMPAN KE GOOGLE SHEETS
            ========================================= */

            kirimOrder(
                data
            );

        }
    );

}



/* =========================================================
   KIRIM ORDER
========================================================= */

function kirimOrder(
    data
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



    /* =========================================
       WHATSAPP
    ========================================= */

    const variantName =
        data.variant === "pedas"
            ? "Pedas"
            : "Original";


    const pesanWA = `Halo Anna Amui,

Saya ingin memesan Manisan Mangga.

--------------------------------
*ORDER ID: ${data.idOrder}*
--------------------------------

Produk :
Manisan Mangga Anna Amui

Varian :
${variantName}

Jumlah :
${data.quantity} Pack

Harga :
HK$${data.harga} / Pack

Subtotal :
HK$${data.totalBayar}

--------------------------------

Estimasi Berat :
${data.berat.toFixed(1)} Kg

Estimasi Ongkir :
HK$${data.estimasiOngkir.toFixed(0)}

--------------------------------

Nama :
${data.nama}

Nomor WhatsApp :
${data.nomor}

Tempat Pengambilan :
${data.lokasi}

Catatan :
${data.catatan || "-"}

Terima kasih.`;



    const url =
        `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
            pesanWA
        )}`;



    setTimeout(
        function () {

            window.location.href =
                url;

        },
        500
    );

}



/* =========================================================
   INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        if (
            loadOrder()
        ) {

            updateCheckout();

        }

    }
);
