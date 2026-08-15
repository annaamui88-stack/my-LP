/* =========================================================
   INCLUDE.JS - ANNA AMUI
   Memuat Header, Footer, Bottom Navigation & Floating WA
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", function () {

    const elements =
        document.querySelectorAll("[data-include]");

    /* Tidak ada component */

    if (!elements.length) {

        document.dispatchEvent(
            new Event("componentsLoaded")
        );

        return;
    }


    /* =====================================================
       LOAD SEMUA COMPONENT
    ===================================================== */

    const promises =
        Array.from(elements).map(function (element) {

            const file =
                element.getAttribute("data-include");


            return fetch(file)

                .then(function (response) {

                    if (!response.ok) {

                        throw new Error(
                            "Gagal memuat: " + file
                        );

                    }

                    return response.text();

                })

                .then(function (html) {

                    element.innerHTML = html;

                    element.removeAttribute(
                        "data-include"
                    );

                });

        });


    /* =====================================================
       COMPONENT SELESAI DIMUAT
    ===================================================== */

    Promise.all(promises)

        .then(function () {

            document.dispatchEvent(
                new Event("componentsLoaded")
            );

        })

        .catch(function (error) {

            console.error(
                "Anna Amui Include Error:",
                error
            );

        });

});
