/*==================================================
CHECKOUT.JS
Anna Amui Shop
==================================================*/

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
// BUTTON ORIGINAL
// =========================

document
.getElementById("plus-original")
.onclick = function(){

original++;

update();

};

document
.getElementById("minus-original")
.onclick = function(){

if(original>0){

original--;

update();

}

};


// =========================
// BUTTON PEDAS
// =========================

document
.getElementById("plus-pedas")
.onclick=function(){

pedas++;

update();

};

document
.getElementById("minus-pedas")
.onclick=function(){

if(pedas>0){

pedas--;

update();

}

};


// =========================
// UPDATE
// =========================

function update(){

const total = original + pedas;

let harga = 13;

if(total >= 3){

harga = 12;

}

const bayar = total * harga;


// update qty

qtyOriginal.innerHTML = original;
qtyPedas.innerHTML = pedas;


// summary

sumOriginal.innerHTML = original + " Pack";
sumPedas.innerHTML = pedas + " Pack";

totalPack.innerHTML = total;

hargaPack.innerHTML = "HK$" + harga;

totalHarga.innerHTML = "HK$" + bayar;

bottomTotal.innerHTML = "HK$" + bayar;

}


// =========================
// CHECKOUT
// =========================

document
.getElementById("checkoutBtn")
.onclick=function(){

const nama =
document.getElementById("nama").value.trim();

const nomor =
document.getElementById("nomor").value.trim();

const alamat =
document.getElementById("pickup").value;

const catatan =
document.getElementById("catatan").value.trim();


const total = original + pedas;


if(total==0){

alert("Silakan pilih jumlah pesanan.");

return;

}


if(nama==""){

alert("Nama penerima belum diisi.");

return;

}


if(nomor==""){

alert("Nomor WhatsApp belum diisi.");

return;

}


if(alamat==""){

alert("Alamat pengambilan belum diisi.");

return;

}


let harga = 13;

if(total>=3){

harga=12;

}

const bayar = total*harga;


// =========================
// FORMAT PESAN
// =========================

let pesan =

`Halo Anna Amui,

Saya ingin memesan Manisan Mangga.

--------------------------------

Original : ${original} Pack

Pedas : ${pedas} Pack

--------------------------------

Total : ${total} Pack

Harga : HK$${harga}/Pack

Total Bayar : HK$${bayar}

--------------------------------

Nama : ${nama}

Nomor WhatsApp : ${nomor}

Tempat Pengambilan : ${alamat}

Catatan :
${catatan || "-"}

Terima kasih.`;

// =========================

const wa = "6287862201153";

const url =
`https://wa.me/${wa}?text=${encodeURIComponent(pesan)}`;

window.open(url,"_blank");

};


// pertama kali
update();
