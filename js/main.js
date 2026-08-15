/* =========================================================
   MAIN.JS - ANNA AMUI
   Mobile Navigation
   Compatible with:
   - Direct HTML Components
   - Dynamic Components via include.js
========================================================= */

"use strict";


/* =========================================================
   INITIALIZE MOBILE MENU
========================================================= */

function initMobileMenu() {

    const menuToggle =
        document.getElementById("menuToggle");

    const navMenu =
        document.getElementById("navMenu");


    /* =====================================================
       ELEMENT TIDAK DITEMUKAN
    ===================================================== */

    if (!menuToggle || !navMenu) {
        return;
    }


    /* =====================================================
       CEGAH INITIALIZE BERULANG
    ===================================================== */

    if (
        menuToggle.dataset.menuInitialized === "true"
    ) {
        return;
    }

    menuToggle.dataset.menuInitialized = "true";


    /* =====================================================
       KONDISI AWAL
    ===================================================== */

    navMenu.classList.remove("active");

    menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );


    /* =====================================================
       BUKA / TUTUP MENU
    ===================================================== */

    menuToggle.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            const isActive =
                navMenu.classList.toggle("active");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isActive)
            );

        }
    );


    /* =====================================================
       MENU LINK
    ===================================================== */

    const navLinks =
        navMenu.querySelectorAll(".nav-link");


    navLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                navMenu.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }
        );

    });


    /* =====================================================
       KLIK DI LUAR MENU
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            if (
                !navMenu.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {

                navMenu.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );


    /* =====================================================
       TOMBOL ESC
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                navMenu.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );

}


/* =========================================================
   HALAMAN
========================================================= */

/*
   Jalankan langsung jika component sudah ada.
*/

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initMobileMenu();

    }
);


/*
   Jalankan kembali setelah component selesai
   dimuat oleh include.js.
*/

document.addEventListener(
    "componentsLoaded",
    function () {

        initMobileMenu();

    }
);
