/* ==========================================================================
   ANNA AMUI - MAIN PAGE JAVASCRIPT ==========================================================================

/* ==========================================================================
   1. KONFIGURASI GLOBAL
   ========================================================================== */
const ANNA_AMUI_CONFIG = {
  // Nomor WhatsApp Anna Amui (Nomor Internasional tanpa Tanda Plus)
  whatsapp: "6287862201153",

  // URL Web App Google Apps Script (SUDAH TERHUBUNG & AKTIF)
  googleScriptUrl: "https://script.google.com/macros/s/AKfycbwbW-LKbpK7VxYAMKNesIxKuViu1xMVsw9C3QgHhGrRCYCao1pIcJdOIfrDRKD9Zx8qpA/exec",

  // Key penyimpanan di LocalStorage
  cartStorageKey: "anna_amui_cart",

  // Lokalisasi Harga
  currency: "IDR",
  locale: "id-ID",

  // Konfigurasi Tarif Ongkir
  shippingRates: {
    taiwanPerKg: 80000,    // Rp80.000 per kg (ditambah ke total Rupiah)
    hongKongFlatHKD: 33    // HK$33 flat (dibayar langsung di lokasi COD)
  }
};

/* ==========================================================================
   2. UTILITAS & FORMAT HARGA
   ========================================================================== */

/**
 * Format angka menjadi Rupiah (contoh: 25000 -> Rp25.000)
 */
