/*==================================================
SHIPPING.JS - Anna Amui Shop
==================================================*/

"use strict";

const BERAT_PER_PACK = 0.2;   // 1 Pack = 0.2 Kg
const ONGKIR_PER_KG = 33;     // HK$33 / Kg

function updateShipping() {
    const totalPackEl = document.getElementById("total-pack");
    const beratEl = document.getElementById("estimasi-berat");
    const ongkirEl = document.getElementById("estimasi-ongkir");
    const tipsEl = document.getElementById("shipping-tips");

    if (!totalPackEl || !beratEl || !ongkirEl) return;

    const totalPack = parseInt(totalPackEl.textContent) || 0;

    if (totalPack === 0) {
        beratEl.textContent = "0 Kg";
        ongkirEl.textContent = "HK$0";

        if (tipsEl) {
            tipsEl.innerHTML = "📦 Tambahkan produk untuk melihat estimasi berat dan ongkir.";
        }
        return;
    }

    const berat = totalPack * BERAT_PER_PACK;
    const ongkir = Math.ceil(berat) * ONGKIR_PER_KG;

    beratEl.textContent = "±" + berat.toFixed(1) + " Kg";
    ongkirEl.textContent = "HK$" + ongkir;

    if (tipsEl) {
        const targetPack = Math.ceil(totalPack / 5) * 5;
        const sisa = targetPack - totalPack;

        if (sisa === 0) {
            tipsEl.innerHTML = "✅ <b>Pas!</b> Berat sekitar <b>" + (targetPack / 5) + " Kg</b>. Ongkir paling efisien.";
        } else {
            tipsEl.innerHTML = "💡 Tambah <b>" + sisa + " Pack</b> lagi agar mencapai <b>" + (targetPack / 5) + " Kg</b> dan ongkir lebih efisien.";
        }
    }
}

updateShipping();
setInterval(updateShipping, 200);
