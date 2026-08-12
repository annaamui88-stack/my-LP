/* ==========================================================================
   CART.JS - ANNA AMUI
   Shopping Cart System
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       CONFIG
    ========================================================== */

    const CART_KEY = "annaAmuiCart";

    const PRICE_NORMAL = 12;
    const PRICE_PROMO = 10;

    // Berat 1 pack
    const WEIGHT_PER_PACK = 0.2;

    // Estimasi ongkir Hong Kong
    const SHIPPING_PER_KG = 33;


    /* =========================================================
       ELEMENTS
    ========================================================== */

    const cartContent = document.getElementById("cart-content");
    const emptyCart = document.getElementById("empty-cart");

    const cartItemsContainer =
        document.getElementById("cart-items");

    const cartItemCount =
        document.getElementById("cart-item-count");

    const clearCartBtn =
        document.getElementById("clear-cart");

    const checkoutBtn =
        document.getElementById("cart-checkout-btn");

    const promoText =
        document.getElementById("cart-promo-text");

    const summaryTotalPack =
        document.getElementById("summary-total-pack");

    const summaryPrice =
        document.getElementById("summary-price");

    const summaryPromo =
        document.getElementById("summary-promo");

    const summarySubtotal =
        document.getElementById("summary-subtotal");

    const summaryWeight =
        document.getElementById("summary-weight");

    const summaryShipping =
        document.getElementById("summary-shipping");


    /* =========================================================
       LOAD CART
    ========================================================== */

    function getCart() {

        try {

            const savedCart =
                localStorage.getItem(CART_KEY);

            if (!savedCart) {
                return [];
            }

            const cart =
                JSON.parse(savedCart);

            return Array.isArray(cart)
                ? cart
                : [];

        } catch (error) {

            console.error(
                "Gagal membaca keranjang:",
                error
            );

            return [];
        }
    }


    /* =========================================================
       SAVE CART
    ========================================================== */

    function saveCart(cart) {

        localStorage.setItem(
            CART_KEY,
            JSON.stringify(cart)
        );

    }


    /* =========================================================
       TOTAL PACK
    ========================================================== */

    function getTotalPack(cart) {

        return cart.reduce(
            (total, item) => {

                return total +
                    Number(item.quantity || 0);

            },
            0
        );

    }


    /* =========================================================
       GET PRICE
    ========================================================== */

    function getPrice(totalPack) {

        if (totalPack >= 3) {
            return PRICE_PROMO;
        }

        return PRICE_NORMAL;
    }


    /* =========================================================
       FORMAT MONEY
    ========================================================== */

    function formatMoney(value) {

        return "HK$" +
            Number(value).toLocaleString(
                "en-US"
            );

    }


    /* =========================================================
       FORMAT WEIGHT
    ========================================================== */

    function formatWeight(weight) {

        if (weight <= 0) {
            return "0 Kg";
        }

        return weight
            .toFixed(1)
            .replace(".0", "") +
            " Kg";

    }


    /* =========================================================
       RENDER CART
    ========================================================== */

    function renderCart() {

        const cart = getCart();

        const totalPack =
            getTotalPack(cart);

        /* -----------------------------------------
           EMPTY CART
        ----------------------------------------- */

        if (cart.length === 0 || totalPack === 0) {

            cartContent.style.display = "none";

            emptyCart.style.display = "block";

            updateCartBadge(0);

            return;
        }


        /* -----------------------------------------
           SHOW CART
        ----------------------------------------- */

        cartContent.style.display = "grid";

        emptyCart.style.display = "none";


        /* -----------------------------------------
           CLEAR OLD ITEMS
        ----------------------------------------- */

        cartItemsContainer.innerHTML = "";


        /* -----------------------------------------
           PRICE
        ----------------------------------------- */

        const price =
            getPrice(totalPack);


        /* -----------------------------------------
           RENDER EACH ITEM
        ----------------------------------------- */

        cart.forEach(function (item, index) {

            const quantity =
                Number(item.quantity || 0);

            const itemSubtotal =
                quantity * price;


            const itemElement =
                document.createElement("div");

            itemElement.className =
                "cart-item";


            itemElement.innerHTML = `

                <div class="cart-item-image">

                    <img
                        src="${item.image || "assets/img/manisan-mangga-paket-hemat-1-pack.png"}"
                        alt="${item.name || "Manisan Mangga Anna Amui"}"
                        loading="lazy"
                    >

                </div>


                <div class="cart-item-content">

                    <div class="cart-item-top">

                        <div>

                            <div class="cart-item-name">
                                ${item.name || "Manisan Mangga"}
                            </div>

                            <div class="cart-item-variant">
                                ${item.variant || ""}
                            </div>

                        </div>


                        <button
                            type="button"
                            class="cart-item-delete"
                            data-index="${index}"
                            aria-label="Hapus produk"
                        >

                            <i class="fa-solid fa-trash-can"></i>

                        </button>

                    </div>


                    <div class="cart-item-bottom">

                        <div class="cart-quantity">

                            <button
                                type="button"
                                class="cart-minus"
                                data-index="${index}"
                                aria-label="Kurangi jumlah"
                            >
                                −
                            </button>

                            <span>
                                ${quantity}
                            </span>

                            <button
                                type="button"
                                class="cart-plus"
                                data-index="${index}"
                                aria-label="Tambah jumlah"
                            >
                                +
                            </button>

                        </div>


                        <div class="cart-item-price">

                            ${formatMoney(itemSubtotal)}

                        </div>

                    </div>

                </div>

            `;


            cartItemsContainer.appendChild(
                itemElement
            );

        });


        /* -----------------------------------------
           SUMMARY
        ----------------------------------------- */

        const subtotal =
            totalPack * price;

        const weight =
            totalPack * WEIGHT_PER_PACK;

        const shipping =
            Math.ceil(weight) *
            SHIPPING_PER_KG;


        summaryTotalPack.textContent =
            `${totalPack} Pack`;


        summaryPrice.textContent =
            formatMoney(price);


        summarySubtotal.textContent =
            formatMoney(subtotal);


        summaryWeight.textContent =
            formatWeight(weight);


        summaryShipping.textContent =
            formatMoney(shipping);


        /* -----------------------------------------
           PROMO
        ----------------------------------------- */

        if (totalPack >= 3) {

            summaryPromo.textContent =
                "HK$10 / Pack";

            promoText.textContent =
                `Promo aktif! Total ${totalPack} Pack mendapatkan harga HK$10 / Pack.`;

        } else {

            const remaining =
                3 - totalPack;

            summaryPromo.textContent =
                "-";

            promoText.textContent =
                `Tambah ${remaining} Pack lagi untuk mendapatkan harga promo HK$10 / Pack.`;

        }


        /* -----------------------------------------
           ITEM COUNT
        ----------------------------------------- */

        cartItemCount.textContent =
            `${totalPack} Pack`;


        /* -----------------------------------------
           BADGE
        ----------------------------------------- */

        updateCartBadge(totalPack);

    }


    /* =========================================================
       PLUS
    ========================================================== */

    cartItemsContainer.addEventListener(
        "click",
        function (event) {

            const plusButton =
                event.target.closest(".cart-plus");

            if (!plusButton) {
                return;
            }

            const index =
                Number(
                    plusButton.dataset.index
                );

            const cart = getCart();

            if (!cart[index]) {
                return;
            }

            cart[index].quantity =
                Number(cart[index].quantity || 0) + 1;

            saveCart(cart);

            renderCart();

        }
    );


    /* =========================================================
       MINUS
    ========================================================== */

    cartItemsContainer.addEventListener(
        "click",
        function (event) {

            const minusButton =
                event.target.closest(".cart-minus");

            if (!minusButton) {
                return;
            }

            const index =
                Number(
                    minusButton.dataset.index
                );

            const cart = getCart();

            if (!cart[index]) {
                return;
            }

            cart[index].quantity =
                Number(cart[index].quantity || 0) - 1;


            /* -----------------------------------------
               REMOVE IF ZERO
            ----------------------------------------- */

            if (cart[index].quantity <= 0) {

                cart.splice(index, 1);

            }


            saveCart(cart);

            renderCart();

        }
    );


    /* =========================================================
       DELETE ITEM
    ========================================================== */

    cartItemsContainer.addEventListener(
        "click",
        function (event) {

            const deleteButton =
                event.target.closest(
                    ".cart-item-delete"
                );

            if (!deleteButton) {
                return;
            }

            const index =
                Number(
                    deleteButton.dataset.index
                );

            const cart = getCart();

            if (!cart[index]) {
                return;
            }


            cart.splice(index, 1);

            saveCart(cart);

            renderCart();

        }
    );


    /* =========================================================
       CLEAR CART
    ========================================================== */

    if (clearCartBtn) {

        clearCartBtn.addEventListener(
            "click",
            function () {

                const cart = getCart();

                if (cart.length === 0) {
                    return;
                }


                const confirmed =
                    confirm(
                        "Apakah Anda yakin ingin mengosongkan keranjang?"
                    );


                if (!confirmed) {
                    return;
                }


                localStorage.removeItem(
                    CART_KEY
                );

                renderCart();

            }
        );

    }


    /* =========================================================
       CHECKOUT
    ========================================================== */

    if (checkoutBtn) {

        checkoutBtn.addEventListener(
            "click",
            function () {

                const cart = getCart();

                const totalPack =
                    getTotalPack(cart);


                if (
                    cart.length === 0 ||
                    totalPack === 0
                ) {

                    alert(
                        "Keranjang Anda masih kosong."
                    );

                    return;
                }


                /*
                 * Untuk sekarang langsung
                 * menuju checkout.
                 *
                 * Kedepannya di sini kita
                 * bisa menambahkan:
                 *
                 * negara tujuan
                 * metode pengiriman
                 * alamat
                 * mata uang
                 * ongkir negara
                 */

                window.location.href =
                    "checkout.html";

            }
        );

    }


    /* =========================================================
       CART BADGE
    ========================================================== */

    function updateCartBadge(total) {

        /*
         * Mendukung beberapa kemungkinan
         * nama badge agar mudah diintegrasikan
         * dengan header/bottom navigation.
         */

        const badges =
            document.querySelectorAll(
                ".cart-count, .cart-badge, [data-cart-count]"
            );


        badges.forEach(function (badge) {

            badge.textContent = total;


            if (total > 0) {

                badge.style.display =
                    "flex";

            } else {

                badge.style.display =
                    "none";

            }

        });

    }


    /* =========================================================
       GLOBAL CART UPDATE
    ========================================================== */

    window.addEventListener(
        "storage",
        function (event) {

            if (event.key === CART_KEY) {

                renderCart();

            }

        }
    );


    /* =========================================================
       INITIAL RENDER
    ========================================================== */

    renderCart();

});
