/* ==========================================================================
   CART.JS - ANNA AMUI
   Sistem Keranjang Belanja
   ========================================================================== */

(function () {
    "use strict";


    /* ==========================================================================
       KONFIGURASI
       ========================================================================== */

    const CART_STORAGE_KEY = "annaAmuiCart";

    // Harga manisan mangga
    const HARGA_NORMAL = 12;     // HK$12 / pack
    const HARGA_PROMO = 10;      // HK$10 / pack
    const MIN_PROMO_PACK = 3;    // Minimal 3 pack


    /* ==========================================================================
       DATA KERANJANG
       ========================================================================== */

    let cart = loadCart();


    /* ==========================================================================
       LOAD CART
       ========================================================================== */

    function loadCart() {

        try {

            const savedCart = localStorage.getItem(CART_STORAGE_KEY);

            if (!savedCart) {
                return [];
            }

            const parsedCart = JSON.parse(savedCart);

            if (!Array.isArray(parsedCart)) {
                return [];
            }

            return parsedCart;

        } catch (error) {

            console.error(
                "Anna Amui: Gagal membaca keranjang.",
                error
            );

            return [];
        }
    }


    /* ==========================================================================
       SAVE CART
       ========================================================================== */

    function saveCart() {

        try {

            localStorage.setItem(
                CART_STORAGE_KEY,
                JSON.stringify(cart)
            );

        } catch (error) {

            console.error(
                "Anna Amui: Gagal menyimpan keranjang.",
                error
            );
        }

        updateCartUI();
    }


    /* ==========================================================================
       HARGA PRODUK
       ========================================================================== */

    function getHargaPerPack(totalPack) {

        return totalPack >= MIN_PROMO_PACK
            ? HARGA_PROMO
            : HARGA_NORMAL;
    }


    /* ==========================================================================
       TOTAL PACK
       ========================================================================== */

    function getTotalPack() {

        return cart.reduce(
            function (total, item) {
                return total + Number(item.qty || 0);
            },
            0
        );
    }


    /* ==========================================================================
       TOTAL ITEM JENIS PRODUK
       ========================================================================== */

    function getTotalJenisProduk() {

        return cart.length;
    }


    /* ==========================================================================
       SUBTOTAL
       ========================================================================== */

    function getSubtotal() {

        const totalPack = getTotalPack();

        const hargaPerPack = getHargaPerPack(totalPack);

        return totalPack * hargaPerPack;
    }


    /* ==========================================================================
       TAMBAH PRODUK
       ========================================================================== */

    function addToCart(product) {

        if (!product || !product.id) {

            console.error(
                "Anna Amui: Data produk tidak valid."
            );

            return false;
        }


        const productId = String(product.id);


        const existingItem = cart.find(
            function (item) {
                return item.id === productId;
            }
        );


        if (existingItem) {

            existingItem.qty += Number(
                product.qty || 1
            );

        } else {

            cart.push({

                id: productId,

                name: product.name || "Produk Anna Amui",

                price: Number(
                    product.price || HARGA_NORMAL
                ),

                image: product.image || "",

                variant: product.variant || "",

                qty: Number(
                    product.qty || 1
                )

            });
        }


        saveCart();

        showCartNotification(
            product.name || "Produk"
        );

        return true;
    }


    /* ==========================================================================
       TAMBAH DENGAN ID ELEMENT PRODUK
       ========================================================================== */

    function addProductFromElement(button) {

        if (!button) {
            return false;
        }


        const product = {

            id: button.dataset.productId,

            name: button.dataset.productName,

            price: Number(
                button.dataset.productPrice || HARGA_NORMAL
            ),

            image: button.dataset.productImage || "",

            variant: button.dataset.productVariant || "",

            qty: Number(
                button.dataset.productQty || 1
            )

        };


        return addToCart(product);
    }


    /* ==========================================================================
       UPDATE QUANTITY
       ========================================================================== */

    function updateQuantity(productId, quantity) {

        const item = cart.find(
            function (product) {
                return product.id === String(productId);
            }
        );


        if (!item) {
            return false;
        }


        quantity = parseInt(quantity, 10);


        if (isNaN(quantity)) {
            return false;
        }


        if (quantity <= 0) {

            removeFromCart(productId);

            return true;
        }


        item.qty = quantity;

        saveCart();

        return true;
    }


    /* ==========================================================================
       TAMBAH QUANTITY
       ========================================================================== */

    function increaseQuantity(productId) {

        const item = cart.find(
            function (product) {
                return product.id === String(productId);
            }
        );


        if (!item) {
            return false;
        }


        item.qty++;

        saveCart();

        return true;
    }


    /* ==========================================================================
       KURANGI QUANTITY
       ========================================================================== */

    function decreaseQuantity(productId) {

        const item = cart.find(
            function (product) {
                return product.id === String(productId);
            }
        );


        if (!item) {
            return false;
        }


        item.qty--;


        if (item.qty <= 0) {

            removeFromCart(productId);

            return true;
        }


        saveCart();

        return true;
    }


    /* ==========================================================================
       HAPUS PRODUK
       ========================================================================== */

    function removeFromCart(productId) {

        cart = cart.filter(
            function (item) {
                return item.id !== String(productId);
            }
        );


        saveCart();

        return true;
    }


    /* ==========================================================================
       KOSONGKAN KERANJANG
       ========================================================================== */

    function clearCart() {

        cart = [];

        saveCart();

        return true;
    }


    /* ==========================================================================
       CEK PRODUK DALAM CART
       ========================================================================== */

    function isInCart(productId) {

        return cart.some(
            function (item) {
                return item.id === String(productId);
            }
        );
    }


    /* ==========================================================================
       AMBIL QTY PRODUK
       ========================================================================== */

    function getProductQuantity(productId) {

        const item = cart.find(
            function (product) {
                return product.id === String(productId);
            }
        );


        return item
            ? item.qty
            : 0;
    }


    /* ==========================================================================
       AMBIL DATA CART
       ========================================================================== */

    function getCart() {

        return cart.map(
            function (item) {
                return {
                    ...item
                };
            }
        );
    }


    /* ==========================================================================
       INFO KERANJANG
       ========================================================================== */

    function getCartSummary() {

        const totalPack = getTotalPack();

        const hargaPerPack =
            getHargaPerPack(totalPack);

        const subtotal =
            totalPack * hargaPerPack;


        return {

            items: getCart(),

            totalJenisProduk:
                getTotalJenisProduk(),

            totalPack:
                totalPack,

            hargaPerPack:
                hargaPerPack,

            subtotal:
                subtotal,

            promoAktif:
                totalPack >= MIN_PROMO_PACK,

            minimalPromo:
                MIN_PROMO_PACK

        };
    }


    /* ==========================================================================
       UPDATE CART COUNTER
       ========================================================================== */

    function updateCartCounter() {

        const totalPack = getTotalPack();


        const counters = document.querySelectorAll(
            "[data-cart-count], .cart-count, #cart-count"
        );


        counters.forEach(
            function (counter) {

                counter.textContent = totalPack;


                if (totalPack > 0) {

                    counter.classList.add(
                        "has-items"
                    );

                    counter.style.display = "";

                } else {

                    counter.classList.remove(
                        "has-items"
                    );

                    counter.style.display = "none";
                }

            }
        );
    }


    /* ==========================================================================
       UPDATE CART TOTAL
       ========================================================================== */

    function updateCartTotalUI() {

        const summary =
            getCartSummary();


        const totalElements =
            document.querySelectorAll(
                "[data-cart-total], #cart-total"
            );


        totalElements.forEach(
            function (element) {

                element.textContent =
                    formatHKD(
                        summary.subtotal
                    );
            }
        );


        const packElements =
            document.querySelectorAll(
                "[data-cart-pack], #cart-pack"
            );


        packElements.forEach(
            function (element) {

                element.textContent =
                    summary.totalPack;
            }
        );


        const priceElements =
            document.querySelectorAll(
                "[data-cart-price], #cart-price"
            );


        priceElements.forEach(
            function (element) {

                element.textContent =
                    formatHKD(
                        summary.hargaPerPack
                    ) +
                    " / Pack";
            }
        );


        const promoElements =
            document.querySelectorAll(
                "[data-cart-promo], #cart-promo"
            );


        promoElements.forEach(
            function (element) {

                if (summary.promoAktif) {

                    element.textContent =
                        "Promo aktif: HK$10 / Pack";

                    element.classList.add(
                        "active"
                    );

                } else {

                    element.textContent =
                        "Beli 3 Pack atau lebih → HK$10 / Pack";

                    element.classList.remove(
                        "active"
                    );
                }
            }
        );
    }


    /* ==========================================================================
       UPDATE SEMUA UI
       ========================================================================== */

    function updateCartUI() {

        updateCartCounter();

        updateCartTotalUI();

        renderCartItems();

        updateProductButtons();
    }


    /* ==========================================================================
       RENDER CART ITEMS
       ========================================================================== */

    function renderCartItems() {

        const containers =
            document.querySelectorAll(
                "[data-cart-items], #cart-items"
            );


        if (!containers.length) {
            return;
        }


        containers.forEach(
            function (container) {

                if (!cart.length) {

                    container.innerHTML = `
                        <div class="cart-empty">
                            <div class="cart-empty-icon">
                                🛒
                            </div>

                            <h3>Keranjang masih kosong</h3>

                            <p>
                                Silakan pilih produk Anna Amui
                                terlebih dahulu.
                            </p>

                            <a href="product.html"
                               class="btn btn-primary">
                                Lihat Produk
                            </a>
                        </div>
                    `;

                    return;
                }


                container.innerHTML =
                    cart.map(
                        function (item) {

                            const qty =
                                Number(item.qty || 0);


                            return `
                                <div class="cart-item"
                                     data-cart-item="${escapeHTML(item.id)}">

                                    ${
                                        item.image
                                            ? `
                                                <img
                                                    src="${escapeHTML(item.image)}"
                                                    alt="${escapeHTML(item.name)}"
                                                    class="cart-item-image"
                                                >
                                              `
                                            : ""
                                    }

                                    <div class="cart-item-info">

                                        <h4>
                                            ${escapeHTML(item.name)}
                                        </h4>

                                        ${
                                            item.variant
                                                ? `
                                                    <span>
                                                        ${escapeHTML(item.variant)}
                                                    </span>
                                                  `
                                                : ""
                                        }

                                        <strong>
                                            ${formatHKD(
                                                getHargaPerPack(
                                                    getTotalPack()
                                                )
                                            )}
                                            / Pack
                                        </strong>

                                        <div class="cart-quantity">

                                            <button
                                                type="button"
                                                data-cart-minus="${escapeHTML(item.id)}"
                                                aria-label="Kurangi">
                                                −
                                            </button>

                                            <span>
                                                ${qty}
                                            </span>

                                            <button
                                                type="button"
                                                data-cart-plus="${escapeHTML(item.id)}"
                                                aria-label="Tambah">
                                                +
                                            </button>

                                        </div>

                                    </div>

                                    <button
                                        type="button"
                                        class="cart-remove"
                                        data-cart-remove="${escapeHTML(item.id)}"
                                        aria-label="Hapus produk">
                                        ×
                                    </button>

                                </div>
                            `;

                        }
                    ).join("");
            }
        );
    }


    /* ==========================================================================
       UPDATE BUTTON PRODUK
       ========================================================================== */

    function updateProductButtons() {

        const buttons =
            document.querySelectorAll(
                "[data-add-to-cart]"
            );


        buttons.forEach(
            function (button) {

                const productId =
                    button.dataset.productId;


                if (!productId) {
                    return;
                }


                const qty =
                    getProductQuantity(productId);


                if (qty > 0) {

                    button.classList.add(
                        "in-cart"
                    );

                    button.dataset.cartQuantity =
                        qty;

                } else {

                    button.classList.remove(
                        "in-cart"
                    );

                    delete button.dataset.cartQuantity;
                }
            }
        );
    }


    /* ==========================================================================
       FORMAT HKD
       ========================================================================== */

    function formatHKD(amount) {

        const value =
            Number(amount || 0);


        return "HK$" +
            value.toLocaleString(
                "en-HK",
                {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }
            );
    }


    /* ==========================================================================
       ESCAPE HTML
       ========================================================================== */

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* ==========================================================================
       NOTIFIKASI
       ========================================================================== */

    function showCartNotification(productName) {

        let notification =
            document.querySelector(
                ".cart-notification"
            );


        if (!notification) {

            notification =
                document.createElement("div");

            notification.className =
                "cart-notification";


            notification.innerHTML = `
                <span class="cart-notification-icon">
                    ✓
                </span>

                <span class="cart-notification-text"></span>
            `;


            document.body.appendChild(
                notification
            );
        }


        const text =
            notification.querySelector(
                ".cart-notification-text"
            );


        if (text) {

            text.textContent =
                productName +
                " ditambahkan ke keranjang";
        }


        notification.classList.add(
            "show"
        );


        clearTimeout(
            notification._timer
        );


        notification._timer =
            setTimeout(
                function () {

                    notification.classList.remove(
                        "show"
                    );

                },
                2200
            );
    }


    /* ==========================================================================
       EVENT DELEGATION
       ========================================================================== */

    document.addEventListener(
        "click",
        function (event) {


            /* =========================
               TAMBAH KE CART
               ========================= */

            const addButton =
                event.target.closest(
                    "[data-add-to-cart]"
                );


            if (addButton) {

                event.preventDefault();

                addProductFromElement(
                    addButton
                );

                return;
            }


            /* =========================
               PLUS
               ========================= */

            const plusButton =
                event.target.closest(
                    "[data-cart-plus]"
                );


            if (plusButton) {

                event.preventDefault();

                increaseQuantity(
                    plusButton.dataset.cartPlus
                );

                return;
            }


            /* =========================
               MINUS
               ========================= */

            const minusButton =
                event.target.closest(
                    "[data-cart-minus]"
                );


            if (minusButton) {

                event.preventDefault();

                decreaseQuantity(
                    minusButton.dataset.cartMinus
                );

                return;
            }


            /* =========================
               REMOVE
               ========================= */

            const removeButton =
                event.target.closest(
                    "[data-cart-remove]"
                );


            if (removeButton) {

                event.preventDefault();

                removeFromCart(
                    removeButton.dataset.cartRemove
                );

                return;
            }


            /* =========================
               CLEAR CART
               ========================= */

            const clearButton =
                event.target.closest(
                    "[data-clear-cart]"
                );


            if (clearButton) {

                event.preventDefault();

                clearCart();

                return;
            }

        }
    );


    /* ==========================================================================
       SINKRONISASI ANTAR TAB
       ========================================================================== */

    window.addEventListener(
        "storage",
        function (event) {

            if (
                event.key === CART_STORAGE_KEY
            ) {

                cart = loadCart();

                updateCartUI();
            }

        }
    );


    /* ==========================================================================
       PUBLIC API
       ========================================================================== */

    window.AnnaAmuiCart = {

        add:
            addToCart,

        addFromElement:
            addProductFromElement,

        remove:
            removeFromCart,

        increase:
            increaseQuantity,

        decrease:
            decreaseQuantity,

        update:
            updateQuantity,

        clear:
            clearCart,

        get:
            getCart,

        getSummary:
            getCartSummary,

        getTotalPack:
            getTotalPack,

        getSubtotal:
            getSubtotal,

        getPricePerPack:
            getHargaPerPack,

        isInCart:
            isInCart,

        getProductQuantity:
            getProductQuantity,

        formatHKD:
            formatHKD,

        refresh:
            updateCartUI
    };


    /* ==========================================================================
       INITIALIZE
       ========================================================================== */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            updateCartUI
        );

    } else {

        updateCartUI();
    }


})();
