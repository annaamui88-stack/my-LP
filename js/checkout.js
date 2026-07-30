// =======================
// CHECKOUT (LENGKAP DENGAN PROTEKSI & RESET FORM)
// =======================

document.getElementById("checkoutBtn").addEventListener("click", function(){

    const btnCheckout = document.getElementById("checkoutBtn");

    const namaInput = document.getElementById("nama");
    const nomorInput = document.getElementById("nomor");
    const lokasiInput = document.getElementById("pickup");
    const catatanInput = document.getElementById("catatan");

    const nama = namaInput.value.trim();
    const nomor = nomorInput.value.trim();
    const lokasi = lokasiInput.value;
    const catatan = catatanInput.value.trim();

    const total = original + pedas;

    if(total === 0){
        alert("Silakan pilih minimal 1 Pack.");
        return;
    }

    if(nama === ""){
        alert("Nama penerima belum diisi.");
        namaInput.focus();
        return;
    }

    if(nomor === ""){
        alert("Nomor WhatsApp belum diisi.");
        nomorInput.focus();
        return;
    }

    if(lokasi === ""){
        alert("Silakan pilih tempat pengambilan.");
        lokasiInput.focus();
        return;
    }

    // 1. MATIKAN TOMBOL AGAR TIDAK BISA DIKLIK 2 KALI
    btnCheckout.disabled = true;
    btnCheckout.textContent = "Memproses...";

    const harga = getHarga(total);
    const totalBayar = total * harga;

    const data = {
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

    // 2. BERSIHKAN FORMULIR INPUT
    namaInput.value = "";
    nomorInput.value = "";
    lokasiInput.selectedIndex = 0; // Kembalikan opsi pilihan ke default
    catatanInput.value = "";

    // 3. BERSIHKAN HITUNGAN PACK & HITUNG ULANG TOTAL (BERSIH TOTAL)
    original = 0;
    pedas = 0;
    updateSummary();

    // 4. KIRIM ORDER KE GOOGLE SHEETS & WA
    kirimOrder(data);
});

// =======================
// KIRIM ORDER
// =======================

function kirimOrder(data){

    // Kirim data ke Google Sheets di background (via Hidden Form)
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

    // Buat Order ID khusus WhatsApp
    const orderIdWA = generateWAOrderId();

    // Buat Format Pesan WhatsApp
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

    // Buka WhatsApp
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesanWA)}`;
    
    // Beri jeda sedikit lalu buka WA agar tombol kembali aktif jika pengguna menekan tombol Back
    setTimeout(function(){
        const btnCheckout = document.getElementById("checkoutBtn");
        if(btnCheckout) {
            btnCheckout.disabled = false;
            btnCheckout.textContent = "Kirim Order via WhatsApp";
        }
        window.location.href = url;
    }, 300);
}
