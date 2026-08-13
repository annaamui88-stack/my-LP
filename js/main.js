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


    /* Jika elemen tidak ada, hentikan */

    if (!menuToggle || !navMenu) {
        return;
    }


    /* =====================================================
       CEGAH EVENT TERPASANG DUA KALI
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
        function () {

            const isActive =
                navMenu.classList.toggle("active");


            menuToggle.setAttribute(
                "aria-expanded",
                String(isActive)
            );

        }
    );


    /* =====================================================
       TUTUP MENU SETELAH PILIH MENU
    ===================================================== */

    const navLinks =
        navMenu.querySelectorAll(".nav-link");


    navLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    navMenu.classList.remove(
                        "active"
                    );

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        }
    );


    /* =====================================================
       TUTUP JIKA KLIK DI LUAR MENU
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            if (
                !navMenu.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {

                navMenu.classList.remove(
                    "active"
                );

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );


    /* =====================================================
       TUTUP DENGAN TOMBOL ESC
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                navMenu.classList.remove(
                    "active"
                );

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );

}


/* =========================================================
   HALAMAN DENGAN HEADER LANGSUNG DI HTML
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initMobileMenu();

    }
);


/* =========================================================
   HALAMAN DENGAN COMPONENT LOADER
========================================================= */

document.addEventListener(
    "componentsLoaded",
    function () {

        initMobileMenu();

    }
);