function formatRupiah(amount) {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat(ANNA_AMUI_CONFIG.locale, {
    style: "currency",
    currency: ANNA_AMUI_CONFIG.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

/**
 * Mengambil angka murni dari string harga
 */
function parsePrice(priceText) {
  if (!priceText) return 0;
  const number = String(priceText).replace(/[^\d]/g, "");
  return Number(number) || 0;
}

/**
 * Sanitisasi teks HTML untuk keamanan data keranjang
 */
function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Helper: Generate Unique Order ID
 * Format: AA-DDMM-XXX[KODE_NEGARA] (Contoh: AA-0109-821HK)
 * @param {string} countryName - Nama Negara ('Hong Kong', 'Taiwan', atau 'Indonesia')
 * @returns {string} Order ID unik
 */
function generateOrderID(countryName = 'Hong Kong') {
  const prefix = "AA";
  const date = new Date();
  
  // Format Tanggal & Bulan 2 digit (DDMM)
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const dateStr = `${day}${month}`;
  
  // 3 Digit Angka Acak (100 - 999)
  const randomNum = Math.floor(100 + Math.random() * 900);

  // Penentuan Kode Negara (2 Huruf)
  let countryCode = "HK";
  if (countryName === "Taiwan") {
    countryCode = "TW";
  } else if (countryName === "Indonesia") {
    countryCode = "ID";
  }

  return `${prefix}-${dateStr}-${randomNum}${countryCode}`;
}

/* ==========================================================================
   3. KERANJANG BELANJA & KALKULASI HARGA DINAMIS
   ========================================================================== */

function getCart() {
  try {
    const data = localStorage.getItem(ANNA_AMUI_CONFIG.cartStorageKey);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Gagal membaca keranjang:", error);
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(ANNA_AMUI_CONFIG.cartStorageKey, JSON.stringify(cart));
    updateCartBadge();
  } catch (error) {
    console.error("Gagal menyimpan keranjang:", error);
  }
}

function getTotalCartQuantity() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (Number(item.qty) || 0), 0);
}

/**
 * Menghitung harga unit per-pack berdasarkan TOTAL Pack di keranjang (Tiered Pricing)
 * - 1 sampai 2 pack  : Rp 25.000 / pack
 * - 3 pack atau lebih : Rp 20.000 / pack
 */
function calculateUnitPrice(totalQty) {
  return totalQty >= 3 ? 20000 : 25000;
}

/**
 * Menghitung Subtotal Harga Produk
 */
function getCartSubtotal(cart = getCart()) {
  const totalQty = getTotalCartQuantity();
  const unitPrice = calculateUnitPrice(totalQty);
  return totalQty * unitPrice;
}

/**
 * Menghitung Berat dan Ongkos Kirim Berdasarkan Negara Tujuan (HK, TW, ID)
 * Berat 1 Pack = 200 Gram
 */
function calculateWeightAndShipping(totalQty, country) {
  const totalGram = totalQty * 200;
  const totalKgExact = totalGram / 1000;
  
  // Pembulatan ke atas (misal 0.2 kg -> 1 kg, 1.2 kg -> 2 kg)
  const totalKgRounded = Math.ceil(totalKgExact) || 1;

  let shippingCost = 0;
  let shippingText = "";

  if (country === "Taiwan") {
    shippingCost = totalKgRounded * ANNA_AMUI_CONFIG.shippingRates.taiwanPerKg;
    shippingText = `${formatRupiah(shippingCost)} (${totalKgRounded} kg @Rp80.000)`;
  } else if (country === "Indonesia") {
    shippingCost = 0; // Ongkir Indonesia akan dikonfirmasi manual via WA
    shippingText = "Dikonfirmasi via WA (SPX / JNE)";
  } else {
    // Hong Kong (Default)
    shippingCost = 0; // Tidak ditambahkan ke total Rupiah
    shippingText = `HK$${ANNA_AMUI_CONFIG.shippingRates.hongKongFlatHKD} (Bayar di Tempat)`;
  }

  return {
    totalGram,
    totalKgExact,
    totalKgRounded,
    shippingCost,
    shippingText
  };
}

function updateCartBadge() {
  const totalQty = getTotalCartQuantity();
  const badgeElements = document.querySelectorAll("#global-cart-badge, .cart-badge");

  badgeElements.forEach((element) => {
    element.textContent = totalQty;
    element.style.display = totalQty > 0 ? "" : "none";
  });
}

/* ==========================================================================
   4. MODULAR COMPONENT LOADER (HEADER, FOOTER, NAV)
   ========================================================================== */

async function loadComponents() {
  const basePath = "components/";

  const components = [
    { id: "header-component", file: "header.html", altId: "app-header-container" },
    { id: "footer-component", file: "footer.html", altId: "app-footer-container" },
    { id: "navigation-component", file: "navigation.html", altId: "app-nav-container" }
  ];

  for (const comp of components) {
    const container = document.getElementById(comp.id) || (comp.altId ? document.getElementById(comp.altId) : null);
    if (container) {
      try {
        const response = await fetch(basePath + comp.file);
        if (response.ok) {
          container.innerHTML = await response.text();
        }
      } catch (error) {
        console.error(`Gagal memuat ${comp.file}:`, error);
      }
    }
  }

  initMenuEvents();
  highlightActiveNavLink();
  updateCartBadge();
}

/**
 * Event Listener Handler untuk Menu Header Drawer & Modal Popup
 */
function initMenuEvents() {
  const menuButton = document.getElementById("menu-toggle-btn") || document.querySelector(".menu-toggle-btn");
  const menuDrawer = document.getElementById("header-menu-drawer");
  const menuOverlay = document.getElementById("menu-overlay");
  const closeButton = document.getElementById("menu-close-btn") || document.querySelector(".menu-close-btn");

  if (!menuDrawer) return;

  const closeMenu = () => {
    menuDrawer.classList.remove("open");
    if (menuOverlay) menuOverlay.classList.remove("active");
  };

  const openMenu = (e) => {
    if (e) e.stopPropagation();
    menuDrawer.classList.add("open");
    if (menuOverlay) menuOverlay.classList.add("active");
  };

  if (menuButton) menuButton.onclick = openMenu;

  if (closeButton) {
    closeButton.onclick = (e) => {
      e.stopPropagation();
      closeMenu();
    };
  }

  if (menuOverlay) menuOverlay.onclick = closeMenu;
}

function highlightActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".bottom-nav .nav-item, .app-header a");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && (currentPath.endsWith(href) || (href === "index.html" && (currentPath.endsWith("/") || currentPath.endsWith("index.html"))))) {
      link.classList.add("active");
    }
  });
}

/* ==========================================================================
   5. LOGIKA HALAMAN INDEX (HOMEPAGE)
   ========================================================================== */

function initIndexPage() {
  const heroSection = document.querySelector(".home-hero");
  if (!heroSection) return;
}

/* ==========================================================================
   6. LOGIKA HALAMAN KATALOG PAKET
   ========================================================================== */

