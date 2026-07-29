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
// FUNGSI GENERATE ORDER ID
// =======================
function generateOrderIdJS() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    // Angka acak 4 digit
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    
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

    // 1. Generate Order ID Tunggal
    const orderId = generateOrderIdJS();

    const data = {
        orderId: orderId,
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
// KIRIM ORDER (Metode Hidden Form & Target Iframe)
// =======================

function kirimOrder(data){

    // 1. Buat iframe rahasia agar browser tidak merestart/reload halaman
    let iframe = document.getElementById("hidden_iframe");
    if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.name = "hidden_iframe";
        iframe.id = "hidden_iframe";
        iframe.style.display = "none";
        document.body.appendChild(iframe);
    }

    // 2. Buat Form Tersembunyi
    const form = document.createElement("form");
    form.method = "POST";
    form.action = API_URL;
    form.target = "hidden_iframe";

    for (const key in data) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = data[key];
        form.appendChild(input);
    }

    document.body.appendChild(form);

    // 3. Kirim Form ke Google Sheets (Tidak terkena blokir CORS)
    form.submit();

    // Hapus form setelah terkirim
    setTimeout(function(){
        document.body.removeChild(form);
    }, 500);

    // 4. Format Pesan WhatsApp dengan Order ID yang SAMA PERSIS
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

    // 5. Buka WhatsApp
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesanWA)}`;
    window.location.href = url;
}
