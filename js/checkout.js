/*==================================================
CHECKOUT.JS - Anna Amui Shop (Updated with ID Order)
==================================================*/

const API_URL = "https://script.google.com/macros/s/AKfycbx4I5aN54TNXEY0hXPc88xJpiRpoPAwUMufmdQbmF6UnFBv6ZQ4JNOBvpUi0SOdpYSk/exec";
const WA_NUMBER = "6287862201153";

let original = 0;
let pedas = 0;

const qtyOriginal = document.getElementById("qty-original");
const qtyPedas = document.getElementById("qty-pedas");
const sumOriginal = document.getElementById("sum-original");
const sumPedas = document.getElementById("sum-pedas");
const totalPack = document.getElementById("total-pack");
const hargaPack = document.getElementById("harga-pack");
const totalHarga = document.getElementById("total-harga");
const bottomTotal = document.getElementById("bottom-total");

function getHarga(total){
    return total >= 3 ? 12 : 13;
}

function updateSummary(){
    const total = original + pedas;
    const harga = getHarga(total);
    const bayar = total * harga;

    if(qtyOriginal) qtyOriginal.textContent = original;
    if(qtyPedas) qtyPedas.textContent = pedas;
    if(sumOriginal) sumOriginal.textContent = original + " Pack";
    if(sumPedas) sumPedas.textContent = pedas + " Pack";
    if(totalPack) totalPack.textContent = total;
    if(hargaPack) hargaPack.textContent = "HK$" + harga;
    if(totalHarga) totalHarga.textContent = "HK$" + bayar;
    if(bottomTotal) bottomTotal.textContent = "HK$" + bayar;
}

const plusOrig = document.getElementById("plus-original");
const minusOrig = document.getElementById("minus-original");
const plusPedas = document.getElementById("plus-pedas");
const minusPedas = document.getElementById("minus-pedas");

if(plusOrig) plusOrig.addEventListener("click", function(){ original++; updateSummary(); });
if(minusOrig) minusOrig.addEventListener("click", function(){ if(original > 0){ original--; updateSummary(); } });
if(plusPedas) plusPedas.addEventListener("click", function(){ pedas++; updateSummary(); });
if(minusPedas) minusPedas.addEventListener("click", function(){ if(pedas > 0){ pedas--; updateSummary(); } });

updateSummary();

function generateWAOrderId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `AA-${year}${month}${day}-${randomNum}`;
}

const checkoutBtn = document.getElementById("checkoutBtn");
if(checkoutBtn) {
    checkoutBtn.addEventListener("click", function(){
        const namaInput = document.getElementById("nama");
        const nomorInput = document.getElementById("nomor");
        const lokasiInput = document.getElementById("pickup");
        const catatanInput = document.getElementById("catatan");

        const nama = namaInput.value.trim();
        const nomor = nomorInput.value.trim();
        const lokasi = lokasiInput.value;
        const catatan = catatanInput.value.trim();

        const total = original + pedas;

        if(total === 0){ alert("Silakan pilih minimal 1 Pack."); return; }
        if(nama === ""){ alert("Nama penerima belum diisi."); namaInput.focus(); return; }
        if(nomor === ""){ alert("Nomor WhatsApp belum diisi."); nomorInput.focus(); return; }
        if(lokasi === ""){ alert("Silakan pilih tempat pengambilan."); lokasiInput.focus(); return; }

        checkoutBtn.disabled = true;
        checkoutBtn.textContent = "Memproses...";

        const harga = getHarga(total);
        const totalBayar = total * harga;
        
        // Generate ID Order unik di sini agar sama antara yang masuk ke Sheet dan WhatsApp
        const currentOrderId = generateWAOrderId();

        const data = {
            nama: nama,
            nomor: nomor,
            original: original,
            pedas: pedas,
            totalPack: total,
            harga: harga,
            totalBayar: totalBayar,
            lokasi: lokasi,
            catatan: catatan,
            idOrder: currentOrderId // <-- Ditambahkan agar terkirim ke Google Apps Script
        };

        // Reset Form
        namaInput.value = "";
        nomorInput.value = "";
        lokasiInput.selectedIndex = 0;
        catatanInput.value = "";
        original = 0;
        pedas = 0;
        updateSummary();

        kirimOrder(data, currentOrderId);
    });
}

function kirimOrder(data, orderIdWA){
    let iframe = document.getElementById("hidden_iframe");
    if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.name = "hidden_iframe";
        iframe.id = "hidden_iframe";
        iframe.style.display = "none";
        document.body.appendChild(iframe);
    }

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
    form.submit();

    setTimeout(function(){
        document.body.removeChild(form);
    }, 500);

    const pesanWA = `Halo Anna Amui,

Saya ingin memesan Manisan Mangga.

--------------------------------
*ORDER ID: ${orderIdWA}*
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

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesanWA)}`;
    
    setTimeout(function(){
        const btnCheckout = document.getElementById("checkoutBtn");
        if(btnCheckout) {
            btnCheckout.disabled = false;
            btnCheckout.textContent = "Kirim Order via WhatsApp";
        }
        window.location.href = url;
    }, 300);
}