function initPaketPage() {
  const variantButtons = document.querySelectorAll(".variant-btn");
  let selectedVariant = "original";

  if (variantButtons.length > 0) {
    variantButtons.forEach((button) => {
      button.addEventListener("click", () => {
        variantButtons.forEach((btn) => btn.classList.remove("active-original", "active-pedas"));
        selectedVariant = button.getAttribute("data-variant") || "original";
        button.classList.add(selectedVariant === "original" ? "active-original" : "active-pedas");
      });
    });
  }

  const selectButtons = document.querySelectorAll(".btn-select-paket, .home-product-button");
  selectButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const card = event.currentTarget.closest(".product-card") || event.currentTarget.closest(".home-product-card");
      if (!card) return;

      const titleElement = card.querySelector(".product-title") || card.querySelector("h3");
      const imageElement = card.querySelector(".product-img") || card.querySelector("img");

      const titleText = titleElement ? titleElement.textContent.trim().toLowerCase() : "";
      const image = imageElement ? imageElement.src : "";

      let qtyToAdd = 1;
      if (titleText.includes("1 kg") || titleText.includes("5 pack")) {
        qtyToAdd = 5;
      } else if (titleText.includes("hemat") || titleText.includes("3 pack")) {
        qtyToAdd = 3;
      }

      const productName = `Manisan Mangga (${selectedVariant.toUpperCase()})`;
      const cart = getCart();
      const existingIndex = cart.findIndex((item) => item.name === productName);

      if (existingIndex !== -1) {
        cart[existingIndex].qty = (Number(cart[existingIndex].qty) || 0) + qtyToAdd;
      } else {
        cart.push({
          id: Date.now(),
          name: productName,
          variant: selectedVariant,
          qty: qtyToAdd,
          img: image
        });
      }

      saveCart(cart);
      window.location.href = "pesan.html";
    });
  });
}

/* ==========================================================================
   7. LOGIKA HALAMAN CHECKOUT / PESAN (MENDUKUNG HK, TW & INDONESIA)
   ========================================================================== */

