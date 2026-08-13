/* =========================================================
   FAQ.JS - ANNA AMUI
   FAQ Accordion
========================================================= */

"use strict";


document.addEventListener("componentsLoaded", function () {

    const faqQuestions =
        document.querySelectorAll(".faq-question");


    if (!faqQuestions.length) {
        return;
    }


    faqQuestions.forEach(function (question) {

        question.addEventListener("click", function () {

            const currentItem =
                this.closest(".faq-item");


            if (!currentItem) {
                return;
            }


            /* =================================================
               TUTUP FAQ LAIN
            ================================================== */

            document
                .querySelectorAll(".faq-item.active")
                .forEach(function (item) {

                    if (item !== currentItem) {

                        item.classList.remove("active");

                        const button =
                            item.querySelector(".faq-question");

                        if (button) {
                            button.setAttribute(
                                "aria-expanded",
                                "false"
                            );
                        }

                    }

                });


            /* =================================================
               TOGGLE FAQ AKTIF
            ================================================== */

            const isActive =
                currentItem.classList.toggle("active");


            this.setAttribute(
                "aria-expanded",
                isActive ? "true" : "false"
            );

        });

    });

});
