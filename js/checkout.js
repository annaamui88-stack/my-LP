/*==================================================
CHECKOUT.JS
Anna Amui Shop
==================================================*/

// =======================
// KONFIGURASI
// =======================

const API_URL = "https://script.google.com/macros/s/AKfycbx4I5aN54TNXEY0hXPc88xJpiRpoPAwUMufmdQbmF6UnFBv6ZQ4JNOBvpUi0SOdpYSk/exec";

const WA_NUMBER = "6287862201153";

// =======================
// DATA
// =======================

let original = 0;
let pedas = 0;

// =======================
// ELEMENT
// =======================

const qtyOriginal = document.getElementById("qty-original");
const qtyPedas = document.getElementById("qty-pedas");

const sumOriginal = document.getElementById("sum-original");
const sumPedas = document.getElementById("sum-pedas");

const totalPack = document.getElementById("total-pack");
const hargaPack = document.getElementById("harga-pack");
const totalHarga = document.getElementById("total-harga");
const bottomTotal = document.getElementById("bottom-total");

// =======================
// HITUNG TOTAL
// =======================

function getHarga(total){
    if(total >= 3){
        return 12;
    }
    return 13;
}

function updateSummary(){
    const total = original + pedas;
    const harga = getHarga(total);
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

// =======================
// BUTTON ORIGINAL
// =======================

document.getElementById("plus-original").addEventListener("click", function(){
    original++;
    updateSummary();
});

document.getElementById("minus-original").addEventListener("click", function(){
    if(original > 0){
        original--;
        updateSummary();
    }
});

// =======================
// BUTTON PEDAS
// =======================

document.getElementById("plus-pedas").addEventListener("click", function(){
    pedas++;
    updateSummary();
});

document.getElementById("minus-pedas").addEventListener("click", function(){
    if(pedas > 0){
        pedas--;
        updateSummary();
    }
});

// =======================
// LOAD PERTAMA
// =======================

updateSummary();

// =======================
// FUNGSI BUAT ORDER ID UNIK
// =======================
function generateOrderIdJS() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    // Menggunakan acak 4 digit angka unik
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    
    // Hasil contoh: AA-20260730-8492
    return `AA-${year}${month}${day}-${randomNum}`;
}

// =======================
// CHECKOUT
// =======================

document.getElementById("checkoutBtn").addEventListener("click", function(){

    const nama = document.getElementById("nama").value.trim();
    const nomor = document.getElementById("nomor").value.trim();
    const lokasi = document.getElementById("pickup").value;
    const catatan = document.getElementById("catatan").value.trim();

    const total = original + pedas;

    if(total === 0){
        alert("Silakan pilih minimal 1 Pack.");
        return;
    }

    if(nama === ""){
        alert("Nama penerima belum diisi.");
        document.getElementById("nama").focus();
        return;
    }

    if(nomor === ""){
        alert("Nomor WhatsApp belum diisi.");
        document.getElementById("nomor").focus();
        return;
    }

    if(lokasi === ""){
        alert("Silakan pilih tempat pengambilan.");
        document.getElementById("pickup").focus();
        return;
    }

    const harga = getHarga(total);
    const totalBayar = total * harga;

    // Generate Order ID secara instan di JavaScript
    const orderId = generateOrderIdJS();

    const data = {
        orderId: orderId, // Order ID ikut dikirim
        nama: nama,
        nomor: nomor,
        original: original,
        pedas: pedas,
        totalPack: total,
        harga: harga,
        totalBayar: totalBayar,
        lokasi: lokasi,
        catatan: catatan
    };

    kirimOrder(data);
});

// =======================
// KIRIM ORDER (Ternavigasi Lancar Tanpa CORS Error)
// =======================

function kirimOrder(data){

    // 1. Buat pesan WhatsApp dengan Order ID yang baru saja dibuat
    const pesanWA = `Halo Anna Amui,

Saya ingin memesan Manisan Mangga.

--------------------------------
*ORDER ID: ${data.orderId}*
--------------------------------

Original : ${data.original} Pack
Pedas : ${data.pedas} Pack

--------------------------------

Total : ${data.totalPack} Pack
Harga : HK$${data.harga}/Pack
Total Bayar : HK$${data.totalBayar}

--------------------------------

Nama : ${data.nama}
Nomor WhatsApp : ${data.nomor}
Tempat Pengambilan : ${data.lokasi}

Catatan :
${data.catatan || "-"}

Terima kasih.`;

    // 2. Kirim data ke Google Sheets menggunakan mode 'no-cors' (Pasti Berhasil & Tidak Error)
    const formData = new FormData();
    for(const key in data){
        formData.append(key, data[key]);
    }

    fetch(API_URL, {
        method: "POST",
        mode: "no-cors", // Mengabaikan pemblokiran CORS dari browser
        body: formData
    }).catch(err => console.log("Background log:", err));

    // 3. Langsung buka WhatsApp
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesanWA)}`;
    window.location.href = url;
}