function initPesanPage() {
  const cartContainer = document.getElementById("cart-items-container");
  if (!cartContainer) return;

  const notesCard = document.querySelector(".notes-input-card");
  const summaryCard = document.querySelector(".cart-summary-card") || document.querySelector(".cart-summary");
  const step1Content = document.getElementById("step-1-content");
  const step2Content = document.getElementById("step-2-content");
  const stepIndicator1 = document.getElementById("step-indicator-1");
  const stepIndicator2 = document.getElementById("step-indicator-2");
  const btnStep2 = document.getElementById("btn-to-step-2");
  const btnBack1 = document.getElementById("btn-back-to-step-1");
  const selectCountry = document.getElementById("select-country");
  
  const formHongKong = document.getElementById("form-hongkong");
  const formTaiwan = document.getElementById("form-taiwan");
  const formIndonesia = document.getElementById("form-indonesia");

  function renderCartPage() {
    const cart = getCart();
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
      cartContainer.innerHTML = `
        <div class="empty-cart-state" style="text-align:center; padding:40px 20px;">
          <div class="empty-cart-icon" style="font-size:48px;">🛒</div>
          <h4>Keranjang Kamu Masih Kosong</h4>
          <p>Belum ada manisan yang dipilih. Yuk, pilih varian kesukaanmu dulu!</p>
          <a href="paket.html" class="btn-secondary btn-sm" style="display:inline-block; margin-top:10px; padding:8px 16px; border-radius:8px; text-decoration:none;color:#f59e0b;">Lihat Katalog Paket →</a>
        </div>`;

      if (notesCard) notesCard.style.display = "none";
      if (summaryCard) summaryCard.style.display = "none";
      if (btnStep2) btnStep2.style.display = "none";

      if (document.getElementById("subtotal-text")) document.getElementById("subtotal-text").textContent = formatRupiah(0);
      if (document.getElementById("grandtotal-text")) document.getElementById("grandtotal-text").textContent = formatRupiah(0);
      if (document.getElementById("shipping-cost-text")) document.getElementById("shipping-cost-text").textContent = "Rp0";
      if (document.getElementById("total-qty-text")) document.getElementById("total-qty-text").textContent = "0";
      return;
    }

    if (notesCard) notesCard.style.display = "block";
    if (summaryCard) summaryCard.style.display = "block";
    if (btnStep2) btnStep2.style.display = "flex";

    const globalTotalQty = getTotalCartQuantity();
    const activeUnitPrice = calculateUnitPrice(globalTotalQty);
    const selectedCountry = selectCountry ? selectCountry.value : "Hong Kong";

    let qtyOriginal = 0;
    let qtyPedas = 0;

    cart.forEach((item, index) => {
      const qty = Number(item.qty) || 0;
      const itemTotal = activeUnitPrice * qty;

      const isPedas = item.name.toLowerCase().includes("pedas") || item.variant === "pedas";
      if (isPedas) {
        qtyPedas += qty;
      } else {
        qtyOriginal += qty;
      }

      const badgeClass = isPedas ? "badge-pedas" : "badge-original";
      const badgeText = isPedas ? "🌶️ PEDAS" : "🥭 ORIGINAL";
      let imgSrc = item.img && item.img.startsWith("http") ? item.img : "assets/img/hero.png";

      const itemElement = document.createElement("div");
      itemElement.className = "cart-product-card";
      
      itemElement.innerHTML = `
        <div class="cart-product-img">
          <img src="${escapeHTML(imgSrc)}" alt="${escapeHTML(item.name)}" onerror="this.src='assets/img/hero.png';">
        </div>
        <div class="cart-product-info">
          <div class="cart-product-header">
            <div class="product-title-group">
              <h4 class="cart-product-title">${escapeHTML(item.name.split('(')[0].trim())}</h4>
              <span class="variant-badge ${badgeClass}">${badgeText}</span>
            </div>
            <button type="button" class="cart-item-delete" data-index="${index}" title="Hapus produk" aria-label="Hapus">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
          
          <div class="cart-product-bottom">
            <div class="price-single">
              ${formatRupiah(itemTotal)}
              <small style="display:block; font-size:11px; color:#666; font-weight:normal;">
                (@${formatRupiah(activeUnitPrice)})
              </small>
            </div>
            <div class="cart-qty-control">
              <button type="button" class="btn-qty" data-action="minus" data-index="${index}">−</button>
              <span class="qty-val">${qty}</span>
              <button type="button" class="btn-qty" data-action="plus" data-index="${index}">+</button>
            </div>
          </div>
        </div>`;
      cartContainer.appendChild(itemElement);
    });

    const subtotal = getCartSubtotal(cart);
    const shippingInfo = calculateWeightAndShipping(globalTotalQty, selectedCountry);
    const grandTotal = subtotal + shippingInfo.shippingCost;

    const detailsContainer = document.getElementById("summary-details-list");
    if (detailsContainer) {
      let breakdownHTML = "";
      if (qtyOriginal > 0) {
        breakdownHTML += `<div class="summary-row"><span>Original</span><span>${qtyOriginal} pack</span></div>`;
      }
      if (qtyPedas > 0) {
        breakdownHTML += `<div class="summary-row"><span>Pedas</span><span>${qtyPedas} pack</span></div>`;
      }
      if (globalTotalQty >= 3) {
        breakdownHTML += `<div class="summary-row" style="color: #2e7d32; font-weight: 600;"><span>Diskon Grosir</span><span>Rp20.000 / pack</span></div>`;
      }
      detailsContainer.innerHTML = breakdownHTML;
    }

    let weightDisplay = shippingInfo.totalGram >= 1000 
      ? `${shippingInfo.totalKgExact} kg (${shippingInfo.totalGram} gram)` 
      : `${shippingInfo.totalGram} gram`;

    if (document.getElementById("total-weight-text")) document.getElementById("total-weight-text").textContent = weightDisplay;
    if (document.getElementById("subtotal-text")) document.getElementById("subtotal-text").textContent = formatRupiah(subtotal);
    if (document.getElementById("shipping-cost-text")) document.getElementById("shipping-cost-text").textContent = shippingInfo.shippingText;
    if (document.getElementById("grandtotal-text")) document.getElementById("grandtotal-text").textContent = formatRupiah(grandTotal);
    if (document.getElementById("total-qty-text")) document.getElementById("total-qty-text").textContent = globalTotalQty;
  }

  renderCartPage();

  // Handler Event Klik Tombol Tambah, Kurang, & Hapus di Keranjang
  cartContainer.addEventListener("click", (event) => {
    const button = event.target.closest("[data-index]");
    if (!button) return;

    const index = Number(button.getAttribute("data-index"));
    if (!Number.isInteger(index)) return;

    const cart = getCart();
    if (!cart[index]) return;

    if (button.classList.contains("btn-qty")) {
      const action = button.getAttribute("data-action");
      if (action === "plus") cart[index].qty = (Number(cart[index].qty) || 0) + 1;
      if (action === "minus" && Number(cart[index].qty) > 1) cart[index].qty -= 1;
      saveCart(cart);
      renderCartPage();
    }

    if (button.classList.contains("cart-item-delete")) {
      cart.splice(index, 1);
      saveCart(cart);
      renderCartPage();
    }
  });

  // Navigasi Langkah Stepper
  if (btnStep2) {
    btnStep2.addEventListener("click", () => {
      if (step1Content) step1Content.style.display = "none";
      if (step2Content) step2Content.style.display = "block";
      if (stepIndicator1) stepIndicator1.classList.remove("active");
      if (stepIndicator2) stepIndicator2.classList.add("active");
      
      const mainGrandtotal = document.getElementById('grandtotal-text')?.textContent || 'Rp0';
      const miniGrandtotal = document.getElementById('mini-grandtotal-text');
      if (miniGrandtotal) miniGrandtotal.textContent = mainGrandtotal;
    });
  }

  if (btnBack1) {
    btnBack1.addEventListener("click", () => {
      if (step2Content) step2Content.style.display = "none";
      if (step1Content) step1Content.style.display = "block";
      if (stepIndicator2) stepIndicator2.classList.remove("active");
      if (stepIndicator1) stepIndicator1.classList.add("active");
    });
  }

  // Event Pergantian Pilihan Negara
  if (selectCountry) {
    function updateCountryForm() {
      const country = selectCountry.value;
      
      if (formHongKong) formHongKong.style.display = "none";
      if (formTaiwan) formTaiwan.style.display = "none";
      if (formIndonesia) formIndonesia.style.display = "none";

      if (country === "Taiwan") {
        if (formTaiwan) formTaiwan.style.display = "block";
      } else if (country === "Indonesia") {
        if (formIndonesia) formIndonesia.style.display = "block";
      } else {
        if (formHongKong) formHongKong.style.display = "block";
      }
      renderCartPage(); // Rekalkulasi Ongkir
    }
    selectCountry.addEventListener("change", updateCountryForm);
  }

  /* ==========================================================================
     HANDLER PILIHAN NEGARA BARU (SEGMENTED PILL BUTTONS)
     ========================================================================== */
  const countryPills = document.querySelectorAll('.country-pill-btn');
  if (countryPills.length > 0) {
    countryPills.forEach(pill => {
      pill.addEventListener('click', () => {
        countryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        
        const selectedVal = pill.getAttribute('data-value');
        if (selectCountry) {
          selectCountry.value = selectedVal;
          selectCountry.dispatchEvent(new Event('change'));
        }
      });
    });
  }

  // Legacy Handler
  const countryCards = document.querySelectorAll('.country-card');
  countryCards.forEach(card => {
    card.addEventListener('click', () => {
      countryCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      
      const radio = card.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        if (selectCountry) {
          selectCountry.value = radio.value;
          selectCountry.dispatchEvent(new Event('change'));
        }
      }
    });
  });

  // Tombol Edit Pesanan di Step 2
  const btnEditCart = document.getElementById('btn-edit-cart');
  if (btnEditCart) {
    btnEditCart.addEventListener('click', () => {
      if (btnBack1) btnBack1.click();
    });
  }

  // Form Submission via WhatsApp & Google Sheets
  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const cart = getCart();

      if (cart.length === 0) {
        alert("Keranjang belanja masih kosong.");
        return;
      }

      const globalTotalQty = getTotalCartQuantity();
      const activeUnitPrice = calculateUnitPrice(globalTotalQty);
      const country = selectCountry ? selectCountry.value : "Hong Kong";
      
      // 1. Generate Order ID
      const orderId = generateOrderID(country);

      const shippingInfo = calculateWeightAndShipping(globalTotalQty, country);
      const subtotal = getCartSubtotal(cart);
      const grandTotal = subtotal + shippingInfo.shippingCost;

      const name = document.getElementById("cust-name")?.value.trim() || "";
      const phone = document.getElementById("cust-phone")?.value.trim() || "";
      const notes = document.getElementById("cart-notes")?.value.trim() || "-";

      let orderListText = "";
      let orderItemsSummary = [];

      cart.forEach((item, index) => {
        const qty = Number(item.qty) || 0;
        const itemTotal = activeUnitPrice * qty;
        orderListText += `${index + 1}. ${item.name} x${qty} = ${formatRupiah(itemTotal)}\n`;
        orderItemsSummary.push(`${item.name} (x${qty})`);
      });

      let locationDetail = "";
      let addressOnly = "";

      if (country === "Hong Kong") {
        const pickup = document.getElementById("cust-pickup")?.value.trim() || "";
        locationDetail = `Tempat Pengambilan: ${pickup}`;
        addressOnly = pickup;
      } else if (country === "Taiwan") {
        const addressTw = document.getElementById("cust-address-tw")?.value.trim() || document.getElementById("cust-address")?.value.trim() || "";
        locationDetail = `Alamat Kirim (Taiwan): ${addressTw}`;
        addressOnly = addressTw;
      } else if (country === "Indonesia") {
        const courier = document.getElementById("cust-courier-id")?.value.trim() || "";
        const district = document.getElementById("cust-district-id")?.value.trim() || "";
        const addressId = document.getElementById("cust-address-id")?.value.trim() || "";
        locationDetail = `Kurir Ekspedisi: ${courier}\n Kec / Kota: ${district}\n Alamat Lengkap: ${addressId}`;
        addressOnly = `${courier} - ${district} - ${addressId}`;
      }

      let shippingNoteInTotal = "";
      if (country === 'Hong Kong') {
        shippingNoteInTotal = ' (+ HK$33 COD)';
      } else if (country === 'Indonesia') {
        shippingNoteInTotal = ' (+ Ongkir SPX/JNE via WA)';
      }

      // 2. Format Pesan WhatsApp (Memuat Order ID)
      const waText = `Halo Kak Anna Amui, saya mau pesan manisan mangga

*ORDER ID: #${orderId}*
=================================
*RINCIAN PESANAN*
=================================
${orderListText}
*Subtotal Produk*: ${formatRupiah(subtotal)} ${globalTotalQty >= 3 ? '(Harga Grosir @Rp20.000)' : ''}

*Berat Total*: ${shippingInfo.totalKgExact} kg (${shippingInfo.totalGram} gram)

*Ongkir* (${country}): ${shippingInfo.shippingText}
----------------------------------------------------
*TOTAL PEMBAYARAN: ${formatRupiah(grandTotal)}${shippingNoteInTotal}*

Catatan: ${notes}

=================================
*DATA DIRI PEMESAN*
=================================
Nama: ${name}

No HP / WA: ${phone}

Negara Tujuan: ${country}

${locationDetail}

Mohon diproses pesanan saya ya kak.
Terima kasih!`;

      // 3. Payload Data untuk dikirim ke Google Sheets
      const sheetPayload = {
        orderId: orderId,
        nama: name,
        phone: phone,
        negara: country,
        alamat: addressOnly,
        pesanan: orderItemsSummary.join(", "),
        totalQty: globalTotalQty,
        subtotal: subtotal,
        ongkirText: shippingInfo.shippingText,
        grandTotal: grandTotal,
        catatan: notes
      };

      // 4. Kirim Data ke Google Apps Script (Tanpa Menghentikan Eksekusi WA)
      if (ANNA_AMUI_CONFIG.googleScriptUrl && ANNA_AMUI_CONFIG.googleScriptUrl !== "URL_WEB_APP_GOOGLE_APPS_SCRIPT_KAMU") {
        fetch(ANNA_AMUI_CONFIG.googleScriptUrl, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(sheetPayload)
        }).catch((err) => console.error("Gagal mengirim data ke Google Sheets:", err));
      }

      // 5. Buka Aplikasi WhatsApp
      const whatsappURL = `https://wa.me/${ANNA_AMUI_CONFIG.whatsapp}?text=${encodeURIComponent(waText)}`;
      window.open(whatsappURL, "_blank");

      // 6. Kosongkan keranjang di LocalStorage & Update UI
      saveCart([]);
      renderCartPage();
    });
  }
}

function initTentangPage() {}

/* ==========================================================================
   8. LOGIKA HALAMAN BLOG & FILTER KATEGORI
   ========================================================================== */

function initBlogPage() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const blogCards = document.querySelectorAll('.blog-card');

  if (tabButtons.length === 0) return;

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      const selectedCategory = button.getAttribute('data-category');

      blogCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (selectedCategory === 'all' || cardCategory === selectedCategory) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   9. EKSEKUSI UTAMA (INITIALIZATION)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  updateCartBadge();
  await loadComponents();

  initIndexPage();
  initPaketPage();
  initPesanPage();
  initTentangPage();
  initBlogPage();

  updateCartBadge();

  // Floating WhatsApp Component Loader
  const waContainer = document.getElementById('wa-component');
  if (waContainer) {
    try {
      const response = await fetch('components/floating-wa.html');
      if (response.ok) {
        waContainer.innerHTML = await response.text();
      }
    } catch (err) {
      console.error("Gagal memuat floating WhatsApp:", err);
    }
  }
});
