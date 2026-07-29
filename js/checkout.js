/*==================================================
CHECKOUT.JS V2
Anna Amui Shop
==================================================*/

// =========================
// CONFIG
// =========================

const API_URL = "https://script.google.com/macros/s/AKfycbx4I5aN54TNXEY0hXPc88xJpiRpoPAwUMufmdQbmF6UnFBv6ZQ4JNOBvpUi0SOdpYSk/exec";

const WA_NUMBER = "6287862201153";

// =========================
// DATA
// =========================

let original = 0;
let pedas = 0;

// =========================
// ELEMENT
// =========================

const qtyOriginal = document.getElementById("qty-original");
const qtyPedas = document.getElementById("qty-pedas");

const sumOriginal = document.getElementById("sum-original");
const sumPedas = document.getElementById("sum-pedas");

const totalPack = document.getElementById("total-pack");
const hargaPack = document.getElementById("harga-pack");
const totalHarga = document.getElementById("total-harga");
const bottomTotal = document.getElementById("bottom-total");

// =========================
// UPDATE TOTAL
// =========================

function updateSummary(){

    const total = original + pedas;

    let harga = 13;

    if(total >= 3){
        harga = 12;
    }

    const bayar = total * harga;

    qtyOriginal.textContent = original;
    qtyPedas.textContent = pedas;

    sumOriginal.textContent = original + " Pack";
    sumPedas.textContent = pedas + " Pack";

    totalPack.textContent = total;
    hargaPack.textContent = "HK$" + harga;
    totalHarga.textContent = "HK$" + bayar;
    bottomTotal.textContent = "HK$" + bayar;

}

// =========================
// BUTTON ORIGINAL
// =========================

document.getElementById("plus-original").addEventListener("click",function(){

    original++;

    updateSummary();

});

document.getElementById("minus-original").addEventListener("click",function(){

    if(original>0){

        original--;

        updateSummary();

    }

});

// =========================
// BUTTON PEDAS
// =========================

document.getElementById("plus-pedas").addEventListener("click",function(){

    pedas++;

    updateSummary();

});

document.getElementById("minus-pedas").addEventListener("click",function(){

    if(pedas>0){

        pedas--;

        updateSummary();

    }

});

// =========================
// LOAD PERTAMA
// =========================

updateSummary();
// =========================
// CHECKOUT
// =========================

document.getElementById("checkoutBtn").addEventListener("click", function () {

    const nama = document.getElementById("nama").value.trim();
    const nomor = document.getElementById("nomor").value.trim();
    const lokasi = document.getElementById("pickup").value;
    const catatan = document.getElementById("catatan").value.trim();

    const total = original + pedas;

    if (total === 0) {
        alert("Silakan pilih minimal 1 pack.");
        return;
    }

    if (nama === "") {
        alert("Nama penerima belum diisi.");
        document.getElementById("nama").focus();
        return;
    }

    if (nomor === "") {
        alert("Nomor WhatsApp belum diisi.");
        document.getElementById("nomor").focus();
        return;
    }

    if (lokasi === "") {
        alert("Silakan pilih tempat pengambilan.");
        document.getElementById("pickup").focus();
        return;
    }

    let harga = 13;

    if (total >= 3) {
        harga = 12;
    }

    const totalBayar = total * harga;

    const pesan = `Halo Anna Amui,

Saya ingin memesan Manisan Mangga.

--------------------------------

Original : ${original} Pack
Pedas : ${pedas} Pack

--------------------------------

Total : ${total} Pack
Harga : HK$${harga}/Pack
Total Bayar : HK$${totalBayar}

--------------------------------

Nama : ${nama}
Nomor WhatsApp : ${nomor}
Tempat Pengambilan : ${lokasi}

Catatan :
${catatan || "-"}

Terima kasih.`;

    const orderData = {
        nama: nama,
        nomor: nomor,
        original: original,
        pedas: pedas,
        totalPack: total,
        harga: harga,
        totalBayar: totalBayar,
        lokasi: lokasi,
        catatan: catatan,
        pesan: pesan
    };

    kirimOrder(orderData);

});
// =========================
// KIRIM ORDER (FORM POST)
// =========================

function kirimOrder(data){

    const form = document.createElement("form");

    form.method = "POST";
    form.action = API_URL;
    form.target = "hidden_iframe";

    for (const key in data){

        if(key === "pesan") continue;

        const input = document.createElement("input");

        input.type = "hidden";
        input.name = key;
        input.value = data[key];

        form.appendChild(input);
    }

    document.body.appendChild(form);

    form.submit();

    setTimeout(function(){

        window.location.href =
        `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(data.pesan)}`;

        document.body.removeChild(form);

    },1500);

}
